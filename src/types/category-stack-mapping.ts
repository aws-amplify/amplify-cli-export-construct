import { BucketDeployment } from '@aws-cdk/aws-s3-deployment';

export type CategoryStackMapping = {
  category: string;
  resourceName: string;
  service: string;
};


export type CategoryStackMappingWithDeployment = CategoryStackMapping & {
  bucketDeployment? :BucketDeployment;
}