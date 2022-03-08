import 'source-map-support/register';

import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import dynamodb from '@common/dynamodb';

const handler = async (event) => {
  try {
    if (event.pathParameters?.id) {
      const user = await dynamodb.get('user', event.pathParameters.id);

      if (user) return formatJSONResponse(user);
      return formatJSONResponse({ message: 'user not found' }, 404);
    } else {
      const users = await dynamodb.scan('user');

      if (users) return formatJSONResponse(users);
      return formatJSONResponse({ message: 'user not found' }, 404);
    }
  } catch (Error) {
    return formatJSONResponse({ message: 'something went wrong' }, 500);
  }
};

export const main = middyfy(handler);
