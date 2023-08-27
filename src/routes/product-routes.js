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
  '/',
  rateLimiter({ secondsWindow: 60, allowedHits: 10}),
  userAuth,
  catchAsync(async(req, res) => {
    const user = req.user._id;
    const stores = await service.FindAllStores(user);
    res.send(stores);
  }),
);

router.get(
  '/:id/store/:store',
  rateLimiter({ secondsWindow: 60, allowedHits: 10}),
  userAuth,
  catchAsync(async(req, res) => {
    const id = req.params.id;
    const store = req.params.id;
    const product = await service.FindProductById(store, id);
    res.send(product);
  }),
);

module.exports = router;
