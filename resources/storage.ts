export default {
  MainTable: {
    Type: 'AWS::DynamoDB::Table',
    Properties: {
      TableName: '${self:custom.mainTableName}',
      AttributeDefinitions: [
        { AttributeName: 'id', AttributeType: 'S' },
        { AttributeName: 'sort', AttributeType: 'S' }
      ],
      KeySchema: [
        { AttributeName: 'id', KeyType: 'HASH' },
        { AttributeName: 'sort', KeyType: 'RANGE' }
      ],
      BillingMode: 'PAY_PER_REQUEST'
    }
  },
  ImagesBucket: {
    Type: 'AWS::S3::Bucket',
    Properties: {
      BucketName: '${self:custom.imagesBucketName}'
    }
  }
};
