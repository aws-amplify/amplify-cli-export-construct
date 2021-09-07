import { CfnApiKey, CfnGraphQLSchema, CfnGraphQLApi } from '@aws-cdk/aws-appsync';
import { IncludedNestedStack } from '@aws-cdk/cloudformation-include';
import { BaseIncludedStack } from '../base-included-stack';


export interface IAPIGraphQLIncludeNestedStack {
  /**
   * @returns Appsync Api Key {CfnApiKey} of the auth stack
   * @throws {CfnResourceNotFoundError} if not found
   */
  appSyncAPIKey(): CfnApiKey;

  /**
   * @returns {CfnGraphQLSchema} of the api stack
   * @throws {CfnResourceNotFoundError} if not found
   */
  graphQLSchema(): CfnGraphQLSchema;

  /**
   * @returns {CfnApiKey} of the api stack
   * @throws {CfnResourceNotFoundError} if not found
   */
  graphQLAPI(): CfnGraphQLApi;

  /**
   * @returns {IncludedNestedStack} return nested stack
   * @param tableName is the model name in your Graph QL API
   */

  modelNestedStack(tableName: string): IncludedNestedStack;
}

export class APIGraphQLIncludedNestedStack extends BaseIncludedStack implements IAPIGraphQLIncludeNestedStack {

  appSyncAPIKey(): CfnApiKey {
    return this.getResourceConstruct<CfnApiKey>('GraphQLAPIKey');
  }

  graphQLSchema(): CfnGraphQLSchema {
    return this.getResourceConstruct<CfnGraphQLSchema>('GraphQLSchema');
  }

  graphQLAPI(): CfnGraphQLApi {
    return this.getResourceConstruct<CfnGraphQLApi>('GraphQLAPI');
  }

  modelNestedStack(tableName: string): IncludedNestedStack {
    return this.includedTemplate.getNestedStack(tableName);
  }

}