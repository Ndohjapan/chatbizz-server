const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catch-async');
const { rateLimiter } = require('../middlewares/rate-limiter');
const { StoreService } = require('../services/store-services');
const { userAuth } = require('../middlewares/protect');
const {
  validateCreateStoreInput,
  validateQRCodePhoneParams,
} = require('../middlewares/input-validator/store-validator');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');
const path = require('path');
const fs = require('fs');
const StoreRepository = require('../database/repositories/store-repository');

const service = new StoreService();
const repository = new StoreRepository();

router.post(
  '/',
  rateLimiter({ secondsWindow: 60, allowedHits: 30 }),
  userAuth,
  validateCreateStoreInput,
  catchAsync(async (req, res) => {
    const storeData = req.body;
    const user = req.user._id;
    const store = await service.CreateStore(storeData, user);
    res.send(store);
  }),
);

router.get(
  '/qr/:phone',
  rateLimiter({ secondsWindow: 60, allowedHits: 5 }),
  userAuth,
  validateQRCodePhoneParams,
  catchAsync(async (req, res) => {
    let whatsappNumber = req.params.phone;
    const user = req.user._id.toString();
    const socket = req.app.get('socket');
    await service.CreateQr(whatsappNumber, user);
    res.send(true);
    whatsappNumber = whatsappNumber.split('+')[1];
    const client = new Client({
      puppeteer: {
        headless: true
      },
      authStrategy: new LocalAuth({
        clientId: whatsappNumber,
      }),
    });

    console.log('Whatsapp client enabled');

    client.on('qr', (qr) => {
      qrcode.toDataURL(qr, (err, url) => {
        if (err) {
          console.log('Error generating QR code:', err);
        } else {
          console.log('QR code is ready');
          socket?.io.emit(`+${whatsappNumber}-qr-code`, url);
        }
      });
    });

    client.on('authenticated', async () => {
      await repository.updateStoreByWANumber('+' + whatsappNumber, {
        whatsappConnected: true,
      });
      console.log(`User with session ID ${whatsappNumber} authenticated`);
      socket?.io.emit(`+${whatsappNumber}`, 'Authenticated successfully');
    });

    client.on('auth_failure', async () => {
      console.log(`Authentication failed for : ${whatsappNumber}`);
      socket?.io.emit(`+${whatsappNumber}-error`, 'Authenticated Failed');
    });

    client.on('ready', () => {
      console.log(`User with session ID ${whatsappNumber} is ready 🚀`);
    });

    client.on('message', async (message) => {
      if (message.from != 'status@broadcast' && !message.id.participant) {
        console.log(message.from);
        console.log(message.body);
        console.log(message.deviceType);
        console.log(message._data.notifyName);
        const quotedMessage = message.quoted && message.quoted.body;
        const reply = `Welcome to my WhatsApp bot${
          quotedMessage ? `: ${quotedMessage}` : ''
        }`;

        message.reply(reply);
      } else {
        ('From this side');
      }
    });

    client.on('disconnected', async (reason) => {
      console.log('Client was logged out', reason);
      await repository.updateStoreByWANumber('+' + whatsappNumber, {
        whatsappConnected: false,
      });

      const cacheFolderPath = path.join(
        __dirname,
        '..',
        '..',
        '.wwebjs_auth',
        `session-${whatsappNumber}`,
      );
      try {
        await client.destroy();
        await fs.promises.rm(cacheFolderPath, { recursive: true });
        console.log(
          `Cleared cached session data for session ID: ${whatsappNumber}`,
        );
      } catch (error) {
        console.error('Error clearing cached session data:', error);
      }
    });

    client.initialize();
  }),
);

router.get(
  '/',
  rateLimiter({ secondsWindow: 60, allowedHits: 20}),
  userAuth,
  catchAsync(async(req, res) => {
    const user = req.user._id;
    const stores = await service.FindAllStores(user);
    res.send(stores);
  }),
);

module.exports = router;
