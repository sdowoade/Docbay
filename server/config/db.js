/**
 *Connect to mongodb datatbase using mongoose.
 *Mongoose-auto-increment cahnges default _id behaviour.
 */
'use strict';
var mongoose = require('mongoose'),
  autoIncrement = require('mongoose-auto-increment'),
  db = process.env.DATABASE_URL;

var ENV = process.env.NODE_ENV || 'development';
if (ENV === 'development') {
  db = process.env.DATABASE_URL;
} else {
  db = 'mongodb://localhost:27017/testdms';
}

mongoose.connect(db);
autoIncrement.initialize(mongoose.connection);
module.exports = mongoose;
