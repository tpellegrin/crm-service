import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import dynamodb from '@common/dynamodb';

import schema from './schema';

const handler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  try {
    if (event.pathParameters?.id) {
      await dynamodb.update(event.body, 'customer', event.pathParameters.id);
      return formatJSONResponse({ message: 'customer updated' });
    } else {
      const id = await dynamodb.put(event.body, 'customer');
      return formatJSONResponse(id);
    }
  } catch (Error) {
    return formatJSONResponse({ message: 'something went wrong' }, 500);
  }
};

export const main = middyfy(handler);
