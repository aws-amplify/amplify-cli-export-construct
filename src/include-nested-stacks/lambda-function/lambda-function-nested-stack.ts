import { CfnFunction } from '@aws-cdk/aws-lambda';
import { BaseIncludedStack } from '../base-included-stack';


export interface ILambdaFunctionIncludedNestedStack {

  getLambdaFunction(): CfnFunction;
}

export class LambdaFunctionIncludedNestedStack extends BaseIncludedStack implements ILambdaFunctionIncludedNestedStack {
  getLambdaFunction(): CfnFunction {
    return this.getResourceConstruct<CfnFunction>('LambdaFunction');
  }

}