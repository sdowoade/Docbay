/*Document schema: Defines structure of documents model*/
'use strict';
var mongoose = require('../config/db'),
  Schema = mongoose.Schema,
  autoIncrement = require('mongoose-auto-increment');

var documentSchema = new Schema({
  ownerId: {
    type: Number,
    ref: 'User',
    required: true,
  },

  title: {
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

  content: String,

  dateCreated: {
    type: Date,
    default: Date.now
  },
  
  lastModified: {
    type: Date,
    default: Date.now
  }
});

documentSchema.plugin(autoIncrement.plugin, {
  model: 'Document'
});

module.exports = mongoose.model('Documents', documentSchema);
