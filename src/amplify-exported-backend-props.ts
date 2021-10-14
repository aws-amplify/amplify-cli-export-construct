import { StackProps } from '@aws-cdk/core';

export interface AmplifyExportedBackendProps extends StackProps {
  /**
   * The stage that you are going to publish the
   * The amplify backend requires a stage to deploy
   * @default is 'dev'
   */
  readonly stage?: string;

  /**
   * The path to the synthesized folder that contains the artifacts for the Amplify CLI backend
   * ex: ./amplify-synth-out/
   */
  readonly path: string;
}
