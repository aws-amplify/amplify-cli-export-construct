import { AmplifyExportedBackend, CategoryStackMapping } from '../src';
import * as path from 'path';
import * as cdk from 'aws-cdk-lib';
import * as fs from 'fs-extra';
import { Template } from 'aws-cdk-lib/assertions';
import { ResourceTypeConstants } from './resource-type-string-generator';

// eslint-disable-next-line import/no-unresolved
import { exportBackend, deleteProject, deleteProjectDir, initProjectWithAccessKey, addDEVHosting, addRestApi, addFunction, addApiWithoutSchema, addAuthWithMaxOptions } from './amplify-e2e-core/lib';

jest.setTimeout(500000);

describe('test construct', () => {
  let projRoot: string;
  let exportProj: string;
  let exportedBackendConstruct: AmplifyExportedBackend;
  const projectName = 'exportTestProject';
  let categoryStackMapping:  CategoryStackMapping[];

  beforeAll(async () => {
    projRoot = path.join(__dirname, 'exportTestProject');

    exportProj = path.join(__dirname);
    expect(process.env.AWS_ACCESS_KEY_ID).toBeDefined();
    expect(process.env.AMPLIFY_PATH).toBeDefined();
    expect(process.env.AWS_SECRET_ACCESS_KEY).toBeDefined();
    expect(process.env.AWS_SESSION_TOKEN).toBeDefined();

    fs.ensureDirSync(projRoot);
    await initProjectWithAccessKey(projRoot, {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
      region: 'us-east-2',
    });

    await addApiWithoutSchema(projRoot, { testingWithLatestCodebase: false });
    await addRestApi(projRoot, {
      existingLambda: false,
      isCrud: false,
      projectContainsFunctions: false,
      isFirstRestApi: true,
    });
    await addAuthWithMaxOptions(projRoot, {});
    await addFunction(projRoot, { functionTemplate: 'Hello World' }, 'nodejs');


    await addDEVHosting(projRoot);
    fs.ensureDirSync(exportProj);
    await exportBackend(projRoot, { exportPath: exportProj });
    fs.moveSync(path.join('integ-test', `amplify-export-${projectName}`), path.join(`amplify-export-${projectName}`));
    categoryStackMapping = JSON.parse(fs.readFileSync(path.join(`amplify-export-${projectName}`, 'category-stack-mapping.json'), { encoding: 'utf-8' })) as CategoryStackMapping[];

    const app = new cdk.App();
    exportedBackendConstruct = new AmplifyExportedBackend(app, 'amplify-exported-backend', {
      path: `amplify-export-${projectName}`,
      amplifyEnvironment: 'dev',
    });
  });

  afterAll(async () => {
    await deleteProject(projRoot, {
      region: 'us-east-2',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        sessionToken: process.env.AWS_SESSION_TOKEN
      }
    });
    deleteProjectDir(projRoot);
    deleteProjectDir(`amplify-export-${projectName}`);
  });

  test('exportedBackendConstruct is defined', () => {
    expect(exportedBackendConstruct).toBeDefined();
  });

  test('root Stack is preset', () => {
    Template.fromStack(exportedBackendConstruct.rootStack).resourceCountIs(
      ResourceTypeConstants.AWS.IAM.ROLE, 4);
    Template.fromStack(exportedBackendConstruct.rootStack).resourceCountIs(ResourceTypeConstants.AWS.S3.BUCKET, 1);
    Template.fromStack(exportedBackendConstruct.rootStack).resourceCountIs(ResourceTypeConstants.AWS.LAMBDA.FUNCTION, 2);
    Template.fromStack(exportedBackendConstruct.rootStack).resourceCountIs('Custom::LambdaCallout', 1);
  })

  test('test rest api', () => {
    const service = 'API Gateway';
    categoryStackMapping.filter(r => r.service === service).forEach(mapping => {
      const apiStack = exportedBackendConstruct.apiRestNestedStack(mapping.resourceName);
      Template.fromStack(apiStack.stack).resourceCountIs(ResourceTypeConstants.AWS.APIGATEWAY.RESTAPI, 1);
      Template.fromStack(apiStack.stack).resourceCountIs(ResourceTypeConstants.AWS.APIGATEWAY.DEPLOYMENT, 1);
    })
  });

  test('test graphql api', () => {
    const graphqlApiIncludedStack = exportedBackendConstruct.graphqlNestedStacks();
    Template.fromStack(graphqlApiIncludedStack.stack).resourceCountIs(ResourceTypeConstants.AWS.APPSYNC.GRAPHQLAPI, 1);
    Template.fromStack(graphqlApiIncludedStack.stack).resourceCountIs(ResourceTypeConstants.AWS.APPSYNC.GRAPHQLSCHEMA, 1);

  });

  test('test lambda function', () => {
    exportedBackendConstruct.lambdaFunctionNestedStacks()
    .forEach(lambdaStack => {
      Template.fromStack(lambdaStack.stack).resourceCountIs(ResourceTypeConstants.AWS.LAMBDA.FUNCTION, 1);
      Template.fromStack(lambdaStack.stack).resourceCountIs(ResourceTypeConstants.AWS.IAM.ROLE, 1);
      Template.fromStack(lambdaStack.stack).resourceCountIs(ResourceTypeConstants.AWS.IAM.POLICY, 1);

    })

  });

  test('test auth', () => {
    const authStack = exportedBackendConstruct.authNestedStack();
    Template.fromStack(authStack.stack).resourceCountIs(ResourceTypeConstants.AWS.COGNITO.USERPOOL, 1);
    Template.fromStack(authStack.stack).resourceCountIs(ResourceTypeConstants.AWS.COGNITO.IDENTITYPOOL, 1);
    Template.fromStack(authStack.stack).resourceCountIs(ResourceTypeConstants.AWS.COGNITO.USERPOOLCLIENT, 2);
    Template.fromStack(authStack.stack).resourceCountIs(ResourceTypeConstants.AWS.COGNITO.IDENTITYPOOLROLEATTACHMENT, 1);
  });

  test('test hosting', () => {
    const service = 'S3AndCloudFront'
    const category = 'hosting';
    exportedBackendConstruct.nestedStackByCategortService(category, service)
    .forEach(nestedStack => {
      Template.fromStack(nestedStack.stack).resourceCountIs(ResourceTypeConstants.AWS.S3.BUCKET, 1);
    })
  });

});


