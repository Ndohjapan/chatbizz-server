const en = require('../../locale/en');
const AuthException = require('../errors/auth-exception');
const config = require('config');
const jwtConfig = config.get('jwt');
const jwt = require('jsonwebtoken');
const { UserService } = require('../services/user-services');
const user = new UserService();

const userAuth = async (req, res, next) => {
  try {
    const token = req.headers['x-access-token'];
    const decoded = jwt.verify(token, jwtConfig.secret);

    let result = await user.FindByUid(decoded);

    if (result) {
      req.user = result;
      return next();
    }

    return next(new AuthException(en['authentication-failure']));
  } catch (error) {
    return next(new AuthException(en['authentication-failure']));
  }
};

const socketAuth = async (socket, next) => {
  try {
    socket.handshake.headers['Access-Control-Allow-Origin'] = 'http://localhost:3000';
    const token = socket.handshake.headers.token;
    
    const decoded = jwt.verify(token, jwtConfig.secret);
    
    let result = await user.FindByUid(decoded);    

    if (result) {
      socket.user = result;
      next();
    } else {
      return next(new Error(en['authentication-failure']));
    }
  } catch (error) {
    return next(new Error(en['authentication-failure']));
  }
};

module.exports = { userAuth, socketAuth };
