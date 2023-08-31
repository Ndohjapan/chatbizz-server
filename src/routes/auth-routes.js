const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catch-async');
const { rateLimiter } = require('../middlewares/rate-limiter');
const { AuthService } = require('../services/auth-services');

const service = new AuthService();

router.post(
  '/login',
  rateLimiter({ secondsWindow: 60, allowedHits: 10 }),
  catchAsync(async (req, res) => {
    const data = req.body;
    const user = await service.Login(data.token);
    res.send(user);
  }),
);

module.exports = router;