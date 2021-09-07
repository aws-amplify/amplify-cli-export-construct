import { CfnFunction } from '@aws-cdk/aws-lambda';
import { BaseIncludedStack } from '../base-included-stack';


export interface ILambdaFunctionIncludedNestedStack {

  lambdaFunction(): CfnFunction;
}

export class LambdaFunctionIncludedNestedStack extends BaseIncludedStack implements ILambdaFunctionIncludedNestedStack {
  lambdaFunction(): CfnFunction {
    return this.getResourceConstruct<CfnFunction>('LambdaFunction');
  }

}