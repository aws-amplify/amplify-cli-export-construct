import { CfnUserPool, CfnIdentityPool } from '@aws-cdk/aws-cognito';
import { CfnCustomResource } from '@aws-cdk/core';
import { BaseIncludedStack } from '../base-included-stack';


export interface ProviderCredential {
  ProviderName: 'Facebook' | 'Google' | 'LoginWithAmazon';
  client_id: string;
  client_secret: string;
}

export interface IAuthIncludeNestedStack {
  /**
   * @returns Cognito UserPool {CfnUserPool} of the auth stack
   * @throws {}
   */
  getUserPool(): CfnUserPool;

  /**
   * @returns {CfnIdentityPool} of the auth stack
   */
  getIdentityPool(): CfnIdentityPool;

  /**
   * @param credentials
   */
  setHostedUiProviderCredentials(credentials: ProviderCredential[]): void;
}

export class AuthIncludedNestedStack extends BaseIncludedStack implements IAuthIncludeNestedStack {

  setHostedUiProviderCredentials(credentials: ProviderCredential[]): void {
    const hostedUICustomResourceInputs = this.getResourceConstruct<CfnCustomResource>(
      'HostedUICustomResourceInputs',
    );
    hostedUICustomResourceInputs.addPropertyOverride(
      'HostedUIProvidersCustomResourceInputs.hostedUIProviderCreds',
      JSON.stringify(credentials),
    );
  }

  getUserPool(): CfnUserPool {
    return this.getResourceConstruct<CfnUserPool>(
      'UserPool',
    );
  }


  getIdentityPool(): CfnIdentityPool {
    return this.getResourceConstruct<CfnIdentityPool>(
      'IdentityPool',
    );
  }
}