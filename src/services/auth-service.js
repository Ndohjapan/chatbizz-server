let admin = require('firebase-admin');

let serviceAccount = require('../../serviceAccount.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

class AuthService {
  constructor() {

  }

  SignUp(token){
    admin.auth().verifyIdToken(token).then(decodedToken => {
      let uid = decodedToken.uid;
    }).catch(err => {
      console.log(err);
    });
  }

}

module.exports = { AuthService };
