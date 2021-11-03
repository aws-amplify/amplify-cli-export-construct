import { AmplifyExportBackend, CategoryStackMapping } from '../src';
import * as path from 'path';
import * as cdk from '@aws-cdk/core';
import * as fs from 'fs-extra';
import { expect as cdkExpect, countResources, haveResource, } from '@aws-cdk/assert';
import { ResourceTypeConstants } from './resource-type-string-generator';
// eslint-disable-next-line import/no-unresolved
//import { exportBackend, /*deleteProject, deleteProjectDir,*/ initProjectWithAccessKey, addAuthWithMaxOptions, addConvert, addDEVHosting, addInterpret, addRestApi, addS3StorageWithIdpAuth, addSMSNotification, addSampleInteraction, addFunction } from './amplify-e2e-core/lib';

jest.setTimeout(500000);

describe('test construct', () => {
  let projRoot: string;
  //let exportProj: string;
  let exportedBackendConstruct: AmplifyExportBackend;
  const projectName = 'exportTestProject';
  let categoryStackMapping:  CategoryStackMapping[];

  beforeAll(async () => {
    projRoot = path.join(__dirname, 'exportTestProject');
    categoryStackMapping = JSON.parse(fs.readFileSync(path.join(`amplify-export-${projectName}`, 'category-stack-mapping.json'), { encoding: 'utf-8' })) as CategoryStackMapping[];

    //exportProj = path.join(__dirname);
    // expect(process.env.AWS_ACCESS_KEY_ID).toBeDefined();
    // expect(process.env.AMPLIFY_PATH).toBeDefined();
    // expect(process.env.AWS_SECRET_ACCESS_KEY).toBeDefined();
    // expect(process.env.AWS_SESSION_TOKEN).toBeDefined();
    
    fs.ensureDirSync(projRoot);
    // await initProjectWithAccessKey(projRoot, {
    //   accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    //   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    //   region: 'us-east-2',
    // });
    // await addAuthWithMaxOptions(projRoot, {});
    // await addSampleInteraction(projRoot, {});
    // await addFunction(projRoot, { functionTemplate: 'Hello World' }, 'nodejs');
    // //await addApiWithoutSchema(projRoot);

    // await addSMSNotification(projRoot, { resourceName: 'export-test' });
    // await addRestApi(projRoot, {
    //   existingLambda: false,
    //   isCrud: false,
    //   isFirstRestApi: false,
    // });
    // await addDEVHosting(projRoot);
    // await addS3StorageWithIdpAuth(projRoot);
    // await addConvert(projRoot, {});
    // await addInterpret(projRoot, {});
    // fs.ensureDirSync(exportProj);
    // await exportBackend(projRoot, { exportPath: exportProj });
    // fs.moveSync(path.join('integ-test', `amplify-export-${projectName}`), path.join(`amplify-export-${projectName}`));
    const app = new cdk.App();
    exportedBackendConstruct = new AmplifyExportBackend(app, 'amplify-exported-backend', {
      path: `amplify-export-${projectName}`,
      stage: 'dev',
    });
  });

  afterAll(async () => {
    // await deleteProject(projRoot, {
    //   region: 'us-east-2',
    //   credentials: {
    //     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    //     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    //     sessionToken: process.env.AWS_SESSION_TOKEN
    //   }
    // });
    // deleteProjectDir(projRoot);
    // deleteProjectDir(`amplify-export-${projectName}`);
  });

  test('exportedBackendConstruct is defined', () => {
    expect(exportedBackendConstruct).toBeDefined();
  });

  test('root Stack is preset', () => {
    cdkExpect(exportedBackendConstruct.rootStack).to(countResources(
      ResourceTypeConstants.AWS.IAM.ROLE, 4));
    cdkExpect(exportedBackendConstruct.rootStack).to(haveResource(ResourceTypeConstants.AWS.S3.BUCKET));
    cdkExpect(exportedBackendConstruct.rootStack).to(haveResource(ResourceTypeConstants.AWS.LAMBDA.FUNCTION));
    cdkExpect(exportedBackendConstruct.rootStack).to(haveResource('Custom::LambdaCallout'));
  })

  test('test rest api', () => {
    const service = 'API Gateway';
    categoryStackMapping.filter(r => r.service === service).forEach(mapping => {
      const apiStack = exportedBackendConstruct.apiRestNestedStack(mapping.resourceName);
      cdkExpect(apiStack.stack).to(haveResource(ResourceTypeConstants.AWS.APIGATEWAY.RESTAPI));
      cdkExpect(apiStack.stack).to(haveResource(ResourceTypeConstants.AWS.APIGATEWAY.DEPLOYMENT));
    })
  });

  test('test lambda function', () => {
    exportedBackendConstruct.lambdaFunctionNestedStacks()
    .forEach(lambdaStack => {
      cdkExpect(lambdaStack.stack).to(haveResource(ResourceTypeConstants.AWS.LAMBDA.FUNCTION));
      cdkExpect(lambdaStack.stack).to(haveResource(ResourceTypeConstants.AWS.IAM.ROLE));
      cdkExpect(lambdaStack.stack).to(haveResource(ResourceTypeConstants.AWS.IAM.POLICY));

    })
    
  });

  test('test auth', () => {
    const authStack = exportedBackendConstruct.authNestedStack();
    cdkExpect(authStack.stack).to(haveResource(ResourceTypeConstants.AWS.COGNITO.USERPOOL));
    cdkExpect(authStack.stack).to(haveResource(ResourceTypeConstants.AWS.COGNITO.IDENTITYPOOL));
    cdkExpect(authStack.stack).to(haveResource(ResourceTypeConstants.AWS.COGNITO.USERPOOLCLIENT));
    cdkExpect(authStack.stack).to(haveResource(ResourceTypeConstants.AWS.COGNITO.IDENTITYPOOLROLEATTACHMENT));
  });

  test('test hosting', () => {
    const service = 'S3AndCloudFront'
    const category = 'hosting';
    exportedBackendConstruct.nestedStackByCategortService(category, service)
    .forEach(nestedStack => {
      cdkExpect(nestedStack.stack).to(haveResource(ResourceTypeConstants.AWS.S3.BUCKET));
    })
  });

});


