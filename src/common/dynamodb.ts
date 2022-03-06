import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { nanoid } from 'nanoid';

const db = new DocumentClient();

const TableName = process.env.DYNAMODB_TABLE_NAME ?? 'test';

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
  async put(object: any, sort: SortKey, id?: string): Promise<void> {
    const params: DocumentClient.PutItemInput = {
      Item: {
        id: id ?? nanoid(6),
        sort,
        ...object
      },
      TableName
    };
    await db.put(params).promise();
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
  }
};

export default dynamodb;
