var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  first_name : { type: String, required : true },
  last_name : { type: String, required : false },
  email : { type: String, required : true },
  phone : { type : String, required: true },
  status : { type : String, lowercase: true, default : "prospect" },
  been_contacted : { type : Boolean, default : true },
  updated : { type : Date, default: Date.now },
  last_seen : { type: Date, required: false },
  prority : { type: String, default: "medium" }
});

module.exports = mongoose.model('Lead', schema);
