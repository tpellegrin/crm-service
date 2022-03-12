import type { AWS } from '@serverless/typescript';

import {
  createCustomer,
  createUser,
  readCustomer,
  readUser,
  updateCustomer,
  updateUser,
  deleteCustomer,
  deleteUser
} from './src/functions';

import { authorizer, storage } from './resources';

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
    mainTableName: 'crm-files-db',
    imagesBucketName: 'crm-images-bucket'
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
      MAIN_TABLE: '${self:custom.mainTableName}',
      IMAGES_BUCKET: '${self:custom.imagesBucketName}'
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
    createCustomer,
    createUser,
    readCustomer,
    readUser,
    updateCustomer,
    updateUser,
    deleteCustomer,
    deleteUser
  },
  resources: {
    Resources: {
      ...authorizer,
      ...storage
    }
  }
};

module.exports = serverlessConfiguration;
