import {
  DocumentClient,
  awsSdkPromiseResponse
} from '@mocks/aws-sdk/clients/dynamodb';
import { main } from './handler';
import event from './mock.json';

const db = new DocumentClient();

describe('delete user function', () => {
  it(`calls dynamodb.delete when it receives an id from path and returns ok`, async () => {
    const response = await main(event, null, null);

    expect(db.delete).toHaveBeenCalledWith({
      Keys: { id: 'd290f1ee-6c54-4b01-90e6-d701748f0851', sort: 'user' },
      TableName: 'test'
    });
    expect(response).toBe({
      statusCode: 200,
      body: JSON.stringify({ message: 'user deleted' })
    });
  });

  it(`returns server error when DynamoDB breaks`, async () => {
    awsSdkPromiseResponse.mockReturnValueOnce(Promise.reject(new Error()));

    const response = await main(event, null, null);

    expect(response).toBe({
      statusCode: 500,
      body: JSON.stringify({ message: 'something went wrong' })
    });
  });
});
