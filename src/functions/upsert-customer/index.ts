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
        }
      }
    },
    {
      http: {
        method: 'put',
        path: '/customer',
        request: {
          schema: {
            'application/json': schema
          }
        }
      }
    }
  ]
};
