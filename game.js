import { success } from './utils/responseBuilder';
import { getUsername, getPayload } from './utils/eventParser';
import { call } from './utils/dynamoDB';

export async function save(event, context, callback) {
  const payload = getPayload(event);
  const username = getUsername(event);
  
  const params = {
    TableName: process.env.tableName,
    Key: { username },
    UpdateExpression: `SET #save = :save`,
    ExpressionAttributeNames: {
      '#save': 'save',
    },
    ExpressionAttributeValues: {
      ":save": payload.data,
    },
    ReturnValues: "ALL_NEW",
  };

  try {
    const result = await call("update", params);
    callback(null, success(result));
  } catch (e) {
    callback(null, failure(e));
  }
}