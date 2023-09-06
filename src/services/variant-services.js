const en = require('../../locale/en');
const ProductRepository = require('../database/repositories/product-repository');
const VariantRepository = require('../database/repositories/variant-repository');
const notFoundException = require('../errors/not-found-exception');

class VariantService {
  constructor() {
    this.repository = new VariantRepository();
    this.productRepository = new ProductRepository();
  }
  
  async CreateVariant(variantData) {
    try {
      const { store, product } = variantData;

      const productExists = await this.productRepository.FindProductById({store, _id: product});

      if (!productExists) {
        throw new notFoundException(en['products-not-found']);
      }

      const variant = await this.repository.CreateVariant(variantData);
      return variant;
    } catch (error) {
      throw new notFoundException(en['variants-not-found']);
    }
  }

  async FindVariantById(product, id) {
    try {
      const variant = await this.repository.FindVariantById({
        product,
        _id: id,
      });
      return variant;
    } catch (error) {
      throw new notFoundException(en['variants-not-found']);
    }
  }

  async UpdateVariantById(updateData, variantId) {
    try {
      const { product } = updateData;

      const variantExists = await this.repository.FindVariantById({
        product,
        _id: variantId,
      });

      if (!variantExists) {
        throw new notFoundException(en['variants-not-found']);
      }

      const variant = await this.repository.UpdateVariantById(
        product,
        variantId,
        updateData,
      );
      return variant;
    } catch (error) {
      throw new notFoundException(en['variants-not-found']);
    }
  }

  async DeleteVariantById(product, variantId) {
    try {

      const variantExists = await this.repository.FindVariantById({
        product,
        _id: variantId,
      });

      if (!variantExists) {
        throw new notFoundException(en['variants-not-found']);
      }

      await this.repository.DeleteVariantById(
        product,
        variantId
      );
      return {message: en['variant-deleted']};
    } catch (error) {
      throw new notFoundException(en['variants-not-found']);
    }
  }
}

module.exports = { VariantService };
