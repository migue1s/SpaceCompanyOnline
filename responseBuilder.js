export function success(body) {
  return buildResponse(200, body);
}

export function failure(body, code) {
  return buildResponse(code || 500, body);
}

function buildResponse(statusCode, body) {
  return {
    statusCode: statusCode,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true
    },
    body: JSON.stringify(body)
  };
}