const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catch-async');
const { rateLimiter } = require('../middlewares/rate-limiter');
const { userAuth } = require('../middlewares/protect');
const { VariantService } = require('../services/variant-services');
const {
  validateUpdateVariantInput, validateCreateVariantInput,
} = require('../middlewares/input-validator/variant-validator');

const service = new VariantService();

router.post(
  '/',
  rateLimiter({ secondsWindow: 60, allowedHits: 30 }),
  userAuth,
  validateCreateVariantInput,
  catchAsync(async (req, res) => {
    const variantData = req.body;
    const variant = await service.CreateVariant(variantData);
    res.send(variant);
  }),
);

router.get(
  '/:variantId/products/:productId',
  rateLimiter({ secondsWindow: 60, allowedHits: 30 }),
  userAuth,
  catchAsync(async (req, res) => {
    const product = req.params.productId;
    const variantId = req.params.variantId;
    const variant = await service.FindVariantById(product, variantId);
    res.send(variant);
  }),
);

router.put(
  '/:variantId',
  rateLimiter({ secondsWindow: 60, allowedHits: 30 }),
  userAuth,
  validateUpdateVariantInput,
  catchAsync(async (req, res) => {
    const variantId = req.params.variantId;
    const updateData = req.body;
    const variant = await service.UpdateVariantById(updateData, variantId);
    res.send(variant);
  }),
);

router.delete(
  '/:variantId/products/:productId',
  rateLimiter({ secondsWindow: 60, allowedHits: 30 }),
  userAuth,
  catchAsync(async (req, res) => {
    const variantId = req.params.variantId;
    const productId = req.params.productId;
    const variant = await service.DeleteVariantById(productId, variantId);
    res.send(variant);
  }),
);

module.exports = router;
