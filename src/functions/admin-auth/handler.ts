import middyfy from '@libs/lambda';
import { promisify } from '@common/util';

const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

const { AWS_REGION, USER_POOL_ID } = process.env;

const client = jwksClient({
  cache: true,
  cacheMaxAge: 86400000,
  rateLimit: true,
  jwksRequestsPerMinute: 10,
  strictSsl: true,
  jwksUri: `https://cognito-idp.${AWS_REGION}.amazonaws.com/${USER_POOL_ID}/.well-known/jwks.json`
});

const deny = {
  principalId: 'user',
  policyDocument: {
    Version: '2012-10-17',
    Statement: [
      {
        Action: 'execute-api:Invoke',
        Effect: 'Deny',
        Resource: '*'
      }
    ]
  }
};

const allow = {
  principalId: 'user',
  policyDocument: {
    Version: '2012-10-17',
    Statement: [
      {
        Action: 'execute-api:Invoke',
        Effect: 'Allow',
        Resource: '*'
      }
    ]
  }
};

const getKey = (header: any, callback: Function) => {
  client.getSigningKey(header.kid, (_err, key) => {
    const signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
};

const getToken = (e) => {
  if (e.authorizationToken && e.authorizationToken.split(' ')[0] === 'Bearer') {
    return e.authorizationToken.split(' ')[1];
  }
  return e.authorizationToken;
};

const validateToken = promisify((token: string, callback: Function) => {
  jwt.verify(token, getKey, (error, decoded) => {
    if (error) {
      callback(null, false);
    } else {
      callback(null, decoded);
    }
  });
});

const handler = async (event) => {
  try {
    const token = getToken(event) || '';
    const payload = await validateToken(token);

    if (!payload) {
      return deny;
    }

    const groups: [] = payload['cognito:groups'];

    if (groups && groups.find((el) => el === 'admin')) {
      return allow;
    }

    return deny;
  } catch (Error) {
    return deny;
  }
};

export const main = middyfy(handler);
