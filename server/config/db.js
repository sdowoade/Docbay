/**
 *Connect to mongodb datatbase using mongoose.
 *Mongoose-auto-increment cahnges default _id behaviour.
 */
'use strict';
var mongoose = require('mongoose'),
  autoIncrement = require('mongoose-auto-increment'),
  db = 'mongodb://localhost:27017/dms';

var ENV = process.env.NODE_ENV || 'development';
 if (ENV === 'development') {
   db = 'mongodb://localhost:27017/dms';
 } else {
   db = 'mongodb://localhost:27017/testdms';
 }

mongoose.connect(db);
autoIncrement.initialize(mongoose.connection);
module.exports = mongoose;
