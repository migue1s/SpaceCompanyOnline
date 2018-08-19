// import bcrypt from 'bcrypt';

export const register = async (event, context, callback) => {
  const payload = JSON.parse(event.body);

  // const hash = await bcrypt.hash(payload.password, 10);
  // console.log(hash);

  callback(null, payload);
};
