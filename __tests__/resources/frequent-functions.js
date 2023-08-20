const { Users } = require('../../src/database/models');
const { app } = require('../../src/app');
const config = require('config');
const jwtConfig = config.get('jwt');
const jwt = require('jsonwebtoken');

let uid = 'yey1TL3ztHcVBHiDjqEqhIzkrZ13';

let token;

const userLogin = async () => {
  await Users.findOneAndUpdate({ uid }, {uid}, {upsert: true, new: true});
  const secretKey = jwtConfig.secret;
  token = jwt.sign({ uid }, secretKey, { expiresIn: '1d' });

  return token;
};

module.exports = {userLogin};
