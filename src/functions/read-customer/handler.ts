import 'source-map-support/register';

import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import dynamodb from '@common/dynamodb';

const handler = async (event) => {
  try {
    if (event.pathParameters?.id) {
      const customer = await dynamodb.get('customer', event.pathParameters.id);

      if (customer) return formatJSONResponse(customer);
      return formatJSONResponse({ message: 'customer not found' }, 404);
    } else {
      const customers = await dynamodb.scan('customer');

      if (customers) return formatJSONResponse(customers);
      return formatJSONResponse({ message: 'customers not found' }, 404);
    }
  } catch (Error) {
    return formatJSONResponse({ message: 'something went wrong' }, 500);
  }
};

export const main = middyfy(handler);
