const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catch-async');
const { rateLimiter } = require('../middlewares/rate-limiter');
const { StoreService } = require('../services/store-services');
const { userAuth } = require('../middlewares/protect');
const {
  validateCreateStoreInput, validateQRCodePhoneParams,
} = require('../middlewares/input-validator/store-validator');

const service = new StoreService();

router.post(
  '/',
  rateLimiter({ secondsWindow: 60, allowedHits: 5 }),
  userAuth,
  validateCreateStoreInput,
  catchAsync(async (req, res) => {
    const storeData = req.body;
    const user = req.user.id;
    const store = await service.CreateStore(storeData, user);
    res.send(store);
  }),
);

router.get(
  '/qr/:phone',
  rateLimiter({ secondsWindow: 60, allowedHits: 5 }),
  userAuth,
  validateQRCodePhoneParams,
  catchAsync(async(req, res) => {
    const whatsappNumber = req.params.phone;
    const user = req.user.id;
    const qrimage = await service.CreateQr(whatsappNumber, user);
    res.send(qrimage);
  })
);

module.exports = router;
