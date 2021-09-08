import {
  CfnInclude,
  IncludedNestedStack,
} from '@aws-cdk/cloudformation-include';
import * as cdk from '@aws-cdk/core';
// eslint-disable-next-line import/no-extraneous-dependencies
import * as _ from 'lodash';
import { AmplifyExportedBackendProps } from './amplify-exported-backend-props';
import { BaseAmplifyExportBackend } from './base-exported-backend';
import { Constants } from './constants';
import { AmplifyExportAssetHandler } from './export-backend-asset-handler';
import {
  APIGraphQLIncludedNestedStack,
  APIRestIncludedStack,
  AuthIncludedNestedStack,
  IAPIGraphQLIncludeNestedStack,
  IAPIRestIncludedStack,
  IAuthIncludeNestedStack,
} from './include-nested-stacks';
import {
  ILambdaFunctionIncludedNestedStack,
  LambdaFunctionIncludedNestedStack,
} from './include-nested-stacks/lambda-function/lambda-function-nested-stack';
import { CategoryStackMapping } from './types/category-stack-mapping';

const { API_CATEGORY, AUTH_CATEGORY, FUNCTION_CATEGORY } = Constants;

/**
 * Represents the Amplify Exported Backend Stack
 */
export interface IAmplifyExportedBackend {
  /**
   * Used to get the auth stack
   * @returns the nested stack of type {IAuthIncludeNestedStack}
   * @throws {AmplifyCategoryNotFoundError} if the auth stack doesn't exist
   */
  authNestedStack(): IAuthIncludeNestedStack;

  /**
   * Used to get the api graphql stack from the backend
   * @returns the nested stack of type {IAPIGraphQLIncludeNestedStack}
   * @throws {AmplifyCategoryNotFoundError} if the API graphql stack doesn't exist
   */
  graphqlNestedStacks(): IAPIGraphQLIncludeNestedStack;

  /**
   * Used to get rest api stack from the backend
   * @param resourceName
   * @return {IAPIRestIncludedStack} the nested of type Rest API
   * @throws {AmplifyCategoryNotFoundError} if the API Rest stack doesn't exist
   */
  apiRestNestedStack(resourceName: string): IAPIRestIncludedStack;

  /**
   * Used to get a specific lambda function from the backend
   * @returns {ILambdaFunctionIncludedNestedStack}
   * @param functionName the function name to get from the nested stack
   * @throws {AmplifyCategoryNotFoundError} if the lambda function stack doesn't exist
   */
  lambdaFunctionNestedStackByName(
    functionName: string
  ): ILambdaFunctionIncludedNestedStack;

  /**
   * Used to get all the lambda functions from the backend
   * @returns {ILambdaFunctionIncludedNestedStack[]}
   * @throws {AmplifyCategoryNotFoundError} if the no Lambda Function stacks are found
   */
  lambdaFunctionNestedStacks(): ILambdaFunctionIncludedNestedStack[];

  /**
   * Return the stacks defined in the backend
   * @param category of the categories defined in Amplify CLI like function, api, auth etc
   * @param resourceName @default is undefined
   */
  nestedStacksByCategory(
    category: string,
    resourceName?: string
  ): IncludedNestedStack[];
}

/***
 *
 */
export class AmplifyExportedBackend
  extends BaseAmplifyExportBackend
  implements IAmplifyExportedBackend {
  cfnInclude: CfnInclude;
  rootStack: cdk.Stack;

  constructor(
    scope: cdk.Construct,
    id: string,
    props: AmplifyExportedBackendProps,
  ) {
    super(scope, id, props.path, props.stage);

    this.rootStack = new cdk.Stack(scope, 'AmplifyStack', {
      ...props,
      stackName: this.exportBackendManifest.stackName,
    });

    const amplifyExportHandler = new AmplifyExportAssetHandler(
      this.rootStack,
      'asset-handler',
      {
        backendPath: props.path,
        categoryStackMapping: this.categoryStackMappings,
        env: props.stage ? props.stage : 'dev',
        exportManifest: this.exportBackendManifest,
      },
    );
    this.exportBackendManifest =
      amplifyExportHandler.createAssetsAndUpdateParameters();

    const include = new CfnInclude(
      this.rootStack,
      'AmplifyCfnInclude',
      this.exportBackendManifest.props,
    );

    this.cfnInclude = include;

    amplifyExportHandler.setDependencies(include);

    this.applyTags(this.rootStack, props.stage);

  }

  private applyTags(rootStack: cdk.Stack, env: string = 'dev') {
    this.exportTags.forEach((tag) => {
      rootStack.tags.setTag(tag.key, tag.value.replace('{project-env}', env));
    });
  }

  authNestedStack(): IAuthIncludeNestedStack {
    const cognitoResource = this.findResourceForNestedStack(
      AUTH_CATEGORY.NAME,
      AUTH_CATEGORY.SERVICE.COGNITO,
    );
    const stack = this.getCategoryNestedStack(cognitoResource);
    return new AuthIncludedNestedStack(stack);
  }

  graphqlNestedStacks(): IAPIGraphQLIncludeNestedStack {
    const categoryStackMapping = this.findResourceForNestedStack(
      API_CATEGORY.NAME,
      API_CATEGORY.SERVICE.APP_SYNC,
    );
    return new APIGraphQLIncludedNestedStack(
      this.getCategoryNestedStack(categoryStackMapping),
    );
  }

  lambdaFunctionNestedStacks(): ILambdaFunctionIncludedNestedStack[] {
    return this.filterCategory(
      FUNCTION_CATEGORY.NAME,
      FUNCTION_CATEGORY.SERVICE.LAMBDA_FUNCTION,
    )
      .map((category) => this.getCategoryNestedStack(category))
      .map((stack) => new LambdaFunctionIncludedNestedStack(stack));
  }

  lambdaFunctionNestedStackByName(
    functionName: string,
  ): ILambdaFunctionIncludedNestedStack {
    const category = this.findResourceForNestedStack(
      FUNCTION_CATEGORY.NAME,
      FUNCTION_CATEGORY.SERVICE.LAMBDA_FUNCTION,
      functionName,
    );
    return new LambdaFunctionIncludedNestedStack(
      this.getCategoryNestedStack(category),
    );
  }

  nestedStacksByCategory(
    category: string,
    resourceName?: string,
  ): IncludedNestedStack[] {
    return this.filterCategory(category, undefined, resourceName).map(
      this.getCategoryNestedStack,
    );
  }

  apiRestNestedStack(resourceName: string): IAPIRestIncludedStack {
    const categoryStackMapping = this.findResourceForNestedStack(
      API_CATEGORY.NAME,
      API_CATEGORY.SERVICE.API_GATEWAY,
      resourceName,
    );
    const stack = this.getCategoryNestedStack(categoryStackMapping);
    return new APIRestIncludedStack(stack, resourceName);
  }

  private getCategoryNestedStack(
    categoryStackMapping: CategoryStackMapping,
  ): IncludedNestedStack {
    return this.cfnInclude.getNestedStack(
      categoryStackMapping.category + categoryStackMapping.resourceName,
    );
  }
}
