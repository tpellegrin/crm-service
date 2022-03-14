import handlerPath from '@libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  role: 'AdminRole',
  events: [
    {
      http: {
        method: 'delete',
        path: '/user/{id}',
        request: {
          parameters: {
            paths: {
              id: true
            }
          }
        },
        authorizer: {
          type: 'TOKEN',
          name: 'adminAuth',
          identitySource: 'method.request.header.Authorization'
        }
      }
    }
  ]
};
