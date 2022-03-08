import 'source-map-support/register';

import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import dynamodb from '@common/dynamodb';

const handler = async (event) => {
  try {
    const customer = await dynamodb.get('customer', event.pathParameters.id);

    if (customer) {
      await dynamodb.delete('customer', event.pathParameters.id);
      return formatJSONResponse({ message: 'customer deleted' });
    } else {
      return formatJSONResponse({ message: 'customer not found' }, 404);
    }
  } catch (Error) {
    return formatJSONResponse({ message: 'something went wrong' }, 500);
  }
};

export const main = middyfy(handler);
