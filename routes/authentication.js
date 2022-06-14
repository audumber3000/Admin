//Authentication--------------------------------------------
var express = require("express");
var router = express.Router(); //changin all app.get by route.get
var passport = require("passport");
var Interninfo_final = require("../models/Interinfo");
var nodemailer = require('nodemailer');
const mongoose   = require("mongoose");
var dateTime = require('node-datetime');

var cookieParser = require('cookie-parser')
var http = require('http');
const date = require('date-and-time');
var flash = require("connect-flash");
router.use(flash())


//importing all the sechma from model file
var User = require("../models/user")


router.get("/login" , function(req,res){
	res.render("hr_login" )
})

router.post("/login",passport.authenticate("local",{

	successRedirect : "/hrdashboard",
	failureRedirect : "/login"
}),function(req,res){

	console.log("ausumber reached here!")
})



router.get("/login_failed" , function(req,res){
	console.log("hey sorry! welcome failed")
})


router.get("/wel",function(req, res){

	res.render("hrdashboard")
})
router.get("/not-wel",function(req, res){
res.render("not-welcome" , {CurrentUser:req.user})
})


//--register
router.get("/register" ,function(req,res){
   res.render("register" , {CurrentUser:req.user})
})

router.post("/register" ,function(req,res){
   var newUser  = new User({username:req.body.username });
   User.register(newUser ,req.body.password, function(err,user){
    
   if(err){
      console.log("smthing went wrong")
       
    }
     passport.authenticate("local")(req,res,function(){
	
    res.redirect("/wel")
    })
})
})


router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});



//OTP Intern Dashboard--------------------------------------------------------------------------
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'notification.education4ol@gmail.com',
    pass: 'wncsethvvjgqotnv'
  }
});

router.post("/intern_portal", function(req, res){     //Sending OTP

	Interninfo_final.find({InternID : req.body.intern_id}, function (err, one_detail) {
          if (err){
            console.log("something went wrong!!!")
          }else{
			  
			  if(one_detail.length <1){
				  console.log("please enter valid id")
				  res.render("portal_intern/incorrect_info")
			  }else{
				   
			  var val = Math.floor(1000 + Math.random() * 9000);
				  console.log(val);
				  console.log(one_detail[0].Email)
				  
	var mailOptions = {
  from: 'notification.education4ol@gmail.com',
  to: one_detail[0].Email,
  subject: 'OTP for Intern Portal',
  text: 'Hi Intern'   +'\nThankyou for Using Intern portal . \n\n 1.OTP : ' + val  + '\n\n Good Luck ! with the Intern Portal , we hope you have an smooth Experience. \n\n Education4ol | Powered by UpClick Labs \n Company Details : www.education4ol.com \n Company Linkedin : https://www.linkedin.com/company/education-4-ol  '
  // html:'<html> <body> <h1>Audumber chaudhari</h1> </body>   </html>'
};
				  
				  
transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
	res.render("portal_intern/dashboard_OTP",{otp:val , intern:req.body.intern_id})
		}
	});
}
	}
});
});
   



router.post("/intern_portal_otp", function(req, res){  //Verifying OTP

	    if(req.body.intern_otp === req.body.pto){
		console.log("success otp");
		    Interninfo_final.find({InternID : req.body.intern_id}, function (err, one_detail) {
          if (err){
            console.log("something went wrong!!!")
          }else{
			  res.render("portal_intern/dashboard_portal",{ intern:one_detail})
		}
});
		
}
});






function isLoggedIn(req, res, next) { //next is the next thing that needs to be called.
    if (req.isAuthenticated()){
        return next();
    }
	  req.flash("error_msg","OOPS!! Entered crediantials are Incorrect!")
    res.redirect("/login");
}


module.exports = router;
