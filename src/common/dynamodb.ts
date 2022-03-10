import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { nanoid } from 'nanoid';

const db = new DocumentClient();

const TableName = process.env.JEST_WORKER_ID
  ? 'test'
  : process.env.MAIN_TABLE_NAME;

type SortKey = 'user' | 'customer';

const dynamodb = {
  async get(sort: SortKey, id: string): Promise<any> {
    const params: DocumentClient.GetItemInput = {
      Key: {
        id,
        sort
      },
      TableName
    };
    const result = await db.get(params).promise();
    return result.Item;
  },
  async put(object: any, sort: SortKey, id?: string): Promise<{ id: string }> {
    const params: DocumentClient.PutItemInput = {
      Item: {
        id: id ?? nanoid(6),
        sort,
        ...object
      },
      TableName
    };
    await db.put(params).promise();
    return params.Item.id;
  },
  async update(object: any, sort: SortKey, id: string): Promise<void> {
    const params: DocumentClient.UpdateItemInput = {
      Key: {
        id,
        sort
      },
      UpdateExpression: `set ${Object.entries(object)
        .map((entry) => {
          const [key] = entry;
          return `${key} = :${key}`;
        })
        .join(', ')}`,
      ExpressionAttributeValues: Object.entries(object).reduce(
        (result, entry) => {
          const [key, value] = entry;
          result[`:${key}`] = `${value}`;
          return result;
        },
        {}
      ),
      TableName
    };
    await db.update(params).promise();
  },
  async delete(sort: SortKey, id: string): Promise<void> {
    const params: DocumentClient.DeleteItemInput = {
      Key: {
        id,
        sort
      },
      TableName
    };
    await db.delete(params).promise();
  },
  async scan(sort: SortKey, email?: string): Promise<any> {
    const params: DocumentClient.ScanInput = {
      FilterExpression: 'sort = :sort',
      ...(email && { FilterExpression: 'sort = :sort and :email = email' }),
      ExpressionAttributeValues: {
        ':sort': sort,
        ...(email && { ':email': email })
      },
      TableName
    };
    const result = await db.scan(params).promise();
    return result.Items;
  }
};

export default dynamodb;
