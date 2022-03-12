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
    const { admin, email } = event.body;

    // Return error if the email was already used.
    const users = await dynamodb.scan('user', email);
    if (users.length) {
      return formatJSONResponse({ message: 'email already registered' }, 409);
    }

    // Try and create a new user registry on DynamoDB and Cognito from request body.
    const { password } = await cognito.signUp(email);
    const { id } = await dynamodb.put(event.body, 'user');

    // If an admin status is received, try to grant or revoke admin priviledge on Cognito accordingly.
    if (admin !== undefined) {
      if (admin) {
        cognito.grantAdmin(email);
      } else {
        cognito.revokeAdmin(email);
      }
    }

    // Return the recently created id and the randomly-generated temporary password for the new user.
    return formatJSONResponse({ id, password });
  } catch (Error) {
    return formatJSONResponse({ message: 'something went wrong' }, 500);
  }
};

export const main = middyfy(handler);
