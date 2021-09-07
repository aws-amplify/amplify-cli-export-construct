import * as path from 'path';
import { Role, ServicePrincipal } from '@aws-cdk/aws-iam';
import { Bucket, BucketAccessControl } from '@aws-cdk/aws-s3';
import { BucketDeployment, ServerSideEncryption, Source } from '@aws-cdk/aws-s3-deployment';
import {
  CfnInclude,
  IncludedNestedStack,
} from '@aws-cdk/cloudformation-include';
import { Construct, Stack } from '@aws-cdk/core';
import * as fs from 'fs-extra';
// eslint-disable-next-line import/no-extraneous-dependencies
import * as _ from 'lodash';
import { v4 } from 'uuid';
import { Constants } from './constants';
import { CategoryStackMapping, CategoryStackMappingWithDeployment } from './types/category-stack-mapping';
import { ExportManifest } from './types/export-manifest';
import { ExportTag } from './types/export-tags';
const {
  AMPLIFY_EXPORT_MANIFEST_FILE,
  AMPLIFY_EXPORT_TAG_FILE,
  AMPLIFY_CATEGORY_MAPPING_FILE,
  FUNCTION_CATEGORY,
  API_CATEGORY,
  AUTH_CATEGORY,
  AMPLIFY_BUILDS,
  AMPLIFY_APPSYNC_FILES,
  AMPLIFY_AUTH_ASSETS,
  STACK_PARAMETERS,
  AMPLIFY_AUXILIARY_LAMBDAS,
  PARAMTERS_AUTH_VERIFICATION_BUCKET_NAME,
} = Constants;
class AmplifyCategoryNotFoundError extends Error {
  constructor(category: string, service?: string) {
    super(`The category: ${category}  ${service ? 'of service: ' + service: '' } not found.`);
  }
}

/**
 * Contains all the utility functions
 */
export class BaseAmplifyExportBackend extends Construct {
  protected categoryStackMappings: CategoryStackMapping[];
  cfnInclude: CfnInclude;
  protected exportPath: string;
  protected exportBackendManifest: ExportManifest;
  protected exportTags: ExportTag[];
  protected auxiliaryDeployment?: BucketDeployment;
  deploymentBucket: any;
  rootStack: Stack;
  readonly env?: string
  constructor(
    scope: Construct,
    id: string,
    exportPath: string,
    stage?: string,
  ) {
    super(scope, id);

    this.env = stage;
    this.exportPath = path.resolve(exportPath);
    const exportBackendManifest = this.getExportedDataFromFile<ExportManifest>(
      AMPLIFY_EXPORT_MANIFEST_FILE,
    );

    this.exportBackendManifest = this.updatePropsToIncludeEnv(
      exportBackendManifest,
    );
    this.categoryStackMappings = this.getExportedDataFromFile<
    CategoryStackMapping[]
    >(AMPLIFY_CATEGORY_MAPPING_FILE);
    this.exportTags = this.getExportedDataFromFile<ExportTag[]>(
      AMPLIFY_EXPORT_TAG_FILE,
    );


  }

  protected createAssetsAndUpdateParameters(): CategoryStackMappingWithDeployment[] {
    const categoryWithDeployment = this.categoryStackMappings.map(
      (categoryStack) => {
        let deployment: BucketDeployment | undefined = undefined;
        switch (categoryStack.category) {
          case FUNCTION_CATEGORY.NAME:
            {
              switch (categoryStack.service) {
                case FUNCTION_CATEGORY.SERVICE.LAMBDA_FUNCTION:
                  deployment = this.uploadLambdaZip(categoryStack.resourceName);
                  break;

                case FUNCTION_CATEGORY.SERVICE.LAMBDA_LAYER:
                  deployment = this.uploadLambdaLayerZips(
                    categoryStack.resourceName,
                  );
                  break;
              }
            }
            break;

          case API_CATEGORY.NAME:
            switch (categoryStack.service) {
              case API_CATEGORY.SERVICE.APP_SYNC:
                deployment = this.uploadAppSyncFiles(
                  categoryStack.resourceName,
                );
                break;
              case API_CATEGORY.SERVICE.ELASTIC_CONTAINER:
                deployment = this.uploadElasticContainerFiles(categoryStack.resourceName);
                break;
            }
            break;

          case AUTH_CATEGORY.NAME:
            switch (categoryStack.service) {
              case AUTH_CATEGORY.SERVICE.COGNITO:
                deployment = this.uploadAuthTriggerFiles(
                  categoryStack.resourceName,
                );
                break;
            }
            break;
        }
        return {
          ...categoryStack,
          bucketDeployment: deployment,
        };
      },
    );
    this.auxiliaryDeployment = this.createAuxiliaryFileAsset();
    return categoryWithDeployment;
  }

  createAuxiliaryFileAsset(): BucketDeployment | undefined {
    const auxiliaryFilePath = path.join(this.exportPath, AMPLIFY_AUXILIARY_LAMBDAS);
    if (fs.existsSync(auxiliaryFilePath)) {
      const deployment = new BucketDeployment(this.rootStack, 'auxiliary-lambdas', {
        destinationBucket: this.deploymentBucket,
        sources: [Source.asset(auxiliaryFilePath)],
        prune: false,
      });
      return deployment;
    }
    return;
  }

  private uploadElasticContainerFiles(resourceName: string): BucketDeployment | undefined {
    const filePath = path.join(
      this.exportPath,
      API_CATEGORY.NAME,
      resourceName,
      AMPLIFY_BUILDS,
    );
    const buildFile = path.join(
      filePath,
      this.validateFilesAndReturnPath(filePath),
    );
    const deployment = new BucketDeployment(
      this.rootStack,
      `${resourceName}-deployment`,
      {
        destinationBucket: this.deploymentBucket,
        sources: [Source.asset(filePath)],
        destinationKeyPrefix: AMPLIFY_BUILDS,
        prune: false,
      },
    );
    const stacks = this.exportBackendManifest.props.loadNestedStacks;
    const logicalId = `${API_CATEGORY.NAME}${resourceName}`;

    if (stacks) {
      const parameters = stacks[logicalId].parameters;
      if (parameters) {
        // parameters[STACK_PARAMETERS.FUNCTION.DEPLOYMENT_BUCKET_NAME] =
        //   this.deploymentBucket.bucketName;
        parameters[
          STACK_PARAMETERS.API.PARAM_ZIP_PATH
        ] = `${AMPLIFY_BUILDS}/${path.basename(buildFile)}`;
      }
    }
    return deployment;
  }

  protected setDependencies(
    include: CfnInclude,
    categoryStackMappingDeployments: CategoryStackMappingWithDeployment[],
  ) {
    categoryStackMappingDeployments.forEach((stackMapping) => {
      if (stackMapping.bucketDeployment) {
        console.log(stackMapping.category + stackMapping.resourceName);
        const stack = include.getResource(
          stackMapping.category + stackMapping.resourceName,
        );
        stack.node.addDependency(stackMapping.bucketDeployment);
        if (this.auxiliaryDeployment && stackMapping.category === API_CATEGORY.NAME &&
            stackMapping.service === API_CATEGORY.SERVICE.ELASTIC_CONTAINER) {
          stack.node.addDependency(this.auxiliaryDeployment);
        }
      }
    });
  }


  private uploadLambdaZip(resourceName: string): BucketDeployment {
    const filePath = path.join(
      this.exportPath,
      FUNCTION_CATEGORY.NAME,
      resourceName,
      AMPLIFY_BUILDS,
    );
    const buildFile = path.join(
      filePath,
      this.validateFilesAndReturnPath(filePath),
    );
    const deployment = new BucketDeployment(
      this.rootStack,
      `${resourceName}-deployment`,
      {
        destinationBucket: this.deploymentBucket,
        sources: [Source.asset(filePath)],
        destinationKeyPrefix: AMPLIFY_BUILDS,
        prune: false,
      },
    );
    const stacks = this.exportBackendManifest.props.loadNestedStacks;
    const logicalId = `${FUNCTION_CATEGORY.NAME}${resourceName}`;

    if (stacks) {
      const parameters = stacks[logicalId].parameters;
      if (parameters) {
        parameters[STACK_PARAMETERS.FUNCTION.DEPLOYMENT_BUCKET_NAME] =
          this.deploymentBucket.bucketName;
        parameters[
          STACK_PARAMETERS.FUNCTION.S3_KEY
        ] = `${AMPLIFY_BUILDS}/${path.basename(buildFile)}`;
      }
    }
    return deployment;
  }

  private uploadLambdaLayerZips(resourceName: string): BucketDeployment {
    const filePath = path.join(
      this.exportPath,
      FUNCTION_CATEGORY.NAME,
      resourceName,
      AMPLIFY_BUILDS,
    );
    const deployment = new BucketDeployment(
      this.rootStack,
      `${resourceName}-deployment`,
      {
        destinationBucket: this.deploymentBucket,
        sources: [Source.asset(filePath)],
        destinationKeyPrefix: AMPLIFY_BUILDS,
        prune: false,
      },
    );
    const stacks = this.exportBackendManifest.props.loadNestedStacks;
    const logicalId = `${FUNCTION_CATEGORY.NAME}${resourceName}`;
    if (stacks) {
      const parameters = stacks[logicalId].parameters;
      if (parameters) {
        parameters[STACK_PARAMETERS.FUNCTION.DEPLOYMENT_BUCKET_NAME] =
          this.deploymentBucket.bucketName;
        parameters[STACK_PARAMETERS.FUNCTION.S3_KEY] = AMPLIFY_BUILDS;
      }
    }
    return deployment;
  }

  private uploadAppSyncFiles(resourceName: string): BucketDeployment {
    const filePath = path.join(
      this.exportPath,
      API_CATEGORY.NAME,
      resourceName,
      AMPLIFY_APPSYNC_FILES,
    );
    if (!fs.existsSync(filePath)) {
      throw new Error('Cannot find appsync resources');
    }
    const destinationKey = `assets/${AMPLIFY_APPSYNC_FILES}/${v4().replace(
      '-',
      '',
    )}`;
    const bucketDeployment = new BucketDeployment(
      this.rootStack,
      `Appsync-${resourceName}-deployment`,
      {
        destinationBucket: this.deploymentBucket,
        sources: [Source.asset(filePath)],
        destinationKeyPrefix: destinationKey,
      },
    );

    const stacks = this.exportBackendManifest.props.loadNestedStacks;
    const logicalId = `${API_CATEGORY.NAME}${resourceName}`;
    if (stacks && stacks[logicalId]) {
      const parameters = stacks[logicalId].parameters;
      if (parameters) {
        parameters[STACK_PARAMETERS.API.DEPLOYMENT_BUCKET_NAME] =
          this.deploymentBucket.bucketName;
        parameters[STACK_PARAMETERS.API.DEPLOYMENT_ROOT_KEY] = destinationKey;
      }
    }
    return bucketDeployment;
  }

  private uploadAuthTriggerFiles(resourceName: string): undefined {
    const logicalId = `${AUTH_CATEGORY.NAME}${resourceName}`;
    const nestedStacks = this.exportBackendManifest.props.loadNestedStacks;
    const verificationBucketName = _.get(nestedStacks, [
      logicalId,
      'parameters',
      PARAMTERS_AUTH_VERIFICATION_BUCKET_NAME,
    ]);
    if (verificationBucketName) {
      const verificationWithEnv = this.env
        ? `${verificationBucketName}-${this.env}`
        : verificationBucketName;

      const bucket = Bucket.fromBucketName(
        this.rootStack,
        'auth-verification-bucket',
        verificationWithEnv,

      );
      const authAssets = path.join(
        this.exportPath,
        AUTH_CATEGORY.NAME,
        resourceName,
        AMPLIFY_AUTH_ASSETS,
      );
      const role = new Role(this.rootStack, 'auth-asset-deployment-role', {
        assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
      });
      bucket.grantDelete(role);
      bucket.grantPutAcl(role);
      bucket.grantPut(role);
      bucket.grantWrite(role);
      new BucketDeployment(this.rootStack, 'auth-asset-deployment', {
        destinationBucket: bucket,
        role: role,
        sources: [Source.asset(authAssets)],
        prune: false,
        serverSideEncryption: ServerSideEncryption.AES_256,
        accessControl: BucketAccessControl.PUBLIC_READ,
      }).node.addDependency(role);
    }
    return;
  }

  private validateFilesAndReturnPath(filePath: string): string {
    const allFiles = fs.readdirSync(filePath);
    if (allFiles?.length > 1) {
      throw new Error();
    }
    const zipFile = allFiles.find((file) => path.extname(file) === '.zip');
    if (zipFile) {
      return zipFile;
    }

    throw new Error('Zip file not found for category');
  }

  protected findResourceForNestedStack(
    category: string,
    service: string,
    resourceName?: string,
  ): CategoryStackMapping {
    const categoryStack = this.categoryStackMappings.find(
      (r) =>
        r.category === category &&
        r.service === service &&
        (resourceName ? r.resourceName === resourceName : true),
    );
    if (!categoryStack) {
      throw new AmplifyCategoryNotFoundError(category, service);
    }
    return categoryStack;
  }

  protected filterCategory(
    category: string,
    service?: string,
    resourceName?: string,
  ): CategoryStackMapping[] {
    const categoryStackMapping = this.categoryStackMappings.filter(
      (r) =>
        r.category === category &&
        (service ? r.service === service : true) &&
        (resourceName ? r.resourceName === resourceName : true),
    );
    if (categoryStackMapping.length === 0) {
      throw new AmplifyCategoryNotFoundError(category, service);
    }
    return categoryStackMapping;
  }

  protected getCategoryNestedStack(
    categoryStackMapping: CategoryStackMapping,
  ): IncludedNestedStack {
    return this.cfnInclude.getNestedStack(
      categoryStackMapping.category + categoryStackMapping.resourceName,
    );
  }

  protected getExportedDataFromFile<T>(fileName: string): T {
    const filePath = path.join(this.exportPath, fileName);
    if (!fs.existsSync(filePath)) {
      throw new Error(`${fileName} file does not exist`);
    }
    return JSON.parse(fs.readFileSync(filePath, { encoding: 'utf-8' })) as T;
  }

  private modifyEnv(nameWithEnv: string): string {
    let splitValues = nameWithEnv.split('-');
    if (this.env) {
      splitValues[2] = this.env;
    } else {
      splitValues.splice(2, 1);
    }
    return splitValues.join('-');
  }

  private updatePropsToIncludeEnv(
    exportManifest: ExportManifest,
  ): ExportManifest {
    const props = exportManifest.props;

    exportManifest.stackName = this.modifyEnv(exportManifest.stackName);
    if (!props.parameters) {
      throw new Error('Root Stack Parameters cannot be null');
    }
    const parameterKeysToUpdate = [
      'AuthRoleName',
      'UnauthRoleName',
      'DeploymentBucketName',
    ];

    for (const parameterKey of parameterKeysToUpdate) {
      if (parameterKey in props.parameters) {
        props.parameters[parameterKey] = this.modifyEnv(props.parameters[parameterKey]);
      } else {
        throw new Error(`${parameterKey} not present in Root Stack Parameters`);
      }
    }
    const nestedStacks = props.loadNestedStacks;
    if (nestedStacks) {
      Object.keys(nestedStacks).forEach((nestedStackKey) => {
        const nestedStack = nestedStacks[nestedStackKey];
        if (nestedStack.parameters && 'env' in nestedStack.parameters) {
          nestedStack.parameters.env = this.env;
        }
      });
    }
    return exportManifest;
  }
}
