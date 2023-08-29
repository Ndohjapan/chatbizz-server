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
  '/images',
  rateLimiter({ secondsWindow: 60, allowedHits: 5 }),
  userAuth,
  catchAsync(async (req, res) => {
    const uid = req.user.uid;
    const images = await service.GetProductImages(uid);
    res.send(images);
  }),
);

module.exports = router;
