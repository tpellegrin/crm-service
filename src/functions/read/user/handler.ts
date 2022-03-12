import 'source-map-support/register';

import { APIGatewayProxyEvent } from 'aws-lambda';

import { formatJSONResponse } from '@libs/apiGateway';
import middyfy from '@libs/lambda';
import dynamodb from '@common/dynamodb';

const handler = async (event: APIGatewayProxyEvent) => {
  try {
    const { id } = event.pathParameters || {};

    // If an id is received, try and retrieve one registry.
    if (id) {
      const user = await dynamodb.get('user', id);

      if (user) return formatJSONResponse(user);
      return formatJSONResponse({ message: 'user not found' }, 404);
    }

    // Try and retrieve every possible registry.
    const users = await dynamodb.scan('user');

    if (users) return formatJSONResponse(users);
    return formatJSONResponse({ message: 'user not found' }, 404);
  } catch (Error) {
    return formatJSONResponse({ message: 'something went wrong' }, 500);
  }
};

export const main = middyfy(handler);
