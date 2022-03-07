import {
  DocumentClient,
  awsSdkPromiseResponse
} from '@mocks/aws-sdk/clients/dynamodb';
import { main } from './handler';
import event from './mock.json';

const db = new DocumentClient();

describe('upsert customer function', () => {
  it(`calls dynamodb.put when it doesn't receives an id`, async () => {
    const eventWithoutId = event;
    delete eventWithoutId.pathParameters.id;

    await main(event, null, null);

    expect(db.put).toHaveBeenCalled();
  });

  it(`doesn't call dynamodb.put when it receives an id`, async () => {
    await main(event, null, null);

    expect(db.put).not.toHaveBeenCalled();
  });

  it(`calls dynamodb.update when it receives an id`, async () => {
    await main(event, null, null);

    expect(db.update).toHaveBeenCalledWith({
      Key: {
        id: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
        sort: 'customer'
      },
      UpdateExpression:
        'set name = :name, surname = :surname, email = :email, admin = :admin',
      ExpressionAttributeValues: {
        ':name': 'Thiago',
        ':surname': 'Pellegrin',
        ':email': 'thiago@email.com',
        ':admin': 'true'
      },
      TableName: 'test'
    });
  });

  it(`returns server error when DynamoDB breaks`, async () => {
    awsSdkPromiseResponse.mockReturnValueOnce(Promise.reject(new Error()));

    const response = await main(event, null, null);

    expect(response).toBe({
      statusCode: 500,
      body: { message: 'something went wrong' }
    });
  });
});
