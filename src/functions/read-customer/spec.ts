import {
  DocumentClient,
  awsSdkPromiseResponse
} from '@mocks/aws-sdk/clients/dynamodb';
import { main } from './handler';
import event from './mock.json';

const db = new DocumentClient();

describe('read customer function', () => {
  it(`calls dynamodb.get when it receives an id from path and returns an object`, async () => {
    const fake = {
      id: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
      name: 'Thiago',
      surname: 'Pellegrin'
    };
    awsSdkPromiseResponse.mockReturnValueOnce(Promise.resolve({ Item: fake }));

    const response = await main(event, null, null);

    expect(db.get).toHaveBeenCalledWith({
      Keys: { id: 'd290f1ee-6c54-4b01-90e6-d701748f0851', sort: 'customer' },
      TableName: 'test'
    });
    expect(response).toEqual({
      statusCode: 200,
      body: JSON.stringify(fake)
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
