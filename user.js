import { call } from './dynamoDB';
import { success, failure } from './responseBuilder';

export async function create(event, context, callback) {
  const data = JSON.parse(event.body);
  const params = {
    TableName: process.env.tableName,
    Item: {
      username: data.username,
      password: data.password,
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
    callback(null, failure(e));
  }
}