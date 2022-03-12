import handlerPath from '@libs/handlerResolver';

import schema from './schema';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  role: 'AdminRole',
  events: [
    {
      http: {
        method: 'put',
        path: '/user/{id}',
        request: {
          parameters: {
            paths: {
              id: true
            }
          },
          schema: {
            'application/json': schema
          }
        },
        authorizer: {
          type: 'COGNITO_USER_POOLS',
          authorizerId: {
            Ref: 'ApiGatewayAuthorizer'
          },
          scopes: ['aws.cognito.signin.user.admin']
        }
      }
    }
  ]
};
