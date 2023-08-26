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
    required: [true, en['description-required']],
  },
  features: {
    type: String,
    required: [true, en['features-required']],
  },
  price: {
    type: Number,
    required: [true, en['price-required']],
  },
  currency: {
    type: String,
    required: [true, en['currency-required']],
    enum: ['NGN', 'USD', 'GBP', 'EUR', 'CAD'],
    validate: {
      validator: function (v) {
        return this.currency.enum.includes(v);
      },
      message: en['currency-not-supported'],
    },
  },
  stock: {
    type: Number,
  },
  stockUnit: {
    type: String,
    enum: ['Cartons', 'Palletes', 'Packets', 'Boxes'],
    validate: {
      validator: function (v) {
        return this.stockUnit.enum.includes(v);
      },
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
    enum: ['Kg', 'Lbs'],
    validate: {
      validator: function (v) {
        return this.weightUnit.enum.includes(v);
      },
      message: en['weight-not-supported'],
    },
  },
  dimensions: {
    type: String,
  },
  users: {
    type: String,
    enum: ['Children', 'Adults', 'All'],
    validate: {
      validator: function (v) {
        return this.users.enum.includes(v);
      },
      message: en['users-not-supported'],
    },
  },
  sex: {
    type: String,
    enum: ['Male', 'Female'],
    validate: {
      validator: function (v) {
        return this.stockUnit.sex.includes(v);
      },
      message: en['sex-not-supported'],
    },
  },
  images: [
    {
      type: String,
      validate: {
        validator: function (v) {
          return /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-z]{2,63}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)$/.test(
            v,
          );
        },
        message: en['image-url-format'],
      },
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
        validator: function(v) {
          return /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-z]{2,63}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)$/.test(v);
        },
        message:  en['video-url-format']
      }
    },
  ],
  variants: [{
    id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'variants'
    },
    image: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    }
  }],
  active: {
    type: Boolean,
    default: true,
    required: true
  }
});

module.exports = mongoose.model('products', ProductSchema);
