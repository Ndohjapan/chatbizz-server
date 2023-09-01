const en = require('../../locale/en');
const StoreRepository = require('../database/repositories/store-repository');
const createException = require('../errors/create-exception');
const notFoundException = require('../errors/not-found-exception');

class StoreService {
  constructor() {
    this.repository = new StoreRepository();
  }

  async CreateStore(storeData, user) {
    try {
      const { name, whatsappNumber, about, storeType, image } = storeData;

      const storeExists = await this.repository.FindStoreByWANumber({
        whatsappNumber,
      });

      if (storeExists) {
        throw new Error(en['whatsapp-num-unique']);
      }

      const store = this.repository.CreateStore({
        name,
        whatsappNumber,
        about,
        storeType,
        user,
        image,
      });
      return store;
    } catch (error) {
      throw new notFoundException(error.message);
    }
  }

  async CreateQr(whatsappNumber, user) {
    const storeExists = await this.repository.FindStoreByWANumber({
      whatsappNumber,
    });    

    if (storeExists && storeExists.user == user) {
      if (!storeExists.whatsappConnected) {
        return true;
      }

      throw new createException(en['qr-store-already-connected']);
    }
    throw new createException(en['qr-store-error']);
  }

  async FindAllStores(user){
    try {
      const stores = await this.repository.FindAllStores({user});
      return stores;
    } catch (error) {
      throw new notFoundException(en['stores-not-found']);
    }
  }
}

module.exports = { StoreService };
