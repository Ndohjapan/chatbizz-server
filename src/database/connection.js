const config = require('config');
const mongoose = require('mongoose');
const Redis = require('ioredis');
require('dotenv').config();
const dbConfig = config.get('database');
const redisConfig = config.get('redis');
let cloudinary = require('cloudinary').v2;

async function connectToDatabase(DB_URL = dbConfig.URL) {
  try {
    await mongoose.connect(DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    // eslint-disable-next-line no-undef
    process.env.NODE_ENV != 'test'
      ? console.log('Connected to the database')
      : undefined;
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const redis = new Redis(redisConfig.URL);

module.exports = { connectToDatabase, mongoose, redis, cloudinary };
