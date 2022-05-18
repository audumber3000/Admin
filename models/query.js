var mongoose = require("mongoose");


var UserSchema = new mongoose.Schema({
    
    InternID : String,
    person : Object, 
    ticketID : {type:String, default:"NA"},
    subject: String,
    detail: String,
	status : {type:String, default:"Open"},
    priority : String,
    askedAt: {type: String},
	replyAt: {type: String , default:"NA"},
	

	
	
	
});


module.exports = mongoose.model("query" , UserSchema);