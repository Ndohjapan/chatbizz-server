const en = require('../../../locale/en');
const internalException = require('../../errors/internal-exception');
const notFoundException = require('../../errors/not-found-exception');
const { Variants } = require('../models');

class VariantRepository {
  async CreateVariant(variantData) {
    try {
      const variant = await Variants.create(variantData);
      return variant;
    } catch (error) {
      if (error.name === 'ValidationError') {
        throw new internalException(error.errors);
      }
      throw new internalException(en['variant-id-unique']);
    }
  }

  async FindAllVariants({ product }) {
    try {
      const variants = await Variants.find(
        { product, active: true },
        { active: 0 },
      ).lean();
      return variants;
    } catch (error) {
      throw new notFoundException(en['variants-not-found']);
    }
  }

  async FindVariantById({ product, _id }) {
    try {
      const variant = await Variants.findOne({
        product,
        _id,
        active: true,
      }).lean();

      if (variant) {
        return variant;
      }
      throw new notFoundException(en['variants-not-found']);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async UpdateVariantById(product, _id, updateData) {
    try {
      const variant = await Variants.findOneAndUpdate(
        { product, _id, active: true },
        updateData,
        { new: true },
      ).lean();
      return variant;
    } catch (error) {
      throw internalException(en['variants-update-failure']);
    }
  }

  async DeleteVariantById(product, _id) {
    try {
      await Variants.findOneAndUpdate(
        { product, _id, active: true },
        {$set: {active: false}},
        { new: true },
      ).lean();
      return true;
    } catch (error) {
      throw internalException(en['variants-update-failure']);
    }
  }

}

module.exports = VariantRepository;
