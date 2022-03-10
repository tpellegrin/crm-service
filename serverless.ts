import type { AWS } from '@serverless/typescript';

import {
  deleteCustomer,
  deleteUser,
  readCustomer,
  readUser,
  upsertCustomer,
  upsertUser
} from './src/functions/index';

const serverlessConfiguration: AWS = {
  service: {
    name: 'crm-service'
  },
  frameworkVersion: '2',
  custom: {
    defaultStage: 'prd',
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true
    },
    mainTableName: 'crm-db',
    imagesBucketName: 'crm-images'
  },
  plugins: ['serverless-webpack', 'serverless-dotenv-plugin', 'serverless-offline'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    stage: '${opt:stage, self:custom.defaultStage}',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      MAIN_TABLE_NAME: '${self:custom.mainTableName}',
      IMAGES_BUCKET_NAME: '${self:custom.imagesBucketName}'
    },
    lambdaHashingVersion: '20201221',
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: ['dynamodb:*', 's3:*'],
        Resource: '*'
      }
    ]
  },
  functions: {
    deleteCustomer,
    deleteUser,
    readCustomer,
    readUser,
    upsertCustomer,
    upsertUser
  },
  resources: {
    Resources: {
      MainTable: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName: '${self:custom.mainTableName}',
          AttributeDefinitions: [
            { AttributeName: 'id', AttributeType: 'S' },
            { AttributeName: 'sort', AttributeType: 'S' }
          ],
          KeySchema: [
            { AttributeName: 'id', KeyType: 'HASH' },
            { AttributeName: 'sort', KeyType: 'RANGE' }
          ],
          BillingMode: 'PAY_PER_REQUEST'
        }
      },
      ImagesBucket: {
        Type: 'AWS::S3::Bucket',
        Properties: {
          BucketName: '${self:custom.imagesBucketName}'
        }
      },
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
    }
  }
};

module.exports = serverlessConfiguration;
