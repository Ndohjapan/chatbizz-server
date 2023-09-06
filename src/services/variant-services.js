const en = require('../../locale/en');
const VariantRepository = require('../database/repositories/variant-repository');
const notFoundException = require('../errors/not-found-exception');

class VariantService {
  constructor() {
    this.repository = new VariantRepository();
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
}

module.exports = { VariantService };
