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
    const { id } = event.pathParameters;
    const { data: imageData, mime: imageMime } = event.body.photo || {};

    // Check for customer.
    const customer = await dynamodb.get('customer', id);
    if (!customer) {
      return formatJSONResponse({ message: 'customer not found' }, 404);
    }

    // If an image is received, try to save it on S3 and store the newly generated url.
    if (imageData && imageMime) {
      const { data, mime } = await getImageMetadata(imageData);
      const { url } = await s3.save(data, mime);
      event.body.photoUrl = url;
    }

    // If an image is received and there was a previous image already stored, remove it from S3.
    const { photoUrl } = await dynamodb.get('customer', id);
    if (photoUrl && imageData && imageMime) {
      await s3.delete(photoUrl.substring(photoUrl.length - 10));
    }

    // Try and update registry on DynamoDB from request body.
    await dynamodb.update(event.body, 'customer', id);
    return formatJSONResponse({ message: 'customer updated' });
  } catch (Error) {
    return formatJSONResponse({ message: 'something went wrong' }, 500);
  }
};

export const main = middyfy(handler);
