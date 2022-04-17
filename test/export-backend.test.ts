import { CfnInclude } from 'aws-cdk-lib/cloudformation-include';
import { App } from 'aws-cdk-lib';
import * as fs from 'fs-extra';
import { AmplifyExportedBackend } from '../src';
import { Constants } from '../src/constants';
import { manifest_test, stack_mapping_test } from './test-constants';
const {
  AMPLIFY_EXPORT_MANIFEST_FILE,
  AMPLIFY_CATEGORY_MAPPING_FILE,
  AMPLIFY_EXPORT_TAG_FILE,
} = Constants;
jest.mock('fs-extra');
const fs_mock = fs as unknown as jest.Mocked<typeof fs>;

fs_mock.existsSync.mockReturnValue(true);
fs_mock.readFileSync.mockImplementation((filePath, _options) => {
  const stringFilePath = filePath.toString();

  if (stringFilePath.includes(AMPLIFY_EXPORT_MANIFEST_FILE)) {
    return AMPLIFY_EXPORT_MANIFEST_FILE;
  }

  if (stringFilePath.includes(AMPLIFY_CATEGORY_MAPPING_FILE)) {
    return AMPLIFY_CATEGORY_MAPPING_FILE;
  }

  if (stringFilePath.includes(AMPLIFY_EXPORT_TAG_FILE)) {
    return AMPLIFY_EXPORT_TAG_FILE;
  }

  return stringFilePath;
});
fs_mock.statSync.mockReturnValue({
  isDirectory: jest.fn().mockReturnValue(true),
} as unknown as fs.Stats)

jest.mock('../src/export-backend-asset-handler', () => ({
  AmplifyExportAssetHandler: jest.fn().mockReturnValue({
    createAssetsAndUpdateParameters: jest.fn().mockReturnValue({ props: {} }),
    setDependencies: jest.fn(),
  }),
}));
jest.mock('@aws-cdk/cloudformation-include');
const cfnInclude_mock = CfnInclude as jest.Mocked<typeof CfnInclude>;

JSON.parse = jest.fn().mockImplementation((val) => {
  if (val === AMPLIFY_EXPORT_MANIFEST_FILE) {
    return manifest_test;
  }

  if (val === AMPLIFY_CATEGORY_MAPPING_FILE) {
    return stack_mapping_test;
  }

  if (val === AMPLIFY_EXPORT_TAG_FILE) {
    return [{ key: 'testKey', value: 'testValue' }];
  }
  return {};
});

describe('test export backend', () => {
  test('test export backend', () => {
    const app = new App();
    const amplifyBackend = new AmplifyExportedBackend(app, 'test-construct', {
      path: 'dummy-path',
      amplifyEnvironment: 'prod',
    });
    expect(amplifyBackend).toBeDefined();
    expect(cfnInclude_mock).toBeDefined();
    expect(amplifyBackend.rootStack).toBeDefined();
    expect(amplifyBackend.rootStack.stackName).toContain('prod');

    expect(cfnInclude_mock).toBeCalledWith(amplifyBackend.rootStack, 'AmplifyCfnInclude', {});
    expect(amplifyBackend.cfnInclude).toBeDefined;
    amplifyBackend.cfnInclude.getNestedStack = jest.fn().mockReturnValue({});
    const graphqlStack = amplifyBackend.graphqlNestedStacks();
    expect(graphqlStack).toBeDefined();
    expect(amplifyBackend.cfnInclude.getNestedStack).toBeCalledWith(
      'apiamplifyexportest',
    );

    const authStack = amplifyBackend.authNestedStack();
    expect(authStack).toBeDefined();
    expect(amplifyBackend.cfnInclude.getNestedStack).toBeCalledWith(
      'authamplifyexportestd3062483',
    );

    const lambdaStack = amplifyBackend.lambdaFunctionNestedStacks();
    expect(lambdaStack).toBeDefined();
    expect(lambdaStack.length).toBe(1);
    expect(amplifyBackend.cfnInclude.getNestedStack).toBeCalledWith('functionamplifyexportest13c53bd0');

    try {
      amplifyBackend.apiRestNestedStack('noresource');
    } catch (ex) {
      expect(ex).toBeDefined();
    }
  });

});
