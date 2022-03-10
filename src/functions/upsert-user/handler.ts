import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import dynamodb from '@common/dynamodb';
import cognito from '@common/cognito';

import schema from './schema';

const alterAdminStatus = async (email: string, status: boolean) => {
  status ? cognito.assignAdmin(email) : cognito.revokeAdmin(email);
};

const handler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  try {
    const id = event.pathParameters?.id || undefined;
    const admin = event.body.admin;
    const newEmail = event.body.email;

    if (id) {
      let { email: currentEmail } = await dynamodb.get('user', id);
      if (!currentEmail)
        return formatJSONResponse({ message: 'user not found' }, 404);
      if (newEmail !== undefined && currentEmail !== newEmail) {
        await cognito.updateEmail(currentEmail, newEmail);
        currentEmail = newEmail;
      }
      if (admin !== undefined) await alterAdminStatus(currentEmail, admin);
      await dynamodb.update(event.body, 'user', id);
      return formatJSONResponse({ message: 'user updated' });
    } else {
      if (!newEmail)
        return formatJSONResponse({ message: 'email required' }, 400);
      const password = await cognito.signUp(newEmail);
      const id = await dynamodb.put(event.body, 'user');
      if (admin !== undefined) await alterAdminStatus(newEmail, admin);
      return formatJSONResponse({ id, password });
    }
  } catch (e) {
    console.log(e);
    return formatJSONResponse({ message: 'something went wrong' }, 500);
  }
};

export const main = middyfy(handler);
