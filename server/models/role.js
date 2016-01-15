/*Role schema: Defines structure of roles model*/
'use strict';
var mongoose = require('../config/db'),
  Schema = mongoose.Schema,
  autoIncrement = require('mongoose-auto-increment');

var roleSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  }
});

roleSchema.plugin(autoIncrement.plugin, {
  model: 'Role'
});

module.exports = mongoose.model('Roles', roleSchema);

