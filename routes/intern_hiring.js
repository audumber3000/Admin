
var express               = require("express"),
    mongoose              = require("mongoose"),

    bodyParser            = require("body-parser"),


	methodOverride  = require("method-override")

var nodemailer = require('nodemailer');
var flash = require("connect-flash");

var multer  = require('multer');
var cloudinary = require('cloudinary').v2; //media upload
var Interninfo_final = require("../models/Interinfo");



const router = express.Router();




// const Interninfo_final = mongoose.model('Interinfo_final', Interninfo);

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'hr.education4ol@gmail.com',
    pass: 'Eduol@123'
  }
});



router.get("/intern_application", function(req, res){
	
		
    res.render("Intern_Hiring/application");
});




router.post("/intern_application", function(req, res){
	let today = new Date().toLocaleDateString()

    console.log(today)
	var val = Math.floor(1000 + Math.random() * 9000);
    var applyID = val+today;

	
var mailOptions = {
  from: 'hr.education4ol@gmail.com',
  to: req.body.email,
  subject: 'Thankyou for Applying at Education4ol',
  text: 'Hi ' +req.body.name   +'\n Thankyou for  applying on Education4ol career portal . Please make sure that the following details  are Correct for the hassle free  communication. \n\n 1.Email : ' + req.body.email  +'\n 2.Contact number : ' + req.body.contact + '\n\n Our HR Team will soon contact you for futher Details. \n\n Education4ol | Powered by UpClick Labs \n Company Details : www.education4ol.com \n Company Linkdin : https://www.linkedin.com/company/education-4-ol  '
};
	
	
	
transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
	  
	  //saving to database
// 	    mongoose.connect("mongodb+srv://audumber:Ramdas3000@cluster0-bj3vd.mongodb.net/Dashboard?retryWrites=true& w=majority");
	var InternSession = "July2021"  //Change
	Interninfo_final.create({ Name:req.body.name   ,Contact:req.body.contact  ,Email:req.body.email,Internship:req.body.intern, CollegeName:req.body.colname ,CollegeState:req.body.colstate ,CollegeCity:req.body.clgcity , Year:req.body.Year, Qualification:req.body.qualification, ApplicationID:applyID, Accepted:"No" ,Selected:"No",Rejected:"No", Completed:"No", Year:req.body.clgyear ,Skills:req.body.skills    ,ApplyDate:today,Session:InternSession,InternID:"No" , Task1:"No" , Task2:"No" , Task3:"No"}, function (err, small) {
     
      if (err){
        console.log("somthing went wrong!!")
      }
res.render("Intern_Hiring/welcome");
    });
	  
		


    // }) 
	  
  }
}); 
	
	
	
	
	
	
		
    
});











module.exports =router;