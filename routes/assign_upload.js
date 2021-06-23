
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

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/tempfile')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
})
var upload = multer({ storage: storage })


cloudinary.config({ 
  cloud_name: 'education4ol', 
  api_key: '438746385353451', 
  api_secret: 'O9_8y7hKmkkUDo6-gqIO2lBg4zw' 
});


var fs = require('fs');

router.get("/upload_assignment", function(req, res){
	
		
    res.render("assign_upload/assignment_upload");
});

router.get("/upsu", function(req, res){
	
		
    res.render("assign_upload/not-welcome");
});

 //upload.single('profile-file')
router.post("/upload_assignment" ,upload.single('profile'), function(req, res){
	 
	var filname = req.file.filename;
	console.log(req.body.internid);
	console.log(req.body.task);
	
  
	
 
// console.log(JSON.stringify(req.file))
	var path = './public/tempfile/' + filname;
	cloudinary.uploader.upload(path , function(error, result) {
		
		console.log(result, error)
	
		
			 fs.readdirSync('./public/tempfile').forEach(file => {
		 var path = './public/tempfile/' + filname;
		 console.log(path);
		 fs.unlink(path, function(err){
			 
			 if(err){
				  console.log("Error in deleting file");
			 }
			 
			 
			 if(req.body.task === "Task1"){
	Interninfo_final.updateOne({InternID: req.body.internid }, {Task1: "Yes" }, function(err,result) {
    if (err) {
      res.render("./assign_upload/not-welcome");
    }
		 console.log(result);
	   res.render("./assign_upload/welcome");
   });
			 }else if(req.body.task === "Task2"){
				 
	Interninfo_final.updateOne({InternID: req.body.internid }, {Task2: "Yes" }, function(err,result) {
    if (err) {
    res.render("./assign_upload/not-welcome");
    }
		 console.log(result);
	   res.render("./assign_upload/welcome");
   });
				 
			 }else{
				 Interninfo_final.updateOne({InternID: req.body.internid }, {Task3: "Yes" }, function(err,result) {
    if (err) {
		
       res.render("./assign_upload/not-welcome");
    }
					
	   res.render("./assign_upload/welcome");
   });
				 
			 }
			 
			 

			
		 })
   
  });
	});
    
});










module.exports =router;