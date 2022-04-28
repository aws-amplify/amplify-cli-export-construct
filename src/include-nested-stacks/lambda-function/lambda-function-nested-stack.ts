import { CfnFunction } from 'aws-cdk-lib/aws-lambda';
import { BaseIncludedStack } from '../base-included-stack';
export class LambdaFunctionIncludedNestedStack extends BaseIncludedStack {
  lambdaFunction(): CfnFunction {
    return this.getResourceConstruct<CfnFunction>('LambdaFunction');
  }

}
