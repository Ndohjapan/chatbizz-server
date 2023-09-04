const request = require('supertest');
const { app } = require('../src/app');
require('./resources/setup');
const en = require('../locale/en');
const { userLogin, createStores } = require('./resources/frequent-functions');
const mockdata = require('./resources/mockdata');
const { Products, Variants } = require('../src/database/models');

let token;

const createProduct = async (product = mockdata.product1) => {
  let agent = request(app).post('/api/1.0/products');

  if (token) {
    agent.set('x-access-token', `${token}`);
  }

  return await agent.send(product);
};

describe('Create Product', () => {
  it('return - 200 ok when product is created', async () => {
    const auth = await userLogin();
    token = auth.token;

    const store = await createStores(auth.user._id, 1);

    const response = await createProduct({
      ...mockdata.product1,
      store: store[0]._id,
    });

    expect(response.status).toBe(200);
  });

  it('return - product data when product is created', async () => {
    const auth = await userLogin();
    token = auth.token;

    const store = await createStores(auth.user._id, 1);

    const response = await createProduct({
      ...mockdata.product1,
      store: store[0]._id,
    });

    const productDb = await Products.find({});

    const variantsDb = await Variants.find({});

    expect(response.body.name).toBe(mockdata.product1.name);
    expect(response.body.variants[0].image).toBe(mockdata.product1.variants[0].images[0].secure_url);
  });

  it('return - HTTP 200 OK when we pass an empty weight for a variant ', async() => {
    const auth = await userLogin();
    token = auth.token;

    const store = await createStores(auth.user._id, 1);

    const response = await createProduct({
      ...mockdata.product1,
      store: store[0]._id,
      variants: [{...mockdata.product1.variants[0], weight: undefined}]
    });

    expect(response.status).toBe(200);
  });

  it('check - ensure the variants id are actually created and stored ', async() => {
    const auth = await userLogin();
    token = auth.token;

    const store = await createStores(auth.user._id, 1);

    const response = await createProduct({
      ...mockdata.product1,
      store: store[0]._id,
      variants: [{...mockdata.product1.variants[0], weight: undefined}]
    });

    const variantInDb = await Variants.find({});

    expect(response.body.variants[0]._id).toBe(variantInDb[0]._id.toString());
  });

  it('return - HTTP 400 when we pass an empty stock in a variant', async() => {
    const auth = await userLogin();
    token = auth.token;

    const store = await createStores(auth.user._id, 1);

    const response = await createProduct({
      ...mockdata.product1,
      store: store[0]._id,
      variants: [{...mockdata.product1.variants[0], stock: undefined}]
    });

    expect(response.status).toBe(400);
  });

});
