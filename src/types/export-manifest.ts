import { CfnIncludeProps } from '@aws-cdk/cloudformation-include';

export interface ExportManifest {
  readonly stackName: string;
  readonly props: CfnIncludeProps;
}