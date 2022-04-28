import { CfnIncludeProps } from 'aws-cdk-lib/cloudformation-include';

export interface ExportManifest {
  readonly stackName: string;
  readonly props: CfnIncludeProps;
}
