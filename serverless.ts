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
  useDotenv: true,
  frameworkVersion: '2',
  custom: {
    defaultStage: 'prd',
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true
    },
    mainTableName: 'prototype-crm-db',
    imagesBucketName: 'prototype-crm-images'
  },
  plugins: ['serverless-webpack'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    stage: "${opt:stage, self:custom.defaultStage}",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      MAIN_TABLE_NAME: '${self:custom.mainTableName}',
      IMAGES_BUCKET_NAME: '${self:custom.imagesBucketName}',
      COGNITO_USER_POOL: process.env.COGNITO_USER_POOL
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
          AutoVerifiedAttributes: ['email']
        }
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
          ProviderARNs: ['${self:provider.environment.COGNITO_USER_POOL}']
        }
      }
    }
  }
};

module.exports = serverlessConfiguration;
