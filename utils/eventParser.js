export function getPayload(event) {
  return JSON.parse(event.body);
}

export function getUsername(event) {
  return event.requestContext.authorizer.username;
}
