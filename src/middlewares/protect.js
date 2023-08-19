const en = require('../../locale/en');
const AuthException = require('../errors/auth-exception');
const config = require('config');
const jwtConfig = config.get('jwt');
const jwt = require('jsonwebtoken');
const { UserService } = require('../services/user-services');


const userAuth = async (req, res, next) => {
  const user = new UserService();

  try {
    const token = req.headers['x-access-token'];
    const decoded = jwt.verify(token, jwtConfig.secret);

    let result = await user.FindByEmail(decoded.uid);

    if (result) {
      req.user = result;
      return next();
    }

    return next(new AuthException(en['authentication-failure']));
  } catch (error) {
    return next(new AuthException(en['authentication-failure']));
  }
};

module.exports = { userAuth };
