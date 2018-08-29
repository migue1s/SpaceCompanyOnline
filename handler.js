export const hello = (event, context, callback) => {
  const p = new Promise((resolve) => {
    resolve('success');
  });
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Go Serverless!'
    }),
  };
  p
    .then(() => callback(null, response))
    .catch(e => callback(e));
};