const fs = require('fs-extra');
const { AwsCdkConstructLibrary, NodePackageManager } = require('projen');
const { stringify } = require('yaml');


const dependencies = ['fs-extra@10.0.0', 'lodash.get', 'lodash.set', 'uuid'];
const project = new AwsCdkConstructLibrary({
  author: 'Amazon Web Services',
  authorAddress: 'amplify-cli@amazon.com',
  packageName: '@aws-amplify/cdk-exported-backend',
  cdkVersion: '1.127.0',
  defaultReleaseBranch: 'release',
  name: 'export-backend',
  bundledDeps: dependencies,
  deps: dependencies,
  devDeps: [
    '@types/fs-extra@^8.1.1',
    '@types/jest',
    '@types/lodash.get',
    '@types/lodash.set',
    '@types/node',
    '@types/uuid',
    'yaml',
  ],
  authorOrganization: true,
  repositoryUrl: 'https://github.com/aws-amplify/amplify-cli-export-construct.git',
  packageManager: NodePackageManager.NPM,
  publishToNuget: {
    dotNetNamespace: 'Amazon.Amplify.CDK',
    packageId: 'Exportedbackend',
  },
  publishToPypi: {
    distName: 'aws-amplify.cdk.Exported-backend',
    module: 'aws-amplify.cdk.Exported_backend',
  },
  publishToMaven: {
    javaPackage: 'com.amplifyframework.cdk.exportedbackend',
    mavenGroupId: 'com.amplifyframework',
    mavenArtifactId: 'exported-backend',
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

const integrationTestJob = {
  integration_tests: {
    runsOn: 'ubuntu-latest',
    needs: 'release',
    permissions: { actions: 'write' },
    steps: [
      {
        name: 'Checkout',
        uses: 'actions/checkout@v2',
        with: {
          ref: 'main',
          repository: 'ammarkarachi/amplify-cli-export-construct',
          path: 'amplify-cli-export-construct',
        },
      },
      {
        name: 'Setup Node.js',
        uses: 'actions/setup-node@v2.2.0',
        with: {
          'node-version': '14.17.6',
        },
      },
      {
        name: 'Install Amplify CLI',
        run: 'npm i @aws-amplify/cli@5.5.0-amplify-export.1\nnpm i -g @aws-amplify/cli@5.5.0-amplify-export.1\nwhich amplify\namplify_path=$(which amplify)\necho "AMPLIFY_PATH=$amplify_path" >> $GITHUB_ENV\necho ${{ env.AMPLIFY_PATH }}\n',
      },
      {
        name: 'Checkout',
        uses: 'actions/checkout@v2',
        with: {
          repository: 'ammarkarachi/amplify-cli',
          ref: 'refactor/packaging',
          path: 'amplify-cli',
        },
      },
      {
        name: 'Build Amplify E2E Core',
        run: 'cd amplify-cli/packages/amplify-headless-interface\nyarn install\nyarn build\ncd ../amplify-e2e-core\nyarn install\nyarn build\ncd ~/\n',
      },
      {
        name: 'Copy E2E Core',
        run: 'cp -r amplify-cli/packages/amplify-headless-interface amplify-cli-export-construct/integ-test/amplify-headless-interface\ncp -r amplify-cli/packages/amplify-e2e-core amplify-cli-export-construct/integ-test/amplify-e2e-core\nls -l amplify-cli-export-construct/integ-test/\n',
      },
      {
        name: 'Run Test',
        run: 'cd amplify-cli-export-construct\nnpm ci\ncd integ-test/amplify-e2e-core\nyarn install\ncd ../../\namplify -v\n./node_modules/jest/bin/jest.js --verbose --ci --collect-coverage\n',
        env: {
          AWS_ACCESS_KEY_ID: '${{ secrets.AWS_ACCESS_KEY_ID }}',
          AWS_SECRET_ACCESS_KEY: '${{ secrets.AWS_SECRET_ACCESS_KEY }}',
          AWS_SESSION_TOKEN: '${{ secrets.AWS_SESSION_TOKEN }}',
        },
      },
    ],
  },
};

project.release.addJobs(integrationTestJob);
fs.writeFileSync('./.github/workflows/integration-test.yml', stringify({
  name: 'Integration Tests',
  on: {
    workflow_dispatch: {},
  },
  jobs: {
    integTest: {
      'permissions': {
        checks: 'write',
        contents: 'write',
        actions: 'write',
      },
      'runs-on': 'ubuntu-latest',
      'steps': integrationTestJob.integration_tests.steps,
    },
  },
}));

const publishJobs = project.release.publisher.jobs;
Object.keys(project.release.publisher.jobs).forEach((r) => {
  publishJobs[r].needs = ['integration_tests'];
});
project.synth();
