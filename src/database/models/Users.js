let mongoose = require('mongoose');
const en = require('../../../locale/en');
let Schema = mongoose.Schema;

let UserSchema = new Schema(
  {
    uid: {
      type: String,
      required: [true, en['uid-required']],
      unique: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('users', UserSchema);
