import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'delete',
        path: '/customer/{id}',
        request: {
          parameters: {
            paths: {
              id: true
            }
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
