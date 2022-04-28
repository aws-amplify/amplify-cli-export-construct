import * as path from 'path';
import { BucketDeployment } from 'aws-cdk-lib/aws-s3-deployment';
import { Construct, } from 'constructs';
import * as fs from 'fs-extra';
import {
  CfnIncludeProps,
} from 'aws-cdk-lib/cloudformation-include';
// eslint-disable-next-line import/no-extraneous-dependencies
import * as _ from 'lodash';
import { Constants } from './constants';
import { CategoryStackMapping } from './types/category-stack-mapping';
import { ExportManifest } from './types/export-manifest';
import { ExportTag } from './types/export-tags';
const {
  AMPLIFY_EXPORT_MANIFEST_FILE,
  AMPLIFY_EXPORT_TAG_FILE,
  AMPLIFY_CATEGORY_MAPPING_FILE,
} = Constants;
class AmplifyCategoryNotFoundError extends Error {
  constructor(category: string, service?: string) {
    super(`The category: ${category}  ${service ? 'of service: ' + service: '' } not found.`);
  }
}

/**
 * Contains all the utility functions
 * @internal
 */
export class BaseAmplifyExportedBackend extends Construct {
  protected categoryStackMappings: CategoryStackMapping[];
  protected exportPath: string;
  protected exportBackendManifest: ExportManifest;
  protected exportTags: ExportTag[];
  protected auxiliaryDeployment?: BucketDeployment;
  protected env?: string
  constructor(
    scope: Construct,
    id: string,
    exportPath: string,
    amplifyEnvironment: string,
  ) {
    super(scope, id);

    this.env = amplifyEnvironment;
    this.exportPath = this.validatePath(exportPath);
    
    
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
  private validatePath(exportPath: string): string {
    const resolvePath = path.resolve(exportPath);
    if(!fs.existsSync(resolvePath)) {
      throw new Error(`Could not find path ${resolvePath}`)
    }

    const stat = fs.statSync(resolvePath);

    if(!stat.isDirectory()){
      throw new Error(`The path ${resolvePath} is not a directory`);
    }

    return resolvePath;
  }
  
  protected transformTemplateFile(cfnIncludeProps: CfnIncludeProps, exportPath: string) : CfnIncludeProps {
    
    if(!cfnIncludeProps.loadNestedStacks){
      return cfnIncludeProps;
    }

    const newProps: CfnIncludeProps = {
      ...cfnIncludeProps,
      templateFile: path.join(exportPath, cfnIncludeProps.templateFile),
      loadNestedStacks: cfnIncludeProps.loadNestedStacks ? 
        Object.keys(cfnIncludeProps.loadNestedStacks).reduce((obj: any, key: string) => {
          if(cfnIncludeProps.loadNestedStacks &&  key in cfnIncludeProps.loadNestedStacks) {
            obj[key] = this.transformTemplateFile(cfnIncludeProps.loadNestedStacks[key], exportPath);
          }
          return obj;
        }, {}) : 
        cfnIncludeProps.loadNestedStacks
    };
    
    
    
    return newProps;
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

  protected getExportedDataFromFile<T>(fileName: string): T {
    const filePath = path.join(this.exportPath, fileName);
    if (!fs.existsSync(filePath)) {
      throw new Error(`Cannot find ${fileName} in the directory ${this.exportPath}`);
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

    const stackName = this.modifyEnv(exportManifest.stackName);
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
    return {
      ...exportManifest,
      stackName,
    };
  }
}
