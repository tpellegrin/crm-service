import handlerPath from '@libs/handlerResolver';

import schema from './schema';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  role: 'AdminRole',
  events: [
    {
      http: {
        method: 'post',
        path: '/user',
        request: {
          schema: {
            'application/json': schema
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
