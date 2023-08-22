const en = require('../../locale/en');
const StoreRepository = require('../database/repositories/store-repository');
const createException = require('../errors/create-exception');
const notFoundException = require('../errors/not-found-exception');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');
const path = require('path');
const fs = require('fs');

class StoreService {
  constructor() {
    this.repository = new StoreRepository();
  }

  async CreateStore(storeData, user) {
    try {
      const { name, whatsappNumber, about, storeType } = storeData;

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
}

module.exports = { StoreService };
