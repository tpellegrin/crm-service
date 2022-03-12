import cognito from '@common/cognito';

it('is an object', () => {
  expect(typeof cognito).toBe('object');
});

it('has signUp, updateEmail, assignAdmin and revokeAdmin', () => {
  expect(typeof cognito.signUp).toBe('function');
  expect(typeof cognito.updateEmail).toBe('function');
  expect(typeof cognito.grantAdmin).toBe('function');
  expect(typeof cognito.revokeAdmin).toBe('function');
});
