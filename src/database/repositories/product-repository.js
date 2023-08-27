const en = require('../../../locale/en');
const internalException = require('../../errors/internal-exception');
const notFoundException = require('../../errors/not-found-exception');
const { Products } = require('../models');

class ProductRepository {
  async CreateProduct(productData) {
    try {
      const product = await Products.create(productData);
      return product;
    } catch (error) {
      if (error.name === 'ValidationError') {
        throw new internalException(error.errors);
      }
      throw new internalException(en['product-id-unique']);
    }
  }

  async FindAllProducts({ store }) {
    try {
      const products = await Products.find(
        { store, active: true },
        { active: 0 },
      ).lean();
      return products;
    } catch (error) {
      throw new notFoundException(en['products-not-found']);
    }
  }

  async FindProductById({ store, _id }) {
    try {
      const product = await Products.findOne({
        store,
        _id,
        active: true,
      }).lean();
      if (product) {
        return product;
      }
      throw new notFoundException(en['products-not-found']);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async UpdateProductById(store, _id, updateData) {
    try {
      const variant = await Products.findOneAndUpdate(
        { store, _id, active: true },
        updateData,
        { new: true },
      ).lean();
      return variant;
    } catch (error) {
      throw internalException(en['product-update-failure']);
    }
  }
}

module.exports = ProductRepository;
