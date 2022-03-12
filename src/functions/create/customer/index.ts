import handlerPath from '@libs/handlerResolver';

import schema from './schema';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'post',
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
          scopes: ['aws.cognito.signin.user.admin']
        }
      }
    }
  ]
};
