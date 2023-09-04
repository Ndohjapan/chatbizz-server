const en = require('../../locale/en');
const { cloudinary } = require('../database/connection');
const ProductRepository = require('../database/repositories/product-repository');
const StoreRepository = require('../database/repositories/store-repository');
const VariantRepository = require('../database/repositories/variant-repository');
const createException = require('../errors/create-exception');
const notFoundException = require('../errors/not-found-exception');

class ProductService {
  constructor() {
    this.repository = new ProductRepository();
    this.storeRepository = new StoreRepository();
    this.variantRepository = new VariantRepository();
  }

  async CreateProduct(productData, user) {
    try {
      const { store } = productData;

      const storeExists = await this.storeRepository.FindStoreById({
        user,
        _id: store,
      });

      if (!storeExists) {
        throw new notFoundException(en['products-not-found']);
      }

      let variants = productData.variants;
      delete productData.variant;

      let product = await this.repository.CreateProduct(productData);

      const variantData = variants.map((variant) => {
        return { ...variant, product: product._id, image: variant.images[0]?.secure_url };
      });

      variants = await this.variantRepository.CreateVariant(variantData);

      variants = variants.map((variant) => {
        return {...variant.toObject(), image: variant.images[0]?.secure_url};
      });

      product = await this.repository.UpdateProductById(store, product._id, {
        variants
      });

      return product;
    } catch (error) {
      console.log(error);
      throw new createException(error.message);
    }
  }

  async FindAllProducts(store) {
    try {
      const products = await this.repository.FindAllProducts({ store });
      return products;
    } catch (error) {
      throw new notFoundException(en['products-not-found']);
    }
  }

  async FindProductById(store, id) {
    try {
      const product = await this.repository.FindProductById({ store, _id: id });
      return product;
    } catch (error) {
      throw new notFoundException(en['products-not-found']);
    }
  }

  async UpdateProduct(updateData, productId) {
    try {
      const { store } = updateData;

      const productExists = await this.repository.FindProductById({
        store,
        _id: productId,
      });

      if (!productExists) {
        throw new notFoundException(en['products-not-found']);
      }

      let product = await this.repository.UpdateProductById(store, productId, updateData);

      return product;
    } catch (error) {
      console.log(error);
      throw new createException(error.message);
    }
  }

  async GetProductImages(uid, store, nextCursor) {
    try {
      const images = await cloudinary.api.resources({
        type: 'upload',
        prefix: `chatbizz/users/${uid}/products/store_${store}`,
        max_results: 20,
        next_cursor: nextCursor
      });

      return images;
    } catch (error) {
      console.log(error);
      throw notFoundException(error.message);
    }
  }
}

module.exports = { ProductService };
