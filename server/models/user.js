var mongoose = require('../../db_connect'),
  Schema = mongoose.Schema,
  autoIncrement = require('mongoose-auto-increment');


var userSchema = new Schema({
  username: {
    type: String,
    required:true,
    unique: true
  },
  role: {
    type: [{ type: Number, ref: 'Role' }],
    required:true,
  },
  name: {
    first: {type:String, required:true},
    last: {type:String, required:true}
  },
  email: {
    type: String,
    required:true,
    unique: true
  },
  password: String
});

userSchema.plugin(autoIncrement.plugin, {
  model: 'User'
});

module.exports = mongoose.model('User', userSchema);
