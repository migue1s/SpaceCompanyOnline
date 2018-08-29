import bcryptjs from 'bcryptjs';
import { call } from './utils/dynamoDB';
import { success, failure } from './utils/responseBuilder';
import jwt from 'jsonwebtoken';
import config from './config';

export async function create(event, context, callback) {
  const data = JSON.parse(event.body);
  const salt = await bcryptjs.genSalt();
  const hash = await bcryptjs.hash(data.password, salt);
  const params = {
    TableName: process.env.tableName,
    Item: {
      username: data.username,
      password: hash,
      createdAt: Date.now()
    },
    ConditionExpression: 'username <> :username',
    ExpressionAttributeValues: {
      ":username": data.username,
    }
  };

  try {
    await call("put", params);
    callback(null, success(params.Item));
  } catch (e) {
    if (e.code === 'ConditionalCheckFailedException') {
      callback(null, failure({
        message: 'Username already in use',
      }, 409));
    } else {
      callback(null, failure(e));
    }
  }
}

export async function login(event, context, callback) {
  const data = JSON.parse(event.body);
  const params = {
    TableName: process.env.tableName,
    Key: {
      username: data.username,
    },
  };
  try {
    const result = await call("get", params);
    const user = result.Item;
    const loggedIn = await bcryptjs.compare(data.password, user.password);
    if (loggedIn) {
      const token = jwt.sign(
        { username: user.username },
        config.jwtSecret,
      );
    
      callback(null, success({ token }));
    } else {
      callback(null, failure({ message: 'Invalid username or password.' }, 400));
    }
    } catch (e) {
    callback(null, failure({ message: 'Invalid username or password.', e }, 400));
  }
}
