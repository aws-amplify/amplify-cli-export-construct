import { CfnInclude, IncludedNestedStack } from 'aws-cdk-lib/cloudformation-include';
import { NestedStack } from 'aws-cdk-lib';

export class CfnResourceNotFoundError extends Error {
  constructor(logicalId: string, type: string) {
    super(`Resource ${logicalId} of type ${type} not found `);
  }
}
/**
 * @internal
 */
export class BaseIncludedStack {
  includedTemplate: CfnInclude;
  stack: NestedStack;
  constructor(includedStack: IncludedNestedStack) {
    this.includedTemplate = includedStack.includedTemplate;
    this.stack = includedStack.stack;
  }

  getResourceConstruct<T>(logicalId: string): T {
    const construct = this.includedTemplate.getResource(logicalId) as unknown as T;
    if (!construct) {
      throw new CfnResourceNotFoundError(logicalId, typeof construct);
    }

    return construct;
  }
}
