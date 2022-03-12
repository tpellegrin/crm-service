import {
  DocumentClient,
  awsSdkPromiseResponse
} from '@mocks/aws-sdk/clients/dynamodb';
import { main } from './handler';
import event from './mock.json';

const db = new DocumentClient();

describe('read customer function', () => {
  it(`calls dynamodb.get when it receives an id from path and returns an customer`, async () => {
    const fake = {
      id: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
      first_name: 'Thiago',
      surname: 'Pellegrin'
    };
    awsSdkPromiseResponse.mockReturnValueOnce(Promise.resolve({ Item: fake }));

    const response = await main(event, null, null);

    expect(db.get).toHaveBeenCalledWith({
      Key: { id: 'd290f1ee-6c54-4b01-90e6-d701748f0851', sort: 'customer' },
      TableName: 'test'
    });
    expect(response).toStrictEqual({
      statusCode: 200,
      body: JSON.stringify(fake)
    });
  });

  it(`calls dynamodb.scan when it doesn't receive an id from path and returns an array of customers`, async () => {
    const eventWithoutId = event;
    delete eventWithoutId.pathParameters.id;
    const fakes = [
      {
        id: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
        first_name: 'Thiago',
        surname: 'Pellegrin'
      }
    ];
    awsSdkPromiseResponse.mockReturnValueOnce(
      Promise.resolve({ Items: fakes })
    );

    const response = await main(eventWithoutId, null, null);

    expect(db.scan).toHaveBeenCalled();
    expect(response).toStrictEqual({
      statusCode: 200,
      body: JSON.stringify(fakes)
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
