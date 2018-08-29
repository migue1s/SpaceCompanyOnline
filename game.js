import { success } from './utils/responseBuilder';
import { getUsername, getPayload } from './utils/eventParser';
import { call } from './utils/dynamoDB';

export async function save(event, context, callback) {
  const payload = getPayload(event);
  const username = getUsername(event);
  
  const params = {
    TableName: process.env.tableName,
    Key: { username },
    UpdateExpression: `SET #save = :save, #savedAt = :savedAt`,
    ExpressionAttributeNames: {
      '#save': 'save',
      '#savedAt': 'savedAt',
    },
    ExpressionAttributeValues: {
      ":save": payload.data,
      ":savedAt": Date.now(),
    },
    ReturnValues: "ALL_NEW",
  };

  try {
    const result = await call("update", params);
    const item = result.Attributes;
    callback(null, success({
      savedAt: item.savedAt,
    }));
  } catch (e) {
    callback(null, failure(e));
  }
}

export async function load(event, context, callback) {
  const username = getUsername(event);
  const params = {
    TableName: process.env.tableName,
    Key: { username },
  };

  try {
    const result = await call("get", params);
    const item = result.Item;

    callback(null, success({
      save: item.save,
      savedAt: item.savedAt,
    }));
  } catch (e) {
    callback(null, failure(e, 400));
  }
}