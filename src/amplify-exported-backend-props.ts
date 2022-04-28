import { StackProps } from 'aws-cdk-lib';

export interface AmplifyExportedBackendProps extends StackProps {
  /**
   * The Amplify CLI environment deploy to
   * The amplify backend requires a stage to deploy
   * @default is 'dev'
   */
  readonly amplifyEnvironment: string;

  /**
   * The path to the exported folder that contains the artifacts for the Amplify CLI backend
   * ex: ./amplify-synth-out/
   */
  readonly path: string;
}
