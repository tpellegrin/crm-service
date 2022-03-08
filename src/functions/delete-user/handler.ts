import 'source-map-support/register';

import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import dynamodb from '@common/dynamodb';

const handler = async (event) => {
  try {
    const user = await dynamodb.get('user', event.pathParameters.id);

    if (user) {
      await dynamodb.delete('user', event.pathParameters.id);
      return formatJSONResponse({ message: 'user deleted' });
    } else {
      return formatJSONResponse({ message: 'user not found' }, 404);
    }
  } catch (Error) {
    return formatJSONResponse({ message: 'something went wrong' }, 500);
  }
};

export const main = middyfy(handler);
