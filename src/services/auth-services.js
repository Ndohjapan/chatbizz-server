let admin = require('firebase-admin');
const config = require('config');
const jwtConfig = config.get('jwt');
const jwt = require('jsonwebtoken');
const UserRepository = require('../database/repositories/user-repository');

let serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

class AuthService {
  constructor() {
    this.repository = new UserRepository();
  }

  async Login(idToken){
    const decoded = await admin.auth().verifyIdToken(idToken);
    const secretKey = jwtConfig.secret;
    await this.repository.CreateUser({uid: decoded.uid});
    const token = jwt.sign({ uid: decoded.uid }, secretKey, { expiresIn: '1d' });
    return {token};
  }

}

module.exports = { AuthService };
