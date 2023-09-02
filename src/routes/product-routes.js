const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catch-async');
const { rateLimiter } = require('../middlewares/rate-limiter');
const { ProductService } = require('../services/product-services');
const { userAuth } = require('../middlewares/protect');
const { validateCreateProductInput } = require('../middlewares/input-validator/product-validator');

const service = new ProductService();

router.post(
  '/',
  rateLimiter({ secondsWindow: 60, allowedHits: 5 }),
  userAuth,
  validateCreateProductInput,
  catchAsync(async (req, res) => {
    const productData = req.body;
    const user = req.user._id;
    const product = await service.CreateProduct(productData, user);
    res.send(product);
  }),
);

router.get(
  '/:productId/store/:storeId',
  rateLimiter({ secondsWindow: 60, allowedHits: 30 }),
  userAuth,
  catchAsync(async (req, res) => {
    const store = req.params.storeId;
    const productId = req.params.productId;
    const product = await service.FindProductById(store, productId);
    res.send(product);
  }),
);

router.get(
  '/store/:storeId',
  rateLimiter({ secondsWindow: 60, allowedHits: 30 }),
  userAuth,
  catchAsync(async (req, res) => {
    const store = req.params.storeId;
    const products = await service.FindAllProducts(store);
    res.send(products);
  }),
);

router.get(
  '/store/:storeId/images',
  rateLimiter({ secondsWindow: 60, allowedHits: 30 }),
  userAuth,
  catchAsync(async (req, res) => {
    const uid = req.user.uid;
    const store = req.params.storeId;
    const nextCursor = req.query.next_cursor;
    const images = await service.GetProductImages(uid, store, nextCursor);
    res.send(images);
  }),
);

module.exports = router;
