const en = require('../../../locale/en');
const internalException = require('../../errors/internal-exception');
const notFoundException = require('../../errors/not-found-exception');
const { Users } = require('../models');

class UserRepository {
  async CreateUser({ uid }) {
    try {
      const user = await Users.findOneAndUpdate(
        { uid },
        { uid },
        { upsert: true, new: true },
      ).lean();
      return user;
    } catch (error) {
      if (error.name === 'ValidationError') {
        throw new internalException(error.errors);
      }
      throw new internalException(en['uid-unique']);
    }
  }

  async FindByUid(uid) {
    try {
      const user = await Users.findOne({ uid }).lean();
      if(user){
        return user;
      }
      throw new notFoundException(en['user-not-found']);
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = UserRepository;
