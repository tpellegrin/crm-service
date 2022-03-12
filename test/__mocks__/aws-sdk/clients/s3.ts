export const awsSdkPromiseResponse = jest.fn().mockReturnValue(Promise.resolve(true));

const putObjectFn = jest.fn().mockImplementation(() => ({ promise: awsSdkPromiseResponse }));

export class S3 {
  putObject = putObjectFn;
}
