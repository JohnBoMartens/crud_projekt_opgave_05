const jwt = require('jsonwebtoken');
const configuration = require('../config/configuration');

const verifyToken = (req, res, next) => {
  const tokenHeader = req.headers['authorization'];
  
  if (!tokenHeader) {
    
    return res.status(403).send({'code' : 403, 'message' : 'Ingen adgang uden token'});
  }
  try {

    const token = tokenHeader.split(' ')[1];
    const decoded = jwt.verify(token, configuration.secretKey);
    req.user = decoded;

  } catch (err) {
    return res.status(401).send({'code' : 401, 'message' : 'Ikke en valid Token'});
  }
  return next();
};

module.exports = verifyToken;