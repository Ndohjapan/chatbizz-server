const en = require('../../locale/en');
const StoreRepository = require('../database/repositories/store-repository');
const notFoundException = require('../errors/not-found-exception');

class StoreService {
  constructor() {
    this.repository = new StoreRepository();
  }

  async CreateStore(storeData, user){
    try {
      const {name, whatsappNumber, about, storeType} = storeData;

      const storeExists = await this.repository.FindStoreByWANumber({whatsappNumber});

      if(storeExists){
        throw new Error(en['whatsapp-num-unique']);
      }

      const store = this.repository.CreateStore({name, whatsappNumber, about, storeType, user});
      return store;
    } catch (error) {
      throw new notFoundException(error.message);
    }
  }

}

module.exports = { StoreService };
