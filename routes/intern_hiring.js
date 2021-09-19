
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
    pass: 'Ramdas@3000'
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
  subject: 'Thank you for applying at Education4ol',
  text: 'Dear ' +req.body.name+',\nWe appreciate your interest in internship at Education4ol.Thank you for giving us your valuable time.\n\nPlease cross verify your details given below for smooth interview and onboarding process \n\n Email : ' + req.body.email  +'\n Contact number : ' + req.body.contact + '\n\nOur HR team will soon be connecting with you for further process. \n\nRegards,\nEducation4ol \nPowered by UpClick Labs  \n\nWebsite: www.education4ol.com \nLinkedIn profile: https://www.linkedin.com/company/education-4-ol  '
};
	
	
	
transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
	  
	  //saving to database
// 	    mongoose.connect("mongodb+srv://audumber:Ramdas3000@cluster0-bj3vd.mongodb.net/Dashboard?retryWrites=true& w=majority");
	var InternSession = "Sep2021"  //Change
	Interninfo_final.create({ Name:req.body.name   ,Contact:req.body.contact  ,Email:req.body.email,Internship:req.body.intern, CollegeName:req.body.clgname ,CollegeState:req.body.clgstate ,CollegeCity:req.body.clgcity , Qualification:req.body.qualification, ApplicationID:applyID, Accepted:"No" ,Selected:"No",Rejected:"No", Completed:"No", Year:req.body.clgyear ,Skills:req.body.skills    ,ApplyDate:today,Session:InternSession,InternID:"No" , Task1:"No" , Task2:"No" , Task3:"No" , Task4 : "No",
	Task1_link: "",
	Task4_link : "",
	
	Task1_date:"",
	Task2_date:"",
	Task3_date:"",
	Task4_date:"" ,
    profile_img:""}, function (err, small) {
     
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