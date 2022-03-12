import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import middyfy from '@libs/lambda';
import dynamodb from '@common/dynamodb';
import cognito from '@common/cognito';

import schema from './schema';

const handler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  try {
    const { id } = event.pathParameters;
    const { admin, email: newEmail } = event.body;

    // Check for user.
    let { email: currentEmail } = await dynamodb.get('user', id);
    if (!currentEmail) {
      return formatJSONResponse({ message: 'user not found' }, 404);
    }

    // Update email on Cognito if it has changed.
    if (newEmail !== undefined && currentEmail !== newEmail) {
      await cognito.updateEmail(currentEmail, newEmail);
      currentEmail = newEmail;
    }

    // If an admin status is received, update the user priviledges on Cognito accordingly.
    if (admin !== undefined) {
      if (admin) {
        cognito.grantAdmin(currentEmail);
      } else {
        cognito.revokeAdmin(currentEmail);
      }
    }

    await dynamodb.update(event.body, 'user', id);
    return formatJSONResponse({ message: 'user updated' });
  } catch (Error) {
    return formatJSONResponse({ message: 'something went wrong' }, 500);
  }
};

export const main = middyfy(handler);
