const jwt = require('jsonwebtoken');

const handleAuthError = (req, res, next) => {
  res.status(401).json({ message: 'Необходима авторизация' });
}

const extractBearerToken = (header) => {
  return header.replace('Bearer ', '');
}

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return handleAuthError(res);
  }
  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, 'super-strong-secret');
  } catch (err) {
    return handleAuthError(res);
  }

  req.user = payload;

  next(); 
}
