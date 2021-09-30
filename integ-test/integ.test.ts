import * as path from 'path';
import * as cdk from '@aws-cdk/core';
import * as fs from 'fs-extra';
import { AmplifyExportedBackend, IAmplifyExportedBackend } from '../src';
import { initJSProjectWithProfile, addAuthWithDefault, addApiWithoutSchema, addFunction, exportBackend, deleteProject, deleteProjectDir } from './amplify-e2e-core/lib';

jest.setTimeout(500000);

describe('test construct', () => {
  let projRoot: string;
  let exportProj: string;
  let exportedBackendConstruct: IAmplifyExportedBackend;
  const projectName = 'exportTestProject';


  beforeAll(async () => {
    projRoot = path.join(__dirname, 'exportTestProject');
    exportProj = path.join(__dirname);
    expect(process.env.AMPLIFY_PATH).toBeDefined();
    expect(process.env.ACCESS_KEY_ID).toBeDefined();
    expect(process.env.SECRET_ACCESS_KEY).toBeDefined();
    fs.ensureDirSync(projRoot);
    await initJSProjectWithProfile(projRoot, {});
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
    exportedBackendConstruct = new AmplifyExportedBackend(app, 'amplify-exported-backend', {
      path: `amplify-export-${projectName}`,
      stage: 'dev',
    });
  });

  afterAll(async () => {
    await deleteProject(projRoot, { });
  });

  test('exportedBackendConstruct is defined', () => {
    expect(exportedBackendConstruct).toBeDefined();
  });


});
