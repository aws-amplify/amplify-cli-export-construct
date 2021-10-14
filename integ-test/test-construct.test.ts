import * as path from 'path';
import * as cdk from '@aws-cdk/core';
import * as fs from 'fs-extra';
import { AmplifyExportBackend, IAmplifyExportBackend } from '../src';

// eslint-disable-next-line import/no-unresolved
import { addAuthWithDefault, addApiWithoutSchema, addFunction, exportBackend, deleteProject, deleteProjectDir, initProjectWithAccessKey } from './amplify-e2e-core/lib';

jest.setTimeout(500000);

describe('test construct', () => {
  let projRoot: string;
  let exportProj: string;
  let exportedBackendConstruct: IAmplifyExportBackend;
  const projectName = 'exportTestProject';


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
    await addApiWithoutSchema(projRoot);
    await addFunction(
      projRoot,
      { functionTemplate: 'Hello World' },
      'nodejs',
    );
    await addAuthWithDefault(projRoot, {});
    fs.ensureDirSync(exportProj);
    await exportBackend(projRoot, { exportPath: exportProj });
    fs.moveSync(path.join('integ-test', `amplify-export-${projectName}`), path.join(`amplify-export-${projectName}`));
    const app = new cdk.App();
    exportedBackendConstruct = new AmplifyExportBackend(app, 'amplify-exported-backend', {
      path: `amplify-export-${projectName}`,
      stage: 'dev',
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


});
