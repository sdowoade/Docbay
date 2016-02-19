/**
 *Connect to mongodb datatbase using mongoose.
 *Mongoose-auto-increment cahnges default _id behaviour.
 */
'use strict';
var mongoose = require('mongoose'),
  autoIncrement = require('mongoose-auto-increment'),
  db = 'mongodb://localhost:27017/tsting45'; //process.env.DATABASE_URL;

mongoose.connect(db);
autoIncrement.initialize(mongoose.connection);
module.exports = mongoose;
