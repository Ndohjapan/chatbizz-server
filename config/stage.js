/* eslint-disable no-undef */
require('dotenv').config();
module.exports = {
  database: {
    URL: process.env.DB_URL,
  },

  jwt: {
    secret: process.env.JWT_SECRET,
  },

  redis: {
    URL: process.env.REDISCLOUD_URL,
  },

  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET
  }

};
