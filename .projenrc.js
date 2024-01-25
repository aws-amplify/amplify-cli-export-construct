  const fs = require('fs-extra');
const { awscdk , javascript  } = require('projen');
const { stringify } = require('yaml');

const dependencies = ['fs-extra@10.0.0', 'lodash.get', 'uuid'];
const project = new awscdk.AwsCdkConstructLibrary({
  author: 'Amazon Web Services',
  authorAddress: 'amplify-cli@amazon.com',
  packageName: '@aws-amplify/cdk-exported-backend',
  cdkVersion: '2.47.0',
  defaultReleaseBranch: 'release',
  name: 'exported-backend',
  bundledDeps: dependencies,
  deps: dependencies,
  npmAccess: javascript.NpmAccess.PUBLIC,
  devDeps: [
    '@types/fs-extra@^8.1.1',
    '@types/jest',
    '@types/lodash.get',
    '@types/node',
    '@types/uuid',
    'yaml',
  ],
  authorOrganization: true,
  repositoryUrl: 'https://github.com/aws-amplify/amplify-cli-export-construct.git',
  packageManager: javascript.NodePackageManager.NPM,
  // publishToNuget: {
  //   dotNetNamespace: 'Amazon.Amplify.CDK',
  //   packageId: 'Exportedbackend',
  // },
  publishToPypi: {
    distName: 'aws-amplify.cdk.exported-backend',
    module: 'aws_amplify.cdk.exported_backend',
  },
  publishToMaven: {
    javaPackage: 'com.amplifyframework.cdk.exportedbackend',
    mavenGroupId: 'com.amplifyframework',
    mavenArtifactId: 'exported-backend',
    mavenEndpoint: '${{ secrets.MAVEN_ENDPOINT }}'
  },
  jest: true,
  minNodeVersion: '14.17.6',
  majorVersion: '0',
  docgen: true,
  gitignore: [
    'integ-test/amplify-e2e-core',
    'integ-test/amplify-headless-interface',
  ],
  keywords: [
    'amplify-cli',
    'amplify-cli-cdk',
    'amplify',
    'cdk',
    'exported-backend',
  ],
  eslint: false,
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
  antitamper: false,
});
const unitTest = project.tasks.tryFind('test');
unitTest.reset();
unitTest.exec('rm -fr lib/');
unitTest.exec('tsc --noEmit --project tsconfig.jest.json');
unitTest.exec('jest ./test/*');
project.release.addBranch('beta', {
  tagPrefix: 'beta',
  majorVersion: '0',
});

const integrationTestJob = {
  integration_tests: {
    runsOn: 'ubuntu-latest',
    needs: 'release',
    permissions: {
      checks: 'write',
      contents: 'write',
      actions: 'write',
    },
    steps: [
      {
        name: 'Checkout',
        uses: 'actions/checkout@v2',
        with: {
          ref: 'main',
          repository: 'aws-amplify/amplify-cli-export-construct',
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
        run: 'npm i @aws-amplify/cli@10.0.0\nnpm i -g @aws-amplify/cli@10.0.0\nwhich amplify\namplify_path=$(which amplify)\necho "AMPLIFY_PATH=$amplify_path" >> $GITHUB_ENV\necho ${{ env.AMPLIFY_PATH }}\n',
      },
      {
        name: 'Checkout',
        uses: 'actions/checkout@v2',
        with: {
          repository: 'aws-amplify/amplify-cli',
          ref: 'v10.0.0',
          path: 'amplify-cli',
        },
      },
      {
        name: 'Build Amplify E2E Core',
        run: 'cd amplify-cli\nyarn dev-build\ncd ~/\n',
      },
      {
        name: 'Link E2E Core',
        run: 'cd amplify-cli-export-construct/integ-test\nln -s ../../amplify-cli/packages/amplify-e2e-core amplify-e2e-core\nls -l .\ncd ~/\n',
      },
      {
        name: 'Run Test',
        run: 'cd amplify-cli-export-construct\nnpm ci\namplify -v\n./node_modules/jest/bin/jest.js --verbose --ci --collect-coverage\n',
        env: {
          AWS_ACCESS_KEY_ID: '${{ secrets.AWS_ACCESS_KEY_ID }}',
          AWS_SECRET_ACCESS_KEY: '${{ secrets.AWS_SECRET_ACCESS_KEY }}',
          AWS_SESSION_TOKEN: '${{ secrets.AWS_SESSION_TOKEN }}',
          FACEBOOK_APP_ID: 'fbAppId',
          FACEBOOK_APP_SECRET: 'fbAppSecret',
          GOOGLE_APP_ID: 'gglAppID',
          GOOGLE_APP_SECRET: 'gglAppSecret',
          AMAZON_APP_ID: 'amaznAppID',
          AMAZON_APP_SECRET: 'amaznAppSecret',
          APPLE_APP_ID: 'com.fake.app',
          APPLE_TEAM_ID: '2QLEWNDK6K',
          APPLE_KEY_ID: '2QLZXKYJ8J',
          APPLE_PRIVATE_KEY: 'MIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQgIltgNsTgTfSzUadYiCS0VYtDDMFln/J8i1yJsSIw5g+gCgYIKoZIzj0DAQehRANCAASI8E0L/DhR/mIfTT07v3VwQu6q8I76lgn7kFhT0HvWoLuHKGQFcFkXXCgztgBrprzd419mUChAnKE6y89bWcNw',
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


// const publishJobs = project.deps = ( s) => {
//   console.log(s);
// }
// Object.keys(project.release.publisher.jobs).forEach((r) => {
//   publishJobs[r].needs = ['integration_tests'];
// });
// project.synth();
