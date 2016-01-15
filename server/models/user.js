/*User schema: Defines structure of users model*/
'use strict';
var mongoose = require('../config/db'),
  Schema = mongoose.Schema,
  autoIncrement = require('mongoose-auto-increment');

var userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },

  role: {
    type: [{
      type: Number,
      ref: 'Role'
    }],
    required: true,
  },

  name: {
    first: {
      type: String,
      required: true
    },

    last: {
      type: String,
      required: true
    }
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: String
});

userSchema.plugin(autoIncrement.plugin, {
  model: 'User'
});

module.exports = mongoose.model('Users', userSchema);
