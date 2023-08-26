const en = require('../../locale/en');
const ProductRepository = require('../database/repositories/product-repository');
const StoreRepository = require('../database/repositories/store-repository');
const createException = require('../errors/create-exception');
const notFoundException = require('../errors/not-found-exception');

class ProductService {
  constructor() {
    this.repository = new ProductRepository();
    this.storeRepository = new StoreRepository();
  }

  async CreateProduct(productData, user) {
    try {
      const { store } = productData;

      const storeExists = await this.storeRepository.FindStoreById({
        user,
        _id: store,
      });

      if (!storeExists) {
        throw new notFoundException(en['stores-not-found']);
      }

      const product = this.repository.CreateProduct(productData);
      return product;
    } catch (error) {
      console.log(error);
      throw new notFoundException(error.message);
    }
  }

  async FindAllStores(user) {
    try {
      const stores = await this.repository.FindAllStores({ user });
      return stores;
    } catch (error) {
      throw new notFoundException(en['stores-not-found']);
    }
  }
}

module.exports = { ProductService };
