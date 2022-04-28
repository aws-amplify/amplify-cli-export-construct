import * as path from 'path';
import { Bucket, BucketAccessControl, IBucket } from 'aws-cdk-lib/aws-s3';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { CfnInclude } from 'aws-cdk-lib/cloudformation-include';
import { Stack } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as fs from 'fs-extra';
// eslint-disable-next-line import/no-extraneous-dependencies
import * as _ from 'lodash';
import { v4 } from 'uuid';
import { Constants } from '../constants';
import {
  CategoryStackMapping,
  CategoryStackMappingWithDeployment,
} from '../types/category-stack-mapping';
import { ExportManifest } from '../types/export-manifest';

/**
 * @internal
 */
export interface AmplifyExportAssetHandlerProps {
  exportManifest: ExportManifest;
  categoryStackMapping: CategoryStackMapping[];
  env: string;
  backendPath: string;
}

const {
  FUNCTION_CATEGORY,
  API_CATEGORY,
  AUTH_CATEGORY,
  AMPLIFY_BUILDS,
  AMPLIFY_APPSYNC_FILES,
  AMPLIFY_AUXILIARY_LAMBDAS,
  AMPLIFY_AUTH_ASSETS,
  STACK_PARAMETERS,
  PARAMETERS_DEPLOYMENT_BUCKET_NAME,
  PARAMTERS_AUTH_VERIFICATION_BUCKET_NAME,
  INTERACTIONS_CATEGORY,
} = Constants;

/**
 * @internal
 */
export class AmplifyExportAssetHandler extends Construct {
  private deploymentBucket: IBucket;
  private exportManifest: ExportManifest;
  private categoryStackMapping: CategoryStackMapping[];
  private categoryStackWithDeployment: CategoryStackMappingWithDeployment[];
  private exportPath: string;
  private rootStack: Stack;
  private env?: string;

  private auxiliaryDeployment: BucketDeployment | undefined;

  constructor(scope: Stack, id: string, props: AmplifyExportAssetHandlerProps) {
    super(scope, id);
    this.exportManifest = props.exportManifest;
    this.categoryStackMapping = props.categoryStackMapping;
    this.categoryStackWithDeployment = props.categoryStackMapping;
    this.exportPath = props.backendPath;
    this.rootStack = scope;

    this.deploymentBucket = this.referenceDeploymentBucket();
    this.env = props.env;
  }

  private referenceDeploymentBucket(): IBucket {
    const deploymentBucketName = _.get(this.exportManifest.props.parameters, [
      PARAMETERS_DEPLOYMENT_BUCKET_NAME,
    ]);

    if (!deploymentBucketName) {
      throw new Error('deployment bucket not specified');
    }

    return Bucket.fromBucketName(
      this.rootStack,
      'deployment-bucket',
      deploymentBucketName,
    );
  }

  createAssetsAndUpdateParameters(): ExportManifest {
    const categoryWithDeployment = this.categoryStackMapping.map(
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

          case INTERACTIONS_CATEGORY.NAME: {
            deployment = this.uploadInteractionsLexZip(categoryStack.resourceName);
          }
        }

        return {
          ...categoryStack,
          bucketDeployment: deployment,
        };
      },
    );

    this.auxiliaryDeployment = this.createAuxiliaryFileAsset();
    this.categoryStackWithDeployment = categoryWithDeployment;
    return this.exportManifest;
  }

  setDependencies(
    include: CfnInclude,
  ) {
    this.categoryStackWithDeployment.forEach((stackMapping) => {
      if (stackMapping.bucketDeployment) {
        const stack = include.getResource(
          stackMapping.category + stackMapping.resourceName,
        );
        stack.node.addDependency(stackMapping.bucketDeployment);
      }
      if (
        this.auxiliaryDeployment &&
        stackMapping.category === API_CATEGORY.NAME &&
        stackMapping.service === API_CATEGORY.SERVICE.ELASTIC_CONTAINER
      ) {
        this.rootStack.node.addDependency(this.auxiliaryDeployment);
      }
    });

  }

  private createAuxiliaryFileAsset(): BucketDeployment | undefined {
    const auxiliaryFilePath = path.join(
      this.exportPath,
      AMPLIFY_AUXILIARY_LAMBDAS,
    );
    if (fs.existsSync(auxiliaryFilePath)) {
      const deployment = new BucketDeployment(
        this.rootStack,
        'auxiliary-lambdas',
        {
          destinationBucket: this.deploymentBucket,
          sources: [Source.asset(auxiliaryFilePath)],
          prune: false,
        },
      );
      return deployment;
    }
    return;
  }

  private uploadInteractionsLexZip(resourceName: string): BucketDeployment {
    const filePath = path.join(
      this.exportPath,
      INTERACTIONS_CATEGORY.NAME,
      resourceName,
      AMPLIFY_BUILDS,
    );

    const buildFile = path.join(
      filePath,
      this.validateFilesAndReturnPath(filePath),
    );


    const deployment = new BucketDeployment(
      this,
      `${resourceName}-deployment`,
      {
        destinationBucket: this.deploymentBucket,
        sources: [Source.asset(filePath)],
        destinationKeyPrefix: AMPLIFY_BUILDS,
        prune: false,
      },
    );
    const stacks = this.exportManifest.props.loadNestedStacks;
    const logicalId = `${INTERACTIONS_CATEGORY.NAME}${resourceName}`;

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
      this,
      `${resourceName}-deployment`,
      {
        destinationBucket: this.deploymentBucket,
        sources: [Source.asset(filePath)],
        destinationKeyPrefix: AMPLIFY_BUILDS,
        prune: false,
      },
    );
    const stacks = this.exportManifest.props.loadNestedStacks;
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
      this,
      `${resourceName}-deployment`,
      {
        destinationBucket: this.deploymentBucket,
        sources: [Source.asset(filePath)],
        destinationKeyPrefix: AMPLIFY_BUILDS,
        prune: false,
      },
    );
    const stacks = this.exportManifest.props.loadNestedStacks;
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
      this,
      `Appsync-${resourceName}-deployment`,
      {
        destinationBucket: this.deploymentBucket,
        sources: [Source.asset(filePath)],
        destinationKeyPrefix: destinationKey,
      },
    );

    const stacks = this.exportManifest.props.loadNestedStacks;
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
    const nestedStacks = this.exportManifest.props.loadNestedStacks;
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
        this,
        'auth-verification-bucket',
        verificationWithEnv,
      );
      const authAssets = path.join(
        this.exportPath,
        AUTH_CATEGORY.NAME,
        resourceName,
        AMPLIFY_AUTH_ASSETS,
      );
      new BucketDeployment(this, 'auth-asset-deployment-bucket', {
        destinationBucket: bucket,
        sources: [Source.asset(authAssets)],
        accessControl: BucketAccessControl.PUBLIC_READ,
      });
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
}
