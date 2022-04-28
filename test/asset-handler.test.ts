import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { CfnInclude } from 'aws-cdk-lib/cloudformation-include';
import { App, Stack } from 'aws-cdk-lib';
import * as fs from 'fs-extra';
import { AmplifyExportAssetHandler } from '../src/export-backend-asset-handler';
import { manifest_test, stack_mapping_test } from './test-constants';

const fs_mock = fs as unknown as jest.Mocked<typeof fs>;
fs_mock.readdirSync = jest.fn().mockReturnValueOnce(['one.zip']);
fs_mock.existsSync = jest.fn().mockReturnValueOnce(true);
jest.mock('@aws-cdk/aws-s3-deployment');

jest.mock('@aws-cdk/cloudformation-include');
describe('test asset handler', () => {
  test('test asset handler upload', () => {
    const app = new App();
    const stack = new Stack(app, 'asset-stack');
    const amplifyExporthandler = new AmplifyExportAssetHandler(stack, 'asset-handler', {
      backendPath: 'dummy-paTh',
      categoryStackMapping: stack_mapping_test,
      env: 'stage',
      exportManifest: manifest_test,
    });
    amplifyExporthandler.createAssetsAndUpdateParameters();
    const addDependencyMock = jest.fn();
    const mockInclude = {
      getResource: jest.fn().mockReturnValue({
        node: {
          addDependency: addDependencyMock,
        },
      }),
    } as unknown as CfnInclude;
    expect(BucketDeployment).toBeCalled();
    expect(Source.asset).toBeCalled();
    amplifyExporthandler.setDependencies(mockInclude);

    expect(addDependencyMock).toBeCalled();

  });
});
