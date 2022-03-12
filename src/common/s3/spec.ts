import s3 from '@common/s3';

it('is an object', () => {
  expect(typeof s3).toBe('object');
});

it('has save', () => {
  expect(typeof s3.save).toBe('function');
});
