const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catch-async');
const { rateLimiter } = require('../middlewares/rate-limiter');
const { userAuth } = require('../middlewares/protect');
const { VariantService } = require('../services/variant-services');

const service = new VariantService();

router.get(
  '/:variantId/products/:productId',
  rateLimiter({ secondsWindow: 60, allowedHits: 30 }),
  userAuth,
  catchAsync(async (req, res) => {
    const product = req.params.productId;
    const variantId = req.params.variantId;
    const variant = await service.FindProductById(product, variantId);
    res.send(variant);
  }),
);

module.exports = router;
