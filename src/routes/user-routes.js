const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catch-async');
const { rateLimiter } = require('../middlewares/rate-limiter');
const { UserService } = require('../services/user-services');
const { userAuth } = require('../middlewares/protect');

const service = new UserService();

router.get(
  '/',
  rateLimiter({ secondsWindow: 60, allowedHits: 10 }),
  userAuth,
  catchAsync(async (req, res) => {
    const userData = req.user;
    const user = await service.FindByUid(userData);
    res.send(user);
  }),
);

module.exports = router;