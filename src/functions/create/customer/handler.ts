import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import middyfy from '@libs/lambda';
import { getImageMetadata } from '@common/util';
import s3 from '@common/s3';
import dynamodb from '@common/dynamodb';

import schema from './schema';

const handler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  try {
    const { email } = event.body;
    const { data: imageData, mime: imageMime } = event.body.photo || {};

    // Return error if the email was already used.
    const customers = await dynamodb.scan('customer', email);
    if (customers.length) {
      return formatJSONResponse({ message: 'email already registered' }, 409);
    }

    // If an image is received, try to save it on S3 and store the newly generated url.
    if (imageData && imageMime) {
      const { data, mime } = await getImageMetadata(imageData);
      const { url } = await s3.save(data, mime);
      event.body.photoUrl = url;
    }

    // Try and create a new customer registry on DynamoDB from request body;
    const newId = await dynamodb.put(event.body, 'customer');
    return formatJSONResponse(newId);
  } catch (Error) {
    return formatJSONResponse({ message: 'something went wrong' }, 500);
  }
};

export const main = middyfy(handler);
