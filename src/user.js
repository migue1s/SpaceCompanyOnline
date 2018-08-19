import bcrypt from 'bcrypt';

export const register = async (event, context, callback) => {
  const body = JSON.parse(event.body);

  const hash = await bcrypt.hash(body.password, 10);
  const user = {
    username: body.username,
    password: hash,
  };

  const response = {
    statusCode: 200,
    body: JSON.stringify(user),
  };

  callback(null, response);
};

export const login = async (event, context, callback) => {
  const body = JSON.parse(event.body);
  const didAuthorize = await bcrypt.compare(body.password, "$2b$10$/KKxG72w0GMu/wHAGn/Iuea8BBM2wBJEQxgqiiYqZhv0XtWFglYku");

  const response = {
    statusCode: 200,
    body: JSON.stringify({ didAuthorize }),
  };

  callback(null, response);
};
