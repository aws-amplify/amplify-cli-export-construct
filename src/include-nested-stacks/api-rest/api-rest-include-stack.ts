import { CfnDeployment, CfnRestApi } from '@aws-cdk/aws-apigateway';
import { IncludedNestedStack } from '@aws-cdk/cloudformation-include';
import { BaseIncludedStack } from '../base-included-stack';

export interface IAPIRestIncludedStack {
  /**
   * Gets the RestApi of the API stack
   * @returns {CfnRestApi}
   */
  getRestAPI(): CfnRestApi;

  /**
     * Gets the Deployment of the Rest API
     * @returns {CfnDeployment}
     */
  getApiDeployment(): CfnDeployment;
}

export class APIRestIncludedStack
  extends BaseIncludedStack
  implements IAPIRestIncludedStack {
  resourceName: string;
  constructor(includedStack: IncludedNestedStack, resourceName: string) {
    super(includedStack);
    this.resourceName = resourceName;
  }
  getRestAPI(): CfnRestApi {
    return this.getResourceConstruct<CfnRestApi>(this.resourceName);
  }

  getApiDeployment(): CfnDeployment {
    return this.getResourceConstruct<CfnDeployment>(
      `DeploymentAPIGW${this.resourceName}`,
    );
  }
}
