import AWS from "aws-sdk";

AWS.config.update({ region: "us-east-1" });
const dynamoDb = new AWS.DynamoDB.DocumentClient();

export function call(action, params) {
  return dynamoDb[action](params).promise();
}
