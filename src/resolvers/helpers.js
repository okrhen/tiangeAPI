const {
    AuthenticationError
  } = require('apollo-server-lambda');
  const jwt = require('jsonwebtoken');


const getUser = async auth => {
    if (!auth) throw new AuthenticationError('you must be logged in!');
  
    const token = auth.split('Bearer ')[1];
    if (!token) throw new AuthenticationError('you should provide a token!');
  
    const user = await jwt.verify(token, process.env.TIANGE_SECRET_KEY, (err, decoded) => {
      if (err) throw new AuthenticationError('invalid token!');

      return decoded;
    });
    return user;
  };


const getToken = ({ id, username, email }) =>
jwt.sign(
  {
    id,
    username,
    email
  },
  SECRET,
  { expiresIn: '1d' }
);

module.exports = {
    getUser,
    getToken
}

