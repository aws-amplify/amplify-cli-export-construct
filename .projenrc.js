const { AwsCdkConstructLibrary, NodePackageManager } = require('projen');
const dependencies = ['fs-extra@10.0.0', 'lodash.get', 'lodash.set', 'uuid'];
const project = new AwsCdkConstructLibrary({
  author: 'Amazon Web Services',
  authorAddress: 'amplify-cli@amazon.com',
  cdkVersion: '1.127.0',
  defaultReleaseBranch: 'release',
  name: '@aws-amplify/cli/export-backend',
  bundledDeps: dependencies,
  deps: dependencies,
  devDeps: [
    '@types/fs-extra@^8.1.1',
    '@types/jest',
    '@types/lodash.get',
    '@types/lodash.set',
    '@types/node',
    '@types/uuid',
  ],
  authorOrganization: 'aws',
  repositoryUrl: 'https://github.com/aws-amplify/amplify-cli-export-construct.git',
  packageManager: NodePackageManager.NPM,
  publishToNuget: {
    dotNetNamespace: 'Amazon.Amplify.CLI.ExportBackend',
    packageId: 'Amazon.Amplify.CLI.ExportBackend',
  },
  publishToPypi: {
    distName: 'aws-amplify.cli.Export-backend',
    module: 'aws-amplify.cli.Export_backend',
  },
  jest: true,
  cdkDependenciesAsDeps: true,
  minNodeVersion: '14.17.6',
  majorVersion: '0',
  docgen: true,
  npmDistTag: 'latest',
  cdkDependencies: [
    '@aws-cdk/core',
    '@aws-cdk/aws-apigateway',
    '@aws-cdk/aws-appsync',
    '@aws-cdk/aws-cloudformation',
    '@aws-cdk/aws-cognito',
    '@aws-cdk/aws-iam',
    '@aws-cdk/aws-lambda',
    '@aws-cdk/aws-s3',
    '@aws-cdk/aws-s3-assets',
    '@aws-cdk/aws-s3-deployment',
    '@aws-cdk/cloudformation-include',
  ],
  gitignore: [
    'integ-test/amplify-e2e-core',
    'integ-test/amplify-headless-interface',
  ],
  license: 'Apache-2.0',
  licensed: true,
  excludeTypescript: ['integ-test/*'],
  jestOptions: {
    jestConfig: {
      testPathIgnorePatterns: ['/node_modules/'],
      coveragePathIgnorePatterns: ['integ-test/', '/node_modules/'],
      watchPathIgnorePatterns: ['integ-test/'],
    },
  },
  testdir: 'test',
  mutableBuild: false,
  cdkAssert: true,
  // tsconfig: {
  //   compilerOptions: {
  //     esModuleInterop: true,
  //     strictPropertyInitialization: false,
  //   },
  // },
  // cdkDependencies: undefined,      /* Which AWS CDK modules (those that start with "@aws-cdk/") does this library require when consumed? */
  // cdkTestDependencies: undefined,  /* AWS CDK modules required for testing. */
  // deps: [],                        /* Runtime dependencies of this module. */
  // description: undefined,          /* The description is just a string that helps people understand the purpose of the package. */
  // devDeps: [],                     /* Build dependencies for this module. */
  // packageName: undefined,          /* The "name" in package.json. */
  // release: undefined,              /* Add release management to this project. */
});
const unitTest = project.tasks.tryFind('test');
unitTest.reset();
unitTest.exec('rm -fr lib/');
unitTest.exec('tsc --noEmit --project tsconfig.jest.json');
unitTest.exec('jest ./test/*');
unitTest.exec('eslint --ext .ts,.tsx --fix --no-error-on-unmatched-pattern src test build-tools .projenrc.js');
project.release.addBranch('beta', {
  tagPrefix: 'beta',
  majorVersion: '0',
});
project.synth();

