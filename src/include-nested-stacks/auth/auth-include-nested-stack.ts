import { CfnUserPool, CfnIdentityPool } from 'aws-cdk-lib/aws-cognito';
import { CfnCustomResource } from 'aws-cdk-lib/core';
import { BaseIncludedStack } from '../base-included-stack';

export interface ProviderCredential {
  readonly providerName: 'Facebook' | 'Google' | 'LoginWithAmazon';
  readonly clientId: string;
  readonly clientSecret: string;
}

export class AuthIncludedNestedStack extends BaseIncludedStack {
  hostedUiProviderCredentials(credentials: ProviderCredential[]): void {
    const hostedUICustomResourceInputs = this.getResourceConstruct<
    CfnCustomResource
    >('HostedUICustomResourceInputs');

    /**
     * used to provide the hosted UI for federated auth
     * @param credentials
     */
    hostedUICustomResourceInputs.addPropertyOverride(
      'HostedUIProvidersCustomResourceInputs.hostedUIProviderCreds',
      JSON.stringify(
        credentials.map((credential) => ({
          ProviderName: credential.providerName,
          client_id: credential.clientId,
          client__secret: credential.clientSecret,
        })),
      ),
    );
  }
  /**
   * @returns {CfnIdentityPool} of the auth stack
   */
  userPool(): CfnUserPool {
    return this.getResourceConstruct<CfnUserPool>('UserPool');
  }

  /**
   * @returns Cognito UserPool {CfnUserPool} of the auth stack
   * @throws {}
   */
  identityPool(): CfnIdentityPool {
    return this.getResourceConstruct<CfnIdentityPool>('IdentityPool');
  }
}
