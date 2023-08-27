const request = require('supertest');
const { app } = require('../src/app');
require('./resources/setup');
const en = require('../locale/en');
const { userLogin, createStores } = require('./resources/frequent-functions');

let token;

const createProduct = async(product) => {
  let agent = request(app).post('api/1.0/products');
    
  if(token){
    agent.set('x-access-token', `${token}`);
  }

  return await agent.send(product);
};