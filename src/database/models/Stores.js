var mongoose = require('mongoose');
const en = require('../../../locale/en');
var Schema = mongoose.Schema;

var StoreSchema = new Schema({
  whatsappNumber: {
    type: String,
    required: [true, en['whatsapp-num-required']],
    unique: true
  },
  storeType: {
    type: String,
    required: [true, en['store-type-required']],
    enum: ['Ecommerce', 'Digital']
  },
  user: {
    type: Schema.Types.ObjectId,
    required: [true, en['user-id-required']],
    ref: 'users'
  },
  name: {
    type: String,
    required: [true, en['store-name-required']]
  },
  about: {
    type: String,
    required: [true, en['about-store-required']]
  },
  image: {
    type: String,
    required: [true, en['image-url-required']]
  },
  whatsappConnected: {
    type: Boolean,
    required: true,
    default: false
  },
  bank: {
    type: String
  },
  accountName: {
    type: String
  },
  accountNumber: {
    type: String
  },
  paymentLink: {
    type: String
  },
  active: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model('stores', StoreSchema);