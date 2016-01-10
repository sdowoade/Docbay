var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  autoIncrement = require('mongoose-auto-increment')



roleSchema = new Schema({
  title: {
    type: String,
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
mongoose.model('Role', roleSchema).create({
  title: '_Public',
}, function(err, role) {
  console.log('public created');
});
