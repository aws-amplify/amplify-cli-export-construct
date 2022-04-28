import { CfnDeployment, CfnRestApi } from 'aws-cdk-lib/aws-apigateway';
import { IncludedNestedStack } from 'aws-cdk-lib/cloudformation-include';
import { BaseIncludedStack } from '../base-included-stack';

export class APIRestIncludedStack
  extends BaseIncludedStack {
  resourceName: string;
  constructor(includedStack: IncludedNestedStack, resourceName: string) {
    super(includedStack);
    this.resourceName = resourceName;
  }

  /**
   * Gets the RestApi of the API stack
   * @returns {CfnRestApi}
   */
  restAPI(): CfnRestApi {
    return this.getResourceConstruct<CfnRestApi>(this.resourceName);
  }


  /**
     * Gets the Deployment of the Rest API
     * @returns {CfnDeployment}
     */
  apiDeployment(): CfnDeployment {
    return this.getResourceConstruct<CfnDeployment>(
      `DeploymentAPIGW${this.resourceName}`,
    );
  }
}
