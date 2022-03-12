import {
  DocumentClient,
  awsSdkPromiseResponse
} from '@mocks/aws-sdk/clients/dynamodb';
import { main } from './handler';
import event from './mock.json';

const db = new DocumentClient();

describe('update user function', () => {
  it(`calls dynamodb.update with received input and returns ok`, async () => {
    const response = await main(event, null, null);

    expect(db.update).toHaveBeenCalledWith({
      Key: {
        id: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
        sort: 'user'
      },
      UpdateExpression:
        'set first_name = :first_name, surname = :surname, email = :email, admin = :admin',
      ExpressionAttributeValues: {
        ':first_name': 'Thiago',
        ':surname': 'Pellegrin',
        ':email': 'thiago@email.com',
        ':admin': 'true'
      },
      TableName: 'test'
    });
    expect(response).toStrictEqual({
      statusCode: 200,
      body: JSON.stringify({ message: 'user updated' })
    });
  });

  it(`returns server error when DynamoDB breaks`, async () => {
    awsSdkPromiseResponse.mockReturnValueOnce(Promise.reject(new Error()));

    const response = await main(event, null, null);

    expect(response).toStrictEqual({
      statusCode: 500,
      body: JSON.stringify({ message: 'something went wrong' })
    });
  });
});
