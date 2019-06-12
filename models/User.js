const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
      type: String,
      lowercase: true,
      required: true,
      trim: true
  },
  password: {
    type: String,
    required: true
},
  date: {
    type: Date,
    default: Date.now
  }

});

mongoose.model('users', UserSchema);