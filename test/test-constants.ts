

export const manifest_test = {
  stackName: 'amplify-amplifyexportest-dev-102335',
  props: {
    templateFile:
          'amplify-export-amplifyexportest/root-stack-template.json',
    parameters: {
      AuthRoleName: 'amplify-amplifyexportest-dev-102335-authRole',
      UnauthRoleName: 'amplify-amplifyexportest-dev-102335-unauthRole',
      DeploymentBucketName:
            'amplify-amplifyexportest-dev-102335-deployment',
    },
    preserveLogicalIds: true,
    loadNestedStacks: {
      apiamplifyexportest: {
        templateFile:
              'amplify-export-amplifyexportest/api/amplifyexportest/cloudformation-template.json',
        parameters: {
          S3DeploymentBucket:
                'amplify-amplifyexportest-dev-102335-deployment',
          S3DeploymentRootKey:
                'amplify-appsync-files/7b4fb6388e5aa3dca729cf8d3d8cbfc8353a4870',
          env: 'dev',
        },
        preserveLogicalIds: true,
        loadNestedStacks: {
          CustomResourcesjson: {
            templateFile:
                  'amplify-export-amplifyexportest/api/amplifyexportest/amplify-appsync-files/stacks/CustomResources.json',
            preserveLogicalIds: true,
            loadNestedStacks: {},
          },
          Todo: {
            templateFile:
                  'amplify-export-amplifyexportest/api/amplifyexportest/amplify-appsync-files/stacks/Todo.json',
            preserveLogicalIds: true,
            loadNestedStacks: {},
          },
        },
      },
      authamplifyexportestd3062483: {
        templateFile:
              'amplify-export-amplifyexportest/auth/amplifyexportestd3062483/amplifyexportestd3062483-cloudformation-template.yml',
        parameters: {
          env: 'dev',
        },
        preserveLogicalIds: true,
        loadNestedStacks: {},
      },
      functionamplifyexportest13c53bd0: {
        templateFile:
              'amplify-export-amplifyexportest/function/amplifyexportest13c53bd0/amplifyexportest13c53bd0-cloudformation-template.json',
        parameters: {
          env: 'dev',
        },
        preserveLogicalIds: true,
        loadNestedStacks: {},
      },
      storagemybucket: {
        templateFile:
              'amplify-export-amplifyexportest/storage/mybucket/s3-cloudformation-template.json',
        parameters: {
          bucketName: 'lolbucketreallylongbucket',
          env: 'dev',
        },
        preserveLogicalIds: true,
        loadNestedStacks: {},
      },
    },
  },
};

export const stack_mapping_test = [
  {
    category: 'function',
    resourceName: 'amplifyexportest13c53bd0',
    service: 'Lambda',
  },
  {
    category: 'auth',
    resourceName: 'amplifyexportestd3062483',
    service: 'Cognito',
  },
  {
    category: 'api',
    resourceName: 'amplifyexportest',
    service: 'AppSync',
  },
  {
    category: 'storage',
    resourceName: 'mybucket',
    service: 'S3',
  },
];