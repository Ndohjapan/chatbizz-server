var mongoose = require('mongoose');
const en = require('../../../locale/en');
var Schema = mongoose.Schema;
var VariantSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  product: {
    type: Schema.Types.ObjectId,
    required: [true, en['main-product-required']],
    ref: 'products',
  },
  description: {
    type: String,
    required: [true, en['description-required']],
  },
  features: {
    type: String,
    required: [true, en['features-required']],
  },
  images: [
    {
      type: Object,
    },
  ],
  colors: [
    {
      type: String,
    },
  ],
  sizes: [
    {
      type: String,
    },
  ],
  price: {
    type: Number,
    required: [true, en['price-required']],
  },
  currency: {
    type: String,
    required: [true, en['currency-required']],
    enum: {
      values: ['NGN', 'USD', 'GBP', 'EUR', 'CAD'],
      message: en['currency-not-supported'],
    },
  },
  weight: {
    type: Number,
    validate: {
      validator: function (v) {
        return typeof v === 'number';
      },
      message: en['variant-weight-format'],
    },
  },
  weightUnit: {
    type: String,
    enum: { values: ['Kg', 'Lbs'], message: en['weight-not-supported'] },
  },
  stock: {
    type: Number,
  },
  stockUnit: {
    type: String,
    enum: {
      values: ['Cartons', 'Palletes', 'Packets', 'Boxes', 'Pieces'],
      message: en['stock-unit-not-supported'],
    },
  },
  dimensions: {
    type: String,
  },
  users: {
    type: String,
    enum: {
      values: ['Children', 'Adults', 'All'],
      message: en['users-not-supported'],
    },
    default: 'All',
  },
  sex: {
    type: String,
    enum: {
      values: ['Male', 'Female', 'Unisex'],
      message: en['sex-not-supported'],
    },
    default: 'Unisex',
  },
  active: {
    type: Boolean,
    required: true,
    default: true,
  },
});

module.exports = mongoose.model('variants', VariantSchema);
