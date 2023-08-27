const { Users, Stores } = require('../../src/database/models');
const { app } = require('../../src/app');
const config = require('config');
const jwtConfig = config.get('jwt');
const jwt = require('jsonwebtoken');

let uid = 'yey1TL3ztHcVBHiDjqEqhIzkrZ13';

let token;

const userLogin = async () => {
  const user = await Users.findOneAndUpdate({ uid }, { uid }, { upsert: true, new: true });
  const secretKey = jwtConfig.secret;
  token = jwt.sign({ uid }, secretKey, { expiresIn: '1d' });

  return {token, user};
};

const createStores = async (user, num = 2) => {
  let stores = [];
  for (let i = 0; i < num; i++) {
    stores.push({
      'name': 'South LA',
      user,
      'storeType': 'Ecommerce',
      'about': 'We will be there no matter what',
      'whatsappNumber': `+234905614405${i}`,
      'image':'https://res.cloudinary.com/lcu-feeding/image/upload/v1690544099/chatbizz/resources/Screenshot_2023-07-28_121758_hzjmmf.png'
    });
  }

  stores = await Stores.create(stores);
  return stores;
};

module.exports = { userLogin, createStores };
