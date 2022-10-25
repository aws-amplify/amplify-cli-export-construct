import { CfnApiKey, CfnGraphQLSchema, CfnGraphQLApi } from 'aws-cdk-lib/aws-appsync';
import { IncludedNestedStack } from 'aws-cdk-lib/cloudformation-include';
import { BaseIncludedStack } from '../base-included-stack';


export class APIGraphQLIncludedNestedStack extends BaseIncludedStack {

  /**
   * @returns Appsync Api Key {CfnApiKey} of the auth stack
   * @throws {CfnResourceNotFoundError} if not found
   */
  appSyncAPIKey(): CfnApiKey {
    return this.getResourceConstruct<CfnApiKey>('GraphQLAPIKey');
  }

  /**
   * @returns {CfnGraphQLSchema} of the api stack
   * @throws {CfnResourceNotFoundError} if not found
   */
  graphQLSchema(): CfnGraphQLSchema {
    return this.getResourceConstruct<CfnGraphQLSchema>('GraphQLSchema');
  }

  /**
   * @returns {CfnApiKey} of the api stack
   * @throws {CfnResourceNotFoundError} if not found
   */
  graphQLAPI(): CfnGraphQLApi {
    return this.getResourceConstruct<CfnGraphQLApi>('GraphQLAPI');
  }

  /**
   * @returns {IncludedNestedStack} return nested stack
   * @param tableName is the model name in your Graph QL API
   */
  modelNestedStack(tableName: string): IncludedNestedStack {
    return this.includedTemplate.getNestedStack(tableName);
  }

}
