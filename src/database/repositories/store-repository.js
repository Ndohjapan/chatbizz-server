const en = require('../../../locale/en');
const internalException = require('../../errors/internal-exception');
const notFoundException = require('../../errors/not-found-exception');
const { Stores } = require('../models');

class StoreRepository {
  async CreateStore({ name, whatsappNumber, storeType, user, about, image }) {
    try {
      const store = await Stores.create({
        name,
        whatsappNumber,
        storeType,
        user,
        about,
        image
      });
      store.whatsappConnected = undefined;
      return store;
    } catch (error) {
      if (error.name === 'ValidationError') {
        throw new internalException(error.errors);
      }
      throw new internalException(en['whatsapp-num-unique']);
    }
  }

  async FindAllStores({ user }) {
    try {
      const stores = await Stores.find({ user, active: true }, {active: 0}).lean();
      return stores;
    } catch (error) {
      throw new notFoundException(en['stores-not-found']);
    }
  }

  async FindStoreById({ user, _id }) {
    try {
      const store = await Stores.findOne({ user, _id, active: true }).lean();
      if (store) {
        return store;
      }
      throw new notFoundException(en['stores-not-found']);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async FindStoreByWANumber({ whatsappNumber }) {
    try {
      const store = await Stores.findOne({ whatsappNumber, active: true }).lean();
      return store;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updateStoreByWANumber(whatsappNumber, updateData) {
    try {
      const store = await Stores.findOneAndUpdate({ whatsappNumber }, {$set: updateData}, {new: true}).lean();
      return store;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = StoreRepository;
