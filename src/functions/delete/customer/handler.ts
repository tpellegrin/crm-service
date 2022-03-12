import 'source-map-support/register';

import { APIGatewayProxyEvent } from 'aws-lambda';

import { formatJSONResponse } from '@libs/apiGateway';
import middyfy from '@libs/lambda';
import dynamodb from '@common/dynamodb';

const handler = async (event: APIGatewayProxyEvent) => {
  try {
    const { id } = event.pathParameters;
    const customer = await dynamodb.get('customer', id);

    // If an customer exists, try and delete it.
    if (customer) {
      await dynamodb.delete('customer', id);
      return formatJSONResponse({ message: 'customer deleted' });
    }

    return formatJSONResponse({ message: 'customer not found' }, 404);
  } catch (Error) {
    return formatJSONResponse({ message: 'something went wrong' }, 500);
  }
};

export const main = middyfy(handler);
