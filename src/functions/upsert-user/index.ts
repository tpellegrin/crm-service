import schema from './schema';
import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'post',
        path: '/user/{id}',
        request: {
          schema: {
            'application/json': schema
          }
        }
      }
    },
    {
      http: {
        method: 'put',
        path: '/user',
        request: {
          schema: {
            'application/json': schema
          }
        }
      }
    }
  ]
};
