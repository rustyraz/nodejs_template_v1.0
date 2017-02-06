var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var userSchema = new Schema({
  first_name : { type : String , required : true },
  last_name : { type : String , required : false },
  phone : { type : String , required : true },
  email : { type : String , required : true },
  password : { type : String , required : true },
  active : { type : Boolean, required : false, default : false }
});

// var userSchema = new Schema({
//     name: String,
//     email: String,
//     username: {type: String, required: true, unique: true},
//     password: String,
//     role: {type: String, required: true, enum: ['new', 'admin', 'user'], default: 'new'},
//     authType: {type: String, enum: ['google', 'direct'], required: true}
// });

userSchema.methods.encryptPassword = function(password){
  return bcrypt.hashSync(password, bcrypt.genSaltSync(5),null);
};

userSchema.methods.validatePassword = function(password){
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User',userSchema);
