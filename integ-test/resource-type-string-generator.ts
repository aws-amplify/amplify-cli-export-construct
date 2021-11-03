export const ResourceTypeConstants = {
    "AWS": {
        "IAM": {
            "GROUP": "AWS::IAM::Group",
            "POLICY": "AWS::IAM::Policy",
            "SERVICELINKEDROLE": "AWS::IAM::ServiceLinkedRole",
            "ACCESSKEY": "AWS::IAM::AccessKey",
            "USER": "AWS::IAM::User",
            "OIDCPROVIDER": "AWS::IAM::OIDCProvider",
            "VIRTUALMFADEVICE": "AWS::IAM::VirtualMFADevice",
            "ROLE": "AWS::IAM::Role",
            "SAMLPROVIDER": "AWS::IAM::SAMLProvider",
            "USERTOGROUPADDITION": "AWS::IAM::UserToGroupAddition",
            "INSTANCEPROFILE": "AWS::IAM::InstanceProfile",
            "MANAGEDPOLICY": "AWS::IAM::ManagedPolicy",
            "SERVERCERTIFICATE": "AWS::IAM::ServerCertificate"
        },
        "S3": {
            "MULTIREGIONACCESSPOINT": "AWS::S3::MultiRegionAccessPoint",
            "ACCESSPOINT": "AWS::S3::AccessPoint",
            "STORAGELENS": "AWS::S3::StorageLens",
            "BUCKET": "AWS::S3::Bucket",
            "BUCKETPOLICY": "AWS::S3::BucketPolicy",
            "MULTIREGIONACCESSPOINTPOLICY": "AWS::S3::MultiRegionAccessPointPolicy"
        },
        "ELASTICSEARCH": {
            "DOMAIN": "AWS::Elasticsearch::Domain"
        },
        "APIGATEWAYV2": {
            "ROUTE": "AWS::ApiGatewayV2::Route",
            "APIGATEWAYMANAGEDOVERRIDES": "AWS::ApiGatewayV2::ApiGatewayManagedOverrides",
            "STAGE": "AWS::ApiGatewayV2::Stage",
            "API": "AWS::ApiGatewayV2::Api",
            "ROUTERESPONSE": "AWS::ApiGatewayV2::RouteResponse",
            "VPCLINK": "AWS::ApiGatewayV2::VpcLink",
            "DOMAINNAME": "AWS::ApiGatewayV2::DomainName",
            "INTEGRATION": "AWS::ApiGatewayV2::Integration",
            "DEPLOYMENT": "AWS::ApiGatewayV2::Deployment",
            "MODEL": "AWS::ApiGatewayV2::Model",
            "AUTHORIZER": "AWS::ApiGatewayV2::Authorizer",
            "INTEGRATIONRESPONSE": "AWS::ApiGatewayV2::IntegrationResponse",
            "APIMAPPING": "AWS::ApiGatewayV2::ApiMapping"
        },
        "SQS": {
            "QUEUE": "AWS::SQS::Queue",
            "QUEUEPOLICY": "AWS::SQS::QueuePolicy"
        },
        "APPSYNC": {
            "RESOLVER": "AWS::AppSync::Resolver",
            "GRAPHQLSCHEMA": "AWS::AppSync::GraphQLSchema",
            "GRAPHQLAPI": "AWS::AppSync::GraphQLApi",
            "APIKEY": "AWS::AppSync::ApiKey",
            "DATASOURCE": "AWS::AppSync::DataSource",
            "FUNCTIONCONFIGURATION": "AWS::AppSync::FunctionConfiguration",
            "APICACHE": "AWS::AppSync::ApiCache"
        },
        "CLOUDWATCH": {
            "DASHBOARD": "AWS::CloudWatch::Dashboard",
            "ANOMALYDETECTOR": "AWS::CloudWatch::AnomalyDetector",
            "COMPOSITEALARM": "AWS::CloudWatch::CompositeAlarm",
            "INSIGHTRULE": "AWS::CloudWatch::InsightRule",
            "METRICSTREAM": "AWS::CloudWatch::MetricStream",
            "ALARM": "AWS::CloudWatch::Alarm"
        },
        "ECS": {
            "CLUSTER": "AWS::ECS::Cluster",
            "CAPACITYPROVIDER": "AWS::ECS::CapacityProvider",
            "PRIMARYTASKSET": "AWS::ECS::PrimaryTaskSet",
            "SERVICE": "AWS::ECS::Service",
            "TASKSET": "AWS::ECS::TaskSet",
            "CLUSTERCAPACITYPROVIDERASSOCIATIONS": "AWS::ECS::ClusterCapacityProviderAssociations",
            "TASKDEFINITION": "AWS::ECS::TaskDefinition"
        },
        "CLOUDFRONT": {
            "KEYGROUP": "AWS::CloudFront::KeyGroup",
            "STREAMINGDISTRIBUTION": "AWS::CloudFront::StreamingDistribution",
            "CACHEPOLICY": "AWS::CloudFront::CachePolicy",
            "DISTRIBUTION": "AWS::CloudFront::Distribution",
            "CLOUDFRONTORIGINACCESSIDENTITY": "AWS::CloudFront::CloudFrontOriginAccessIdentity",
            "REALTIMELOGCONFIG": "AWS::CloudFront::RealtimeLogConfig",
            "ORIGINREQUESTPOLICY": "AWS::CloudFront::OriginRequestPolicy",
            "PUBLICKEY": "AWS::CloudFront::PublicKey",
            "FUNCTION": "AWS::CloudFront::Function"
        },
        "CLOUDFORMATION": {
            "STACKSET": "AWS::CloudFormation::StackSet",
            "STACK": "AWS::CloudFormation::Stack",
            "RESOURCEDEFAULTVERSION": "AWS::CloudFormation::ResourceDefaultVersion",
            "CUSTOMRESOURCE": "AWS::CloudFormation::CustomResource",
            "TYPEACTIVATION": "AWS::CloudFormation::TypeActivation",
            "PUBLISHER": "AWS::CloudFormation::Publisher",
            "PUBLICTYPEVERSION": "AWS::CloudFormation::PublicTypeVersion",
            "WAITCONDITION": "AWS::CloudFormation::WaitCondition",
            "RESOURCEVERSION": "AWS::CloudFormation::ResourceVersion",
            "WAITCONDITIONHANDLE": "AWS::CloudFormation::WaitConditionHandle",
            "MACRO": "AWS::CloudFormation::Macro",
            "MODULEDEFAULTVERSION": "AWS::CloudFormation::ModuleDefaultVersion",
            "MODULEVERSION": "AWS::CloudFormation::ModuleVersion"
        },
        "COGNITO": {
            "USERPOOLRISKCONFIGURATIONATTACHMENT": "AWS::Cognito::UserPoolRiskConfigurationAttachment",
            "USERPOOLIDENTITYPROVIDER": "AWS::Cognito::UserPoolIdentityProvider",
            "USERPOOLGROUP": "AWS::Cognito::UserPoolGroup",
            "IDENTITYPOOL": "AWS::Cognito::IdentityPool",
            "USERPOOLRESOURCESERVER": "AWS::Cognito::UserPoolResourceServer",
            "USERPOOL": "AWS::Cognito::UserPool",
            "USERPOOLCLIENT": "AWS::Cognito::UserPoolClient",
            "USERPOOLUSERTOGROUPATTACHMENT": "AWS::Cognito::UserPoolUserToGroupAttachment",
            "IDENTITYPOOLROLEATTACHMENT": "AWS::Cognito::IdentityPoolRoleAttachment",
            "USERPOOLUSER": "AWS::Cognito::UserPoolUser",
            "USERPOOLUICUSTOMIZATIONATTACHMENT": "AWS::Cognito::UserPoolUICustomizationAttachment",
            "USERPOOLDOMAIN": "AWS::Cognito::UserPoolDomain"
        },
        "SNS": {
            "SUBSCRIPTION": "AWS::SNS::Subscription",
            "TOPIC": "AWS::SNS::Topic",
            "TOPICPOLICY": "AWS::SNS::TopicPolicy"
        },
        "EFS": {
            "MOUNTTARGET": "AWS::EFS::MountTarget",
            "FILESYSTEM": "AWS::EFS::FileSystem",
            "ACCESSPOINT": "AWS::EFS::AccessPoint"
        },
        "APIGATEWAY": {
            "DEPLOYMENT": "AWS::ApiGateway::Deployment",
            "AUTHORIZER": "AWS::ApiGateway::Authorizer",
            "DOMAINNAME": "AWS::ApiGateway::DomainName",
            "DOCUMENTATIONPART": "AWS::ApiGateway::DocumentationPart",
            "MODEL": "AWS::ApiGateway::Model",
            "USAGEPLAN": "AWS::ApiGateway::UsagePlan",
            "BASEPATHMAPPING": "AWS::ApiGateway::BasePathMapping",
            "STAGE": "AWS::ApiGateway::Stage",
            "GATEWAYRESPONSE": "AWS::ApiGateway::GatewayResponse",
            "CLIENTCERTIFICATE": "AWS::ApiGateway::ClientCertificate",
            "DOCUMENTATIONVERSION": "AWS::ApiGateway::DocumentationVersion",
            "USAGEPLANKEY": "AWS::ApiGateway::UsagePlanKey",
            "REQUESTVALIDATOR": "AWS::ApiGateway::RequestValidator",
            "APIKEY": "AWS::ApiGateway::ApiKey",
            "RESOURCE": "AWS::ApiGateway::Resource",
            "ACCOUNT": "AWS::ApiGateway::Account",
            "RESTAPI": "AWS::ApiGateway::RestApi",
            "VPCLINK": "AWS::ApiGateway::VpcLink",
            "METHOD": "AWS::ApiGateway::Method"
        },
        "LAMBDA": {
            "EVENTSOURCEMAPPING": "AWS::Lambda::EventSourceMapping",
            "LAYERVERSION": "AWS::Lambda::LayerVersion",
            "ALIAS": "AWS::Lambda::Alias",
            "LAYERVERSIONPERMISSION": "AWS::Lambda::LayerVersionPermission",
            "VERSION": "AWS::Lambda::Version",
            "CODESIGNINGCONFIG": "AWS::Lambda::CodeSigningConfig",
            "EVENTINVOKECONFIG": "AWS::Lambda::EventInvokeConfig",
            "FUNCTION": "AWS::Lambda::Function",
            "PERMISSION": "AWS::Lambda::Permission"
        },
        "EKS": {
            "NODEGROUP": "AWS::EKS::Nodegroup",
            "CLUSTER": "AWS::EKS::Cluster",
            "ADDON": "AWS::EKS::Addon",
            "FARGATEPROFILE": "AWS::EKS::FargateProfile"
        },
        "CODEARTIFACT": {
            "REPOSITORY": "AWS::CodeArtifact::Repository",
            "DOMAIN": "AWS::CodeArtifact::Domain"
        },
        "CONFIG": {
            "REMEDIATIONCONFIGURATION": "AWS::Config::RemediationConfiguration",
            "CONFIGURATIONAGGREGATOR": "AWS::Config::ConfigurationAggregator",
            "AGGREGATIONAUTHORIZATION": "AWS::Config::AggregationAuthorization",
            "CONFIGURATIONRECORDER": "AWS::Config::ConfigurationRecorder",
            "DELIVERYCHANNEL": "AWS::Config::DeliveryChannel",
            "ORGANIZATIONCONFIGRULE": "AWS::Config::OrganizationConfigRule",
            "ORGANIZATIONCONFORMANCEPACK": "AWS::Config::OrganizationConformancePack",
            "CONFIGRULE": "AWS::Config::ConfigRule",
            "CONFORMANCEPACK": "AWS::Config::ConformancePack",
            "STOREDQUERY": "AWS::Config::StoredQuery"
        },
        "CODEBUILD": {
            "SOURCECREDENTIAL": "AWS::CodeBuild::SourceCredential",
            "PROJECT": "AWS::CodeBuild::Project",
            "REPORTGROUP": "AWS::CodeBuild::ReportGroup"
        },
        "CODEDEPLOY": {
            "DEPLOYMENTCONFIG": "AWS::CodeDeploy::DeploymentConfig",
            "APPLICATION": "AWS::CodeDeploy::Application",
            "DEPLOYMENTGROUP": "AWS::CodeDeploy::DeploymentGroup"
        },
        "CLOUDTRAIL": {
            "TRAIL": "AWS::CloudTrail::Trail"
        },
        "CODEPIPELINE": {
            "PIPELINE": "AWS::CodePipeline::Pipeline",
            "CUSTOMACTIONTYPE": "AWS::CodePipeline::CustomActionType",
            "WEBHOOK": "AWS::CodePipeline::Webhook"
        },
        "AMPLIFY": {
            "APP": "AWS::Amplify::App",
            "BRANCH": "AWS::Amplify::Branch",
            "DOMAIN": "AWS::Amplify::Domain"
        },
        "SSM": {
            "PATCHBASELINE": "AWS::SSM::PatchBaseline",
            "MAINTENANCEWINDOWTARGET": "AWS::SSM::MaintenanceWindowTarget",
            "MAINTENANCEWINDOWTASK": "AWS::SSM::MaintenanceWindowTask",
            "DOCUMENT": "AWS::SSM::Document",
            "MAINTENANCEWINDOW": "AWS::SSM::MaintenanceWindow",
            "PARAMETER": "AWS::SSM::Parameter",
            "RESOURCEDATASYNC": "AWS::SSM::ResourceDataSync",
            "ASSOCIATION": "AWS::SSM::Association"
        },
        "ECR": {
            "REPOSITORY": "AWS::ECR::Repository",
            "REPLICATIONCONFIGURATION": "AWS::ECR::ReplicationConfiguration",
            "REGISTRYPOLICY": "AWS::ECR::RegistryPolicy"
        },
        "CODECOMMIT": {
            "REPOSITORY": "AWS::CodeCommit::Repository"
        },
        "DYNAMODB": {
            "TABLE": "AWS::DynamoDB::Table",
            "GLOBALTABLE": "AWS::DynamoDB::GlobalTable"
        },
        "OPENSEARCHSERVICE": {
            "DOMAIN": "AWS::OpenSearchService::Domain"
        }
    }
}