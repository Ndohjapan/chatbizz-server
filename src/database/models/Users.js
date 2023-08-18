let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let UserSchema = new Schema({
  uid: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  displayName: {
    type: String,
  },
});

mongoose.model('users', UserSchema);
