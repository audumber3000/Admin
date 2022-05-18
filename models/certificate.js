var mongoose = require("mongoose");


var UserSchema = new mongoose.Schema({
    
    InternID: String,
    person : Object, 
	

});


module.exports = mongoose.model("certificate" , UserSchema);