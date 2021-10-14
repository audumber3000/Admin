var mongoose = require("mongoose");


var UserSchema = new mongoose.Schema({
    Intern_id: String,
    name : String,
	mode: String,
	Date: String,
	Invoice : String,
	
	
	

	
	
	
});


module.exports = mongoose.model("pay" , UserSchema);