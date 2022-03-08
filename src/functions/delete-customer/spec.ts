import {
  DocumentClient,
  awsSdkPromiseResponse
} from '@mocks/aws-sdk/clients/dynamodb';
import { main } from './handler';
import event from './mock.json';

const db = new DocumentClient();

describe('delete customer function', () => {
  it(`calls dynamodb.delete when it receives an id from path, validates it and returns ok`, async () => {
    const fake = { id: 'd290f1ee-6c54-4b01-90e6-d701748f0851' };
    awsSdkPromiseResponse.mockReturnValueOnce(Promise.resolve({ Item: fake }));
    const response = await main(event, null, null);

    expect(db.get).toHaveBeenCalledWith({
      Key: { id: 'd290f1ee-6c54-4b01-90e6-d701748f0851', sort: 'customer' },
      TableName: 'test'
    });
    expect(db.delete).toHaveBeenCalledWith({
      Key: { id: 'd290f1ee-6c54-4b01-90e6-d701748f0851', sort: 'customer' },
      TableName: 'test'
    });
    expect(response).toStrictEqual({
      statusCode: 200,
      body: JSON.stringify({ message: 'customer deleted' })
    });
  });

  it(`returns not found when the id validation is unsuccessful`, async () => {
    const fake = undefined;
    awsSdkPromiseResponse.mockReturnValueOnce(Promise.resolve({ Item: fake }));
    const response = await main(event, null, null);

    expect(db.get).toHaveBeenCalledWith({
      Key: { id: 'd290f1ee-6c54-4b01-90e6-d701748f0851', sort: 'customer' },
      TableName: 'test'
    });
    expect(response).toStrictEqual({
      statusCode: 404,
      body: JSON.stringify({ message: 'customer not found' })
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
