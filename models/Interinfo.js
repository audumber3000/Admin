var mongoose = require("mongoose");





var interninfo_finals = new mongoose.Schema({
	Name:String,
    Contact : String,
	Email : String,
	
	Internship : String,
	Qualification : String,
	CollegeName:String,
	CollegeCity:String,
	CollegeState:String,
	Year : String,
	ApplicationID : String,
	Accepted : String,
	Selected: String,
	Completed :String,
	Rejected : String,
	ApplyDate:String,
	Skills : String,
	Session : String,
	InternID : String,

	Task1 : String,
	
	Task2 : String,
	Task3 : String,
	Task4 : String,
	
	
	Batch:{type:String, default:"NA"},
	DOB:{type:Date, default:Date.now},
	Aadhar_no:{type:Number, default:000},
    Linkdin:{type:String, default:"NA"},
	Github : {type:String, default:"NA"},
	Status:String,
	profile_img : String

	
   
 

});

module.exports = mongoose.model("interninfo_finals", interninfo_finals);