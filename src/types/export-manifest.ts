import { CfnIncludeProps } from '@aws-cdk/cloudformation-include';

export type ExportManifest = {
  stackName: string;
  props: CfnIncludeProps;
}