var mongoose = require("mongoose");


var Payment_save = new mongoose.Schema({
    Name : String,  
	Email : String,
    payment_Info : Object,
    createdAt: {type: Date, default: Date.now}
    
});


module.exports = mongoose.model("Payment_save" , Payment_save);