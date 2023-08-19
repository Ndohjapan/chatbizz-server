const en = require('../../locale/en');
const UserRepository = require('../database/repositories/user-repository');
const notFoundException = require('../errors/not-found-exception');

class UserService {
  constructor() {
    this.repository = new UserRepository();
  }

  async FindByUid(userData){
    try {
      const uid = userData.uid;
      const user = this.repository.FindByUid(uid);
      return user;
    } catch (error) {
      throw new notFoundException(en['user-not-found']);
    }
  }

}

module.exports = { UserService };
