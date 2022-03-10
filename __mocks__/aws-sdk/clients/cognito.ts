export const awsSdkPromiseResponse = jest.fn().mockReturnValue(Promise.resolve(true));

const adminAddUserToGroupFn = jest.fn().mockImplementation(() => ({ promise: awsSdkPromiseResponse }));
const adminRemoveUserFromGroupFn = jest.fn().mockImplementation(() => ({ promise: awsSdkPromiseResponse }));
const adminUpdateUserAttributesFn = jest.fn().mockImplementation(() => ({ promise: awsSdkPromiseResponse }));
const signUpFn = jest.fn().mockImplementation(() => ({ promise: awsSdkPromiseResponse }));

export class CognitoIdentityServiceProvider {
  adminAddUserToGroup = adminAddUserToGroupFn;

  adminRemoveUserFromGroup = adminRemoveUserFromGroupFn;

  adminUpdateUserAttributes = adminUpdateUserAttributesFn;

  signUp = signUpFn;
}
