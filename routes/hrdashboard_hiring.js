
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




//const Interninfo_final = mongoose.model('Interninfo_final', Interninfo);

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'hr.education4ol@gmail.com',
    pass: 'Eduol@123'
  }
});


router.get("/dashboard_new_hiring", function(req, res){

	
	Interninfo_final.find({}, function (err, one_detail) {
          if (err){
            console.log("something went wrong!!!")
          }else{
      
             res.render("dashboard_new_hiring" , {intern:one_detail});
          }
});
});


router.post("/selection_action", function(req, res){
	var action = req.body.action;
	var applyid = req.body.custId;
	
	//rejection mail
	   var mailrejected = {
  from: 'hr.education4ol@gmail.com',
  to: req.body.email,
  subject: 'Sorry ! Rejected',
  text: 'Hi ' +req.body.name   +'\n  We are so Sorry to inform you that  we can’t move forward with your application at this point. \n\n Thank you for applying. We appreciate your effort. \n\n Education4ol | Powered by UpClick Labs \n Company Details : www.education4ol.com \n Company Linkdin : https://www.linkedin.com/company/education-4-ol  '
};
	
	//---------------------------------------section one
	if(req.body.section === "one"){
		if(action === "interview"){
			
   Interninfo_final.updateOne({ApplicationID:applyid  }, { Accepted: "Yes" }, function(err,result) {
    if (err) {
      res.send(err);
    }
	   
	   var mailOptions = {
  from: 'hr.education4ol@gmail.com',
  to: req.body.email,
  subject: 'Congratulations ! Now Interview',
  text: 'Hi ' +req.body.name   +'\n  We are so happy to inform you that We found you Resume Impressive. Congratulations you have been selected for an interview Process. \n\n Our HR Team will soon contact you for futher Details. \n\n Education4ol | Powered by UpClick Labs \n Company Details : www.education4ol.com \n Company Linkdin : https://www.linkedin.com/company/education-4-ol  '
};
	   
      //sending mail	   	
transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
	  
	  	//rendering back to dashboard   
Interninfo_final.find({}, function (err, one_detail) {
          if (err){
            console.log("something went wrong!!!")
          }else{
      return res.redirect('/dashboard_new_hiring');
          }
		  });
	  
  }
});
	   

	   
	});
	}
		else{
		 Interninfo_final.updateOne({ApplicationID:applyid  }, { Rejected: "Yes" }, function(err,result) {
    if (err) {
      res.send(err);
    }
	   Interninfo_final.find({}, function (err, one_detail) {
          if (err){
            console.log("something went wrong!!!")
          }else{
			  
		transporter.sendMail(mailrejected, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
	 return res.redirect('/dashboard_new_hiring');
  }
});	  
    
          }
		  });
	});
	}
		
	}
	
	//--------------------------------------------section two
		if(req.body.section === "two"){
		if(action === "selected"){
			var val = Math.floor(1000 + Math.random() * 9000);
   Interninfo_final.updateOne({ApplicationID:applyid  }, { Selected: "Yes" , InternID : val }, function(err,result) {
    if (err) {
      res.send(err);
    }
	   
	Interninfo_final.find({}, function (err, one_detail) {
          if (err){
            console.log("something went wrong!!!")
          }else{
		
	//sending mail		  
	var mailOptions = {
  from: 'hr.education4ol@gmail.com',
  to: req.body.email,
  subject: 'Congratulations ! You have been Selected for Internship.',
  text: 'Hi ' +req.body.name   +'\n  We are so happy to inform you that You have been selected as Intern at Education4ol.\n\n 1.Your InternID :'+ val  +'\n\n Our HR Team will soon contact you for futher Details. \n\n Education4ol | Powered by UpClick Labs \n Company Details : www.education4ol.com \n Company Linkdin : https://www.linkedin.com/company/education-4-ol  '
};
	   
      //sending mail	   	
transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
 return res.redirect('/dashboard_new_hiring');
	  
  }
});
			  
	 
          }
		  });
	});
	}else{
		 Interninfo_final.updateOne({ApplicationID:applyid  }, { Rejected: "Yes" }, function(err,result) {
    if (err) {
      res.send(err);
    }
	   Interninfo_final.find({}, function (err, one_detail) {
          if (err){
            console.log("something went wrong!!!")
          }else{
	//sending rejection mails		  
	transporter.sendMail(mailrejected, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
 return res.redirect('/dashboard_new_hiring');
  }
});
     
          }
		  });
	});
	}
		
	}
		
  
});









module.exports =router;