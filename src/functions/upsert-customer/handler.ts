import 'source-map-support/register';

import { nanoid } from 'nanoid';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { getImageMetadata } from '@common/util';
import s3 from '@common/s3';
import dynamodb from '@common/dynamodb';

import schema from './schema';

const handler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  try {
    const id = event.pathParameters?.id || undefined;
    const imageData = event.body.photo?.data || undefined;
    const imageMime = event.body.photo?.mime || undefined;

    if (imageData && imageMime) {
      const image = await getImageMetadata(imageData);
      const { URI: imageUrl } = await s3.save(
        image.Data,
        nanoid(10),
        image.Mime,
        image.Extension
      );

      event.body.photoUrl = imageUrl;
    }
    if (id) {
      await dynamodb.update(event.body, 'customer', id);
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
