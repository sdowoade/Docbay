'use strict';
var mongoose = require('mongoose'),
  autoIncrement = require('mongoose-auto-increment'),
  db = 'mongodb://localhost:27017/hht';

mongoose.connect(db);
autoIncrement.initialize(mongoose.connection);
module.exports = mongoose;
