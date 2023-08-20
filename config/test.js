/* eslint-disable no-undef */
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();
module.exports = {
  database: {
    URL: `mongodb://127.0.0.1:27017/test_${uuidv4()}`,
  },
  
  jwt: {
    secret: 'wofenwonewoinewoioewnoewiew'
  },

  redis: {
    URL: '127.0.0.1:6379',
  },

};
