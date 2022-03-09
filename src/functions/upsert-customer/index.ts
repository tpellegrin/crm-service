import schema from './schema';
import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'post',
        path: '/customer/{id}',
        request: {
          schema: {
            'application/json': schema
          }
        },
        authorizer: {
          type: 'COGNITO_USER_POOLS',
          authorizerId: {
            Ref: 'ApiGatewayAuthorizer'
          },
          scopes: ['email', 'aws.cognito.signin.user.admin']
        }
      },
    },
    {
      http: {
        method: 'put',
        path: '/customer',
        request: {
          schema: {
            'application/json': schema
          }
        },
        authorizer: {
          type: 'COGNITO_USER_POOLS',
          authorizerId: {
            Ref: 'ApiGatewayAuthorizer'
          },
          scopes: ['email', 'aws.cognito.signin.user.admin']
        }
      },
    }
  ]
};
