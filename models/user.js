var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
	
	
	Date:String,
	

	
	
	
});

UserSchema.plugin(passportLocalMongoose)
module.exports = mongoose.model("User" , UserSchema);