import { CfnUserPool, CfnIdentityPool } from '@aws-cdk/aws-cognito';
import { CfnCustomResource } from '@aws-cdk/core';
import { BaseIncludedStack } from '../base-included-stack';


export interface ProviderCredential {
  readonly providerName: 'Facebook' | 'Google' | 'LoginWithAmazon';
  readonly clientId: string;
  readonly clientSecret: string;
}

export interface IAuthIncludeNestedStack {
  /**
   * @returns Cognito UserPool {CfnUserPool} of the auth stack
   * @throws {}
   */
  userPool(): CfnUserPool;

  /**
   * @returns {CfnIdentityPool} of the auth stack
   */
  identityPool(): CfnIdentityPool;

  /**
   * used to provide the hosted UI for federated auth
   * @param credentials
   */
  hostedUiProviderCredentials(credentials: ProviderCredential[]): void;
}

export class AuthIncludedNestedStack extends BaseIncludedStack implements IAuthIncludeNestedStack {

  hostedUiProviderCredentials(credentials: ProviderCredential[]): void {
    const hostedUICustomResourceInputs = this.getResourceConstruct<CfnCustomResource>(
      'HostedUICustomResourceInputs',
    );
    hostedUICustomResourceInputs.addPropertyOverride(
      'HostedUIProvidersCustomResourceInputs.hostedUIProviderCreds',
      JSON.stringify(credentials.map(credential => ({
        ProviderName: credential.providerName,
        client_id: credential.clientId,
        client__secret: credential.clientSecret,
      }))),
    );
  }

  userPool(): CfnUserPool {
    return this.getResourceConstruct<CfnUserPool>(
      'UserPool',
    );
  }


  identityPool(): CfnIdentityPool {
    return this.getResourceConstruct<CfnIdentityPool>(
      'IdentityPool',
    );
  }
}