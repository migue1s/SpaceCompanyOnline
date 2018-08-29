export function success(body, code = 200) {
  return buildResponse(code, body);
}

export function failure(body, code = 500) {
  return buildResponse(code, body);
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