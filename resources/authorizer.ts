export default {
  CognitoUserPool: {
    Type: 'AWS::Cognito::UserPool',
    Properties: {
      UserPoolName: 'user-pool',
      UsernameAttributes: ['email'],
      AutoVerifiedAttributes: ['email'],
    },
  },
  CognitoUserPoolClient: {
    Type: 'AWS::Cognito::UserPoolClient',
    Properties: {
      ClientName: 'user-pool-client',
      UserPoolId: {
        Ref: 'CognitoUserPool'
      },
      ExplicitAuthFlows: ['ADMIN_NO_SRP_AUTH']
    }
  },
  AdminGroup: {
    Type: 'AWS::Cognito::UserPoolGroup',
    Properties: {
      GroupName: 'admin',
      UserPoolId: {
        Ref: 'CognitoUserPool'
      },
      RoleArn: { "Fn::GetAtt": ['AdminRole', 'Arn'] }
    },
  },
  AdminRole: {
    Type: 'AWS::IAM::Role',
    Properties: {
      RoleName: 'AdminRole',
      AssumeRolePolicyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Principal: {
              Service: ['lambda.amazonaws.com']
            },
            Action: 'sts:AssumeRole'
          }
        ]
      },
      Policies: [
        {
          PolicyName: 'CognitoAuthorizedPolicy',
          PolicyDocument: {
            Version: '2012-10-17',
            Statement: [
              {
                Effect: 'Allow',
                Action: ['execute-api:Invoke'],
                Resource: '*'
              }
            ]
          }
        }
      ]
    }
  },
  ApiGatewayRestApi: {
    Type: 'AWS::ApiGateway::RestApi',
    Properties: {
      Name: 'crm-service-${opt:stage, self:provider.stage}'
    }
  },
  ApiGatewayAuthorizer: {
    Type: 'AWS::ApiGateway::Authorizer',
    Properties: {
      Name: 'ApiCognitoAuthorizer',
      Type: 'COGNITO_USER_POOLS',
      IdentitySource: 'method.request.header.Authorization',
      RestApiId: {
        Ref: 'ApiGatewayRestApi'
      },
      ProviderARNs: [{ "Fn::GetAtt": ['CognitoUserPool', 'Arn'] }]
    }
  }
};
