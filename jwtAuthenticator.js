import jwt from 'jsonwebtoken';
import policyBuilder from './utils/policyBuilder';
import config from './config';

export async function jwtAuthorizer(event, context, callback) {

  const token = event.authorizationToken;

  try {
    const decoded = await jwt.verify(token, config.jwtSecret);
    const username = decoded.username;

    const authorizerContext = { username };
    // Return an IAM policy document for the current endpoint
    const policyDocument = policyBuilder(username, 'Allow', event.methodArn, authorizerContext);

    callback(null, policyDocument);
  } catch (e) {
    callback(event); // Return a 401 Unauthorized response
  }
}