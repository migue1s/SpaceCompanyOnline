import bcryptjs from 'bcryptjs';
import { call } from './dynamoDB';
import { success, failure } from './responseBuilder';

export async function create(event, context, callback) {
  const data = JSON.parse(event.body);
  const salt = await bcryptjs.genSalt();
  const hash = await bcryptjs.hash(data.password, salt);
  const params = {
    TableName: process.env.tableName,
    Item: {
      username: data.username,
      password: hash,
      passwordSalt: salt,
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
        code: 409,
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
    if (await bcryptjs.compare(data.password, user.password)) {
      const token = jwt.sign({ username: user.username }, 'supersecret', { expiresIn: '15m' });
    
      callback(null, success({ token }));
    } else {
      callback(null, failure({ message: 'Invalid password.' }));
    }
  } catch (e) {
    callback(null, failure(e));
  }
}
