const jwt = require('jsonwebtoken');
const AuthError = require('../errors/AuthError'); // 401

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new AuthError('необходима регистрация'));
  }
  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'super-strong-secret');
  } catch (err) {
    throw new AuthError('необходима авторизация');
  }

  req.user = payload;
  next();
};
