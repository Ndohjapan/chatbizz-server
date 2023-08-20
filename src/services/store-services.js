const en = require('../../locale/en');
const StoreRepository = require('../database/repositories/store-repository');
const createException = require('../errors/create-exception');
const notFoundException = require('../errors/not-found-exception');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');
const path = require('path');
const fs = require('fs');

class StoreService {
  constructor() {
    this.repository = new StoreRepository();
  }

  async CreateStore(storeData, user) {
    try {
      const { name, whatsappNumber, about, storeType } = storeData;

      const storeExists = await this.repository.FindStoreByWANumber({
        whatsappNumber,
      });

      if (storeExists) {
        throw new Error(en['whatsapp-num-unique']);
      }

      const store = this.repository.CreateStore({
        name,
        whatsappNumber,
        about,
        storeType,
        user,
      });
      return store;
    } catch (error) {
      throw new notFoundException(error.message);
    }
  }

  async CreateQr(whatsappNumber, user) {
    const storeExists = await this.repository.FindStoreByWANumber({
      whatsappNumber,
    });

    if (storeExists && storeExists.user == user) {
      if (!storeExists.whatsappConnected) {
        try {
          const qrImage = await this.#WAClient(whatsappNumber.split('+')[1]);
          return qrImage;
        } catch (error) {
          throw new createException(error.message);
        }
      }

      throw new createException(en['qr-store-already-connected']);
    }
    throw new createException(en['qr-store-error']);
  }

  async #WAClient(whatsappNumber) {
    console.log(whatsappNumber);
    return new Promise((resolve, reject) => {
      const client = new Client({
        puppeteer: {
          headless: true,
        },
        authStrategy: new LocalAuth({
          clientId: whatsappNumber,
        }),
      });

      client.on('qr', (qr) => {
        qrcode.toDataURL(qr, (err, url) => {
          if (err) {
            console.error('Error generating QR code:', err);
            reject(en['server-error']);
          } else {
            resolve({ qrCodeUrl: url });
          }
        });
      });

      client.on('authenticated', async () => {
        const sessionId = whatsappNumber;
        this.repository.updateStoreByWANumber(whatsappNumber, {
          whatsappConnected: true,
        });
        console.log(`User with session ID ${sessionId} authenticated`);
        //   io.emit(`${sessionId}`, 'Authenticated successfully');
      });

      client.on('ready', () => {
        const sessionId = whatsappNumber;
        console.log(`User with session ID ${sessionId} is ready 🚀`);
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
        const sessionId = whatsappNumber;
        this.repository.updateStoreByWANumber(whatsappNumber, {
          whatsappConnected: false,
        });

        const cacheFolderPath = path.join(
          __dirname,
          '.wwebjs_auth',
          `session-${sessionId}`,
        );
        try {
          await client.destroy();
          await fs.promises.rm(cacheFolderPath, { recursive: true });
          console.log(
            `Cleared cached session data for session ID: ${sessionId}`,
          );
        } catch (error) {
          console.error('Error clearing cached session data:', error);
        }
      });

      client.initialize();
    });
  }
}

module.exports = { StoreService };
