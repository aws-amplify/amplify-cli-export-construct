# API Reference <a name="API Reference"></a>

## Constructs <a name="Constructs"></a>

### AmplifyExportedBackend <a name="export-backend.AmplifyExportedBackend"></a>

- *Implements:* [`export-backend.IAmplifyExportedBackend`](#export-backend.IAmplifyExportedBackend)

*.

#### Initializers <a name="export-backend.AmplifyExportedBackend.Initializer"></a>

```typescript
import { AmplifyExportedBackend } from 'export-backend'

new AmplifyExportedBackend(scope: Construct, id: string, props: AmplifyExportedBackendProps)
```

##### `scope`<sup>Required</sup> <a name="export-backend.AmplifyExportedBackend.parameter.scope"></a>

- *Type:* [`@aws-cdk/core.Construct`](#@aws-cdk/core.Construct)

---

##### `id`<sup>Required</sup> <a name="export-backend.AmplifyExportedBackend.parameter.id"></a>

- *Type:* `string`

---

##### `props`<sup>Required</sup> <a name="export-backend.AmplifyExportedBackend.parameter.props"></a>

- *Type:* [`export-backend.AmplifyExportedBackendProps`](#export-backend.AmplifyExportedBackendProps)

---

#### Methods <a name="Methods"></a>

##### `apiRestNestedStack` <a name="export-backend.AmplifyExportedBackend.apiRestNestedStack"></a>

```typescript
public apiRestNestedStack(resourceName: string)
```

###### `resourceName`<sup>Required</sup> <a name="export-backend.AmplifyExportedBackend.parameter.resourceName"></a>

- *Type:* `string`

---

##### `authNestedStack` <a name="export-backend.AmplifyExportedBackend.authNestedStack"></a>

```typescript
public authNestedStack()
```

##### `graphqlNestedStacks` <a name="export-backend.AmplifyExportedBackend.graphqlNestedStacks"></a>

```typescript
public graphqlNestedStacks()
```

##### `lambdaFunctionNestedStackByName` <a name="export-backend.AmplifyExportedBackend.lambdaFunctionNestedStackByName"></a>

```typescript
public lambdaFunctionNestedStackByName(functionName: string)
```

###### `functionName`<sup>Required</sup> <a name="export-backend.AmplifyExportedBackend.parameter.functionName"></a>

- *Type:* `string`

---

##### `lambdaFunctionNestedStacks` <a name="export-backend.AmplifyExportedBackend.lambdaFunctionNestedStacks"></a>

```typescript
public lambdaFunctionNestedStacks()
```

##### `nestedStacksByCategory` <a name="export-backend.AmplifyExportedBackend.nestedStacksByCategory"></a>

```typescript
public nestedStacksByCategory(category: string, resourceName?: string)
```

###### `category`<sup>Required</sup> <a name="export-backend.AmplifyExportedBackend.parameter.category"></a>

- *Type:* `string`

---

###### `resourceName`<sup>Optional</sup> <a name="export-backend.AmplifyExportedBackend.parameter.resourceName"></a>

- *Type:* `string`

---


#### Properties <a name="Properties"></a>

##### `cfnInclude`<sup>Required</sup> <a name="export-backend.AmplifyExportedBackend.property.cfnInclude"></a>

- *Type:* [`@aws-cdk/cloudformation-include.CfnInclude`](#@aws-cdk/cloudformation-include.CfnInclude)

---

##### `rootStack`<sup>Required</sup> <a name="export-backend.AmplifyExportedBackend.property.rootStack"></a>

- *Type:* [`@aws-cdk/core.Stack`](#@aws-cdk/core.Stack)

---


### BaseAmplifyExportBackend <a name="export-backend.BaseAmplifyExportBackend"></a>

Contains all the utility functions.

#### Initializers <a name="export-backend.BaseAmplifyExportBackend.Initializer"></a>

```typescript
import { BaseAmplifyExportBackend } from 'export-backend'

new BaseAmplifyExportBackend(scope: Construct, id: string, exportPath: string, stage?: string)
```

##### `scope`<sup>Required</sup> <a name="export-backend.BaseAmplifyExportBackend.parameter.scope"></a>

- *Type:* [`@aws-cdk/core.Construct`](#@aws-cdk/core.Construct)

---

##### `id`<sup>Required</sup> <a name="export-backend.BaseAmplifyExportBackend.parameter.id"></a>

- *Type:* `string`

---

##### `exportPath`<sup>Required</sup> <a name="export-backend.BaseAmplifyExportBackend.parameter.exportPath"></a>

- *Type:* `string`

---

##### `stage`<sup>Optional</sup> <a name="export-backend.BaseAmplifyExportBackend.parameter.stage"></a>

- *Type:* `string`

---



#### Properties <a name="Properties"></a>

##### `env`<sup>Optional</sup> <a name="export-backend.BaseAmplifyExportBackend.property.env"></a>

- *Type:* `string`

---


## Structs <a name="Structs"></a>

### AmplifyExportedBackendProps <a name="export-backend.AmplifyExportedBackendProps"></a>

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { AmplifyExportedBackendProps } from 'export-backend'

const amplifyExportedBackendProps: AmplifyExportedBackendProps = { ... }
```

##### `analyticsReporting`<sup>Optional</sup> <a name="export-backend.AmplifyExportedBackendProps.property.analyticsReporting"></a>

- *Type:* `boolean`
- *Default:* `analyticsReporting` setting of containing `App`, or value of
'aws:cdk:version-reporting' context key

Include runtime versioning information in this Stack.

---

##### `description`<sup>Optional</sup> <a name="export-backend.AmplifyExportedBackendProps.property.description"></a>

- *Type:* `string`
- *Default:* No description.

A description of the stack.

---

##### `env`<sup>Optional</sup> <a name="export-backend.AmplifyExportedBackendProps.property.env"></a>

- *Type:* [`@aws-cdk/core.Environment`](#@aws-cdk/core.Environment)
- *Default:* The environment of the containing `Stage` if available,
otherwise create the stack will be environment-agnostic.

The AWS environment (account/region) where this stack will be deployed.

Set the `region`/`account` fields of `env` to either a concrete value to
select the indicated environment (recommended for production stacks), or to
the values of environment variables
`CDK_DEFAULT_REGION`/`CDK_DEFAULT_ACCOUNT` to let the target environment
depend on the AWS credentials/configuration that the CDK CLI is executed
under (recommended for development stacks).

If the `Stack` is instantiated inside a `Stage`, any undefined
`region`/`account` fields from `env` will default to the same field on the
encompassing `Stage`, if configured there.

If either `region` or `account` are not set nor inherited from `Stage`, the
Stack will be considered "*environment-agnostic*"". Environment-agnostic
stacks can be deployed to any environment but may not be able to take
advantage of all features of the CDK. For example, they will not be able to
use environmental context lookups such as `ec2.Vpc.fromLookup` and will not
automatically translate Service Principals to the right format based on the
environment's AWS partition, and other such enhancements.

---

##### `stackName`<sup>Optional</sup> <a name="export-backend.AmplifyExportedBackendProps.property.stackName"></a>

- *Type:* `string`
- *Default:* Derived from construct path.

Name to deploy the stack with.

---

##### `synthesizer`<sup>Optional</sup> <a name="export-backend.AmplifyExportedBackendProps.property.synthesizer"></a>

- *Type:* [`@aws-cdk/core.IStackSynthesizer`](#@aws-cdk/core.IStackSynthesizer)
- *Default:* `DefaultStackSynthesizer` if the `@aws-cdk/core:newStyleStackSynthesis` feature flag
is set, `LegacyStackSynthesizer` otherwise.

Synthesis method to use while deploying this stack.

---

##### `tags`<sup>Optional</sup> <a name="export-backend.AmplifyExportedBackendProps.property.tags"></a>

- *Type:* {[ key: string ]: `string`}
- *Default:* {}

Stack tags that will be applied to all the taggable resources and the stack itself.

---

##### `terminationProtection`<sup>Optional</sup> <a name="export-backend.AmplifyExportedBackendProps.property.terminationProtection"></a>

- *Type:* `boolean`
- *Default:* false

Whether to enable termination protection for this stack.

---

##### `path`<sup>Required</sup> <a name="export-backend.AmplifyExportedBackendProps.property.path"></a>

- *Type:* `string`

The path to the synthesized folder that contains the artifacts for the Amplify CLI backend ex: ./amplify-synth-out/.

---

##### `stage`<sup>Optional</sup> <a name="export-backend.AmplifyExportedBackendProps.property.stage"></a>

- *Type:* `string`
- *Default:* is 'dev'

The stage that you are going to publish the The amplify backend requires a stage to deploy.

---

### CategoryStackMapping <a name="export-backend.CategoryStackMapping"></a>

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { CategoryStackMapping } from 'export-backend'

const categoryStackMapping: CategoryStackMapping = { ... }
```

##### `category`<sup>Required</sup> <a name="export-backend.CategoryStackMapping.property.category"></a>

- *Type:* `string`

---

##### `resourceName`<sup>Required</sup> <a name="export-backend.CategoryStackMapping.property.resourceName"></a>

- *Type:* `string`

---

##### `service`<sup>Required</sup> <a name="export-backend.CategoryStackMapping.property.service"></a>

- *Type:* `string`

---

### ExportManifest <a name="export-backend.ExportManifest"></a>

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { ExportManifest } from 'export-backend'

const exportManifest: ExportManifest = { ... }
```

##### `props`<sup>Required</sup> <a name="export-backend.ExportManifest.property.props"></a>

- *Type:* [`@aws-cdk/cloudformation-include.CfnIncludeProps`](#@aws-cdk/cloudformation-include.CfnIncludeProps)

---

##### `stackName`<sup>Required</sup> <a name="export-backend.ExportManifest.property.stackName"></a>

- *Type:* `string`

---

### ExportTag <a name="export-backend.ExportTag"></a>

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { ExportTag } from 'export-backend'

const exportTag: ExportTag = { ... }
```

##### `key`<sup>Required</sup> <a name="export-backend.ExportTag.property.key"></a>

- *Type:* `string`

---

##### `value`<sup>Required</sup> <a name="export-backend.ExportTag.property.value"></a>

- *Type:* `string`

---

### ProviderCredential <a name="export-backend.ProviderCredential"></a>

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { ProviderCredential } from 'export-backend'

const providerCredential: ProviderCredential = { ... }
```

##### `clientId`<sup>Required</sup> <a name="export-backend.ProviderCredential.property.clientId"></a>

- *Type:* `string`

---

##### `clientSecret`<sup>Required</sup> <a name="export-backend.ProviderCredential.property.clientSecret"></a>

- *Type:* `string`

---

##### `providerName`<sup>Required</sup> <a name="export-backend.ProviderCredential.property.providerName"></a>

- *Type:* `string`

---


## Protocols <a name="Protocols"></a>

### IAmplifyExportedBackend <a name="export-backend.IAmplifyExportedBackend"></a>

- *Implemented By:* [`export-backend.AmplifyExportedBackend`](#export-backend.AmplifyExportedBackend), [`export-backend.IAmplifyExportedBackend`](#export-backend.IAmplifyExportedBackend)

Represents the Amplify Exported Backend Stack.

#### Methods <a name="Methods"></a>

##### `apiRestNestedStack` <a name="export-backend.IAmplifyExportedBackend.apiRestNestedStack"></a>

```typescript
public apiRestNestedStack(resourceName: string)
```

###### `resourceName`<sup>Required</sup> <a name="export-backend.IAmplifyExportedBackend.parameter.resourceName"></a>

- *Type:* `string`

---

##### `authNestedStack` <a name="export-backend.IAmplifyExportedBackend.authNestedStack"></a>

```typescript
public authNestedStack()
```

##### `graphqlNestedStacks` <a name="export-backend.IAmplifyExportedBackend.graphqlNestedStacks"></a>

```typescript
public graphqlNestedStacks()
```

##### `lambdaFunctionNestedStackByName` <a name="export-backend.IAmplifyExportedBackend.lambdaFunctionNestedStackByName"></a>

```typescript
public lambdaFunctionNestedStackByName(functionName: string)
```

###### `functionName`<sup>Required</sup> <a name="export-backend.IAmplifyExportedBackend.parameter.functionName"></a>

- *Type:* `string`

the function name to get from the nested stack.

---

##### `lambdaFunctionNestedStacks` <a name="export-backend.IAmplifyExportedBackend.lambdaFunctionNestedStacks"></a>

```typescript
public lambdaFunctionNestedStacks()
```

##### `nestedStacksByCategory` <a name="export-backend.IAmplifyExportedBackend.nestedStacksByCategory"></a>

```typescript
public nestedStacksByCategory(category: string, resourceName?: string)
```

###### `category`<sup>Required</sup> <a name="export-backend.IAmplifyExportedBackend.parameter.category"></a>

- *Type:* `string`

of the categories defined in Amplify CLI like function, api, auth etc.

---

###### `resourceName`<sup>Optional</sup> <a name="export-backend.IAmplifyExportedBackend.parameter.resourceName"></a>

- *Type:* `string`

---


### IAPIGraphQLIncludeNestedStack <a name="export-backend.IAPIGraphQLIncludeNestedStack"></a>

- *Implemented By:* [`export-backend.IAPIGraphQLIncludeNestedStack`](#export-backend.IAPIGraphQLIncludeNestedStack)

#### Methods <a name="Methods"></a>

##### `appSyncAPIKey` <a name="export-backend.IAPIGraphQLIncludeNestedStack.appSyncAPIKey"></a>

```typescript
public appSyncAPIKey()
```

##### `graphQLAPI` <a name="export-backend.IAPIGraphQLIncludeNestedStack.graphQLAPI"></a>

```typescript
public graphQLAPI()
```

##### `graphQLSchema` <a name="export-backend.IAPIGraphQLIncludeNestedStack.graphQLSchema"></a>

```typescript
public graphQLSchema()
```

##### `modelNestedStack` <a name="export-backend.IAPIGraphQLIncludeNestedStack.modelNestedStack"></a>

```typescript
public modelNestedStack(tableName: string)
```

###### `tableName`<sup>Required</sup> <a name="export-backend.IAPIGraphQLIncludeNestedStack.parameter.tableName"></a>

- *Type:* `string`

is the model name in your Graph QL API.

---


### IAPIRestIncludedStack <a name="export-backend.IAPIRestIncludedStack"></a>

- *Implemented By:* [`export-backend.IAPIRestIncludedStack`](#export-backend.IAPIRestIncludedStack)

#### Methods <a name="Methods"></a>

##### `apiDeployment` <a name="export-backend.IAPIRestIncludedStack.apiDeployment"></a>

```typescript
public apiDeployment()
```

##### `restAPI` <a name="export-backend.IAPIRestIncludedStack.restAPI"></a>

```typescript
public restAPI()
```


### IAuthIncludeNestedStack <a name="export-backend.IAuthIncludeNestedStack"></a>

- *Implemented By:* [`export-backend.IAuthIncludeNestedStack`](#export-backend.IAuthIncludeNestedStack)

#### Methods <a name="Methods"></a>

##### `hostedUiProviderCredentials` <a name="export-backend.IAuthIncludeNestedStack.hostedUiProviderCredentials"></a>

```typescript
public hostedUiProviderCredentials(credentials: ProviderCredential[])
```

###### `credentials`<sup>Required</sup> <a name="export-backend.IAuthIncludeNestedStack.parameter.credentials"></a>

- *Type:* [`export-backend.ProviderCredential`](#export-backend.ProviderCredential)[]

---

##### `identityPool` <a name="export-backend.IAuthIncludeNestedStack.identityPool"></a>

```typescript
public identityPool()
```

##### `userPool` <a name="export-backend.IAuthIncludeNestedStack.userPool"></a>

```typescript
public userPool()
```


### ILambdaFunctionIncludedNestedStack <a name="export-backend.ILambdaFunctionIncludedNestedStack"></a>

- *Implemented By:* [`export-backend.ILambdaFunctionIncludedNestedStack`](#export-backend.ILambdaFunctionIncludedNestedStack)

#### Methods <a name="Methods"></a>

##### `lambdaFunction` <a name="export-backend.ILambdaFunctionIncludedNestedStack.lambdaFunction"></a>

```typescript
public lambdaFunction()
```


