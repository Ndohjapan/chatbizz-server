const en = require('../../locale/en');
const VariantRepository = require('../database/repositories/variant-repository');
const notFoundException = require('../errors/not-found-exception');

class VariantService {
  constructor() {
    this.repository = new VariantRepository();
  }

  async FindProductById(product, id) {
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
}

module.exports = { VariantService };
