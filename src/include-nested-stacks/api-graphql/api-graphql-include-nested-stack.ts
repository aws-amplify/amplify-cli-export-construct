import { CfnApiKey, CfnGraphQLSchema, CfnGraphQLApi } from '@aws-cdk/aws-appsync';
import { IncludedNestedStack } from '@aws-cdk/cloudformation-include';
import { BaseIncludedStack } from '../base-included-stack';


export interface IAPIGraphQLIncludeNestedStack extends IncludedNestedStack {
  /**
   * @returns Appsync Api Key {CfnApiKey} of the auth stack
   * @throws {CfnResourceNotFoundError} if not found
   */
  getAppSyncAPIKey(): CfnApiKey;

  /**
   * @returns {CfnGraphQLSchema} of the api stack
   * @throws {CfnResourceNotFoundError} if not found
   */
  getGraphQLSchema(): CfnGraphQLSchema;

  /**
   * @returns {CfnApiKey} of the api stack
   * @throws {CfnResourceNotFoundError} if not found
   */
  getGraphQLAPI(): CfnGraphQLApi;

  /**
   * @returns {IncludedNestedStack} return nested stack
   * @param tableName is the model name in your Graph QL API
   */

  getModelNestedStack(tableName: string): IncludedNestedStack;
}

export class APIGraphQLIncludedNestedStack extends BaseIncludedStack implements IAPIGraphQLIncludeNestedStack {

  getAppSyncAPIKey(): CfnApiKey {
    return this.getResourceConstruct<CfnApiKey>('GraphQLAPIKey');
  }
  getGraphQLSchema(): CfnGraphQLSchema {
    return this.getResourceConstruct<CfnGraphQLSchema>('GraphQLSchema');
  }
  getGraphQLAPI(): CfnGraphQLApi {
    return this.getResourceConstruct<CfnGraphQLApi>('GraphQLAPI');
  }
  getModelNestedStack(tableName: string): IncludedNestedStack {
    return this.includedTemplate.getNestedStack(tableName);
  }

}