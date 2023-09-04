var mongoose = require('mongoose');
const en = require('../../../locale/en');
var Schema = mongoose.Schema;
var ProductSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  store: {
    type: Schema.Types.ObjectId,
    required: [true, en['store-id-required']],
    ref: 'stores',
  },
  description: {
    type: String,
  },
  features: {
    type: String,
  },
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
  weight: {
    type: Number,
    validate: {
      validator: function (v) {
        return typeof v === 'number';
      },
      message: en['weight-format'],
    },
  },
  weightUnit: {
    type: String,
    enum: { values: ['Kg', 'Lbs'], message: en['weight-not-supported'] },
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
  videos: [
    {
      type: String,
      validate: {
        validator: function (v) {
          return /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/.test(
            v,
          );
        },
        message: en['video-url-format'],
      },
    },
  ],
  variants: [
    {
      _id: {
        type: Schema.Types.ObjectId,
        ref: 'variants',
      },
      image: { type: String },

      name: {
        type: String,
      },
    },
  ],
  testimonials: [
    {type: Object}
  ],
  active: {
    type: Boolean,
    default: true,
    required: true,
  },
});

module.exports = mongoose.model('products', ProductSchema);
