import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: '/customer/{id}',
        request: {
          parameters: {
            paths: {
              id: true
            }
          }
        }
      }
    },
    {
      http: {
        method: 'get',
        path: '/customer'
      }
    }
  ]
};
