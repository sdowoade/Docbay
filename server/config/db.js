/**
 *Connect to mongodb datatbase using mongoose.
 *Mongoose-auto-increment cahnges default _id behaviour.
 */
'use strict';
var mongoose = require('mongoose'),
  autoIncrement = require('mongoose-auto-increment');

require('dotenv').load();
var db = process.env.DATABASE_URL;
mongoose.connect(db);
autoIncrement.initialize(mongoose.connection);
module.exports = mongoose;
