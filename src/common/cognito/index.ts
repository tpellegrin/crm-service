import { CognitoIdentityServiceProvider } from 'aws-sdk';
import generator from 'generate-password';

const { COGNITO_POOL_CLIENT_ID, USER_POOL_ID } = process.env;

const service = new CognitoIdentityServiceProvider();

const cognito = {
  async signUp(email: string): Promise<{ password: string }> {
    const params: CognitoIdentityServiceProvider.Types.SignUpRequest = {
      ClientId: COGNITO_POOL_CLIENT_ID,
      Username: email,
      Password: generator.generate({
        length: 12,
        numbers: true,
        uppercase: true,
        symbols: true,
        strict: true
      })
    };
    await service.signUp(params).promise();
    return { password: params.Password };
  },
  async updateEmail(email: string, newEmail: string): Promise<void> {
    const params: CognitoIdentityServiceProvider.AdminUpdateUserAttributesRequest =
      {
        UserPoolId: USER_POOL_ID,
        Username: email,
        UserAttributes: [
          {
            Name: 'email',
            Value: newEmail
          },
          {
            Name: 'email_verified',
            Value: 'false'
          }
        ]
      };
    await service.adminUpdateUserAttributes(params).promise();
  },
  async grantAdmin(email: string): Promise<void> {
    await service
      .adminAddUserToGroup({
        GroupName: 'admin',
        UserPoolId: USER_POOL_ID,
        Username: email
      })
      .promise();
  },
  async revokeAdmin(email: string): Promise<void> {
    await service
      .adminRemoveUserFromGroup({
        GroupName: 'admin',
        UserPoolId: USER_POOL_ID,
        Username: email
      })
      .promise();
  }
};

export default cognito;
