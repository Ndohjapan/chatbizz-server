const request = require('supertest');
const { app } = require('../src/app');
require('./resources/setup');
const en = require('../locale/en');
const { userLogin } = require('./resources/frequent-functions');
const store = {
  name: 'Lavent Living',
  storeType: 'Ecommerce',
  about: 'We are from the other side of town which you know nothing about',
  whatsappNumber: '',
};
let token;

const createStore = async (store) => {
  let agent = request(app).post('/api/1.0/stores/');

  if (token) {
    agent.set('x-access-token', `${token}`);
  }

  return await agent.send(store);
};

describe('Create stores', () => {
  it.each`
    whatsappNumber     | message
    ${12345}           | ${en['whatsapp-num-invalid']}
    ${'09056144059'}   | ${en['whatsapp-num-invalid']}
    ${'+234078993'}    | ${en['whatsapp-num-invalid']}
    ${1234590212}      | ${en['whatsapp-num-invalid']}
    ${'+0o23noi32no3'} | ${en['whatsapp-num-invalid']}
    ${'hjvh'}         | ${en['whatsapp-num-invalid']}
    ${'897858757'}           | ${en['whatsapp-num-invalid']}
  `(
    'returns - "$message" when whatsapNumber is wrongly formatted to "$whatsappNumber" ',
    async ({ whatsappNumber, message }) => {
      let auth = await userLogin();
      token = auth.token;
      const response = await createStore({ ...store, whatsappNumber });

      expect(response.body.validationErrors.whatsappNumber).toBe(message);
    },
  );
});
