'use strict';
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  autoIncrement = require('mongoose-auto-increment');

var roleSchema = new Schema({
  title: {
    type: String,
    required:true,
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

module.exports = mongoose.model('Role', roleSchema);

mongoose.model('Role', roleSchema).count({}, function(err, count) {
  if (count === 0) {
    mongoose.model('Role', roleSchema).create({
      title: '_Public',
    }, (err, role) => {
      console.log('public created');
    });
  }
});
