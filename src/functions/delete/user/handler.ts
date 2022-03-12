import 'source-map-support/register';

import { APIGatewayProxyEvent } from 'aws-lambda';

import { formatJSONResponse } from '@libs/apiGateway';
import middyfy from '@libs/lambda';
import dynamodb from '@common/dynamodb';

const handler = async (event: APIGatewayProxyEvent) => {
  try {
    const { id } = event.pathParameters;
    const user = await dynamodb.get('user', id);

    // If an user exists, try and delete it.
    if (user) {
      await dynamodb.delete('user', id);
      return formatJSONResponse({ message: 'user deleted' });
    }

    return formatJSONResponse({ message: 'user not found' }, 404);
  } catch (Error) {
    return formatJSONResponse({ message: 'something went wrong' }, 500);
  }
};

export const main = middyfy(handler);
