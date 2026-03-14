import { StackProps } from 'aws-cdk-lib';

export interface AmplifyExportedBackendProps extends StackProps {
  /**
   * The path to the exported folder that contains the artifacts for the Amplify CLI backend
   * ex: ./amplify-synth-out/
   */
  readonly path: string;

  /**
   * The Amplify App ID to which the new backend environment will be added.
   *
   * If the Amplify environment is created and managed by CDK exclusively
   * then provide an AmplifyAppId to ensure the backend environment
   * shows up in the AWS Amplify App homepage.
   *
   * If the Amplify environment is created via Amplify CLI, do not
   * provide an AmplifyAppId. Trying to create an Amplify backend
   * via CDK which has already been created by the Amplify CLI will result
   * in the CDK failing to create the backend and automatically deleting
   * the existing backend when it deletes the Amplify environment it failed
   * to deploy.
   */
  readonly amplifyAppId?: string

  /**
   * An environment name to contain Amplify CLI backend resources.
   *
   * An Amplify backend is a collection of various AWS
   * resources organized into categories (api, function, custom, etc) which are deployed
   * together into an environment. Environments sometimes reflect deployment
   * stages such as 'dev', 'test', and 'prod'.
   * @default is 'dev'
   */
  readonly amplifyEnvironment?: string;
}
