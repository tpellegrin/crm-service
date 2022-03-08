import dynamodb from '@common/dynamodb';

it('is an object', () => {
  expect(typeof dynamodb).toBe('object');
});

it('has get, put, update, delete and scan', () => {
  expect(typeof dynamodb.get).toBe('function');
  expect(typeof dynamodb.put).toBe('function');
  expect(typeof dynamodb.update).toBe('function');
  expect(typeof dynamodb.delete).toBe('function');
  expect(typeof dynamodb.scan).toBe('function');
});
