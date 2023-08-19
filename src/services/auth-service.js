let admin = require('firebase-admin');
const config = require('config');
const jwtConfig = config.get('jwt');
const jwt = require('jsonwebtoken');

let serviceAccount = require('../../serviceAccount.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

class AuthService {
  constructor() {

  }

  async Login(idToken){
    const decoded = await admin.auth().verifyIdToken(idToken);
    const secretKey = jwtConfig.secret;
    const token = jwt.sign({ email: decoded.email, uid: decoded.uid, name: decoded.name }, secretKey, { expiresIn: '1d' });
    return {token};
  }

}

module.exports = { AuthService };
