
var express               = require("express"),
    mongoose              = require("mongoose"),

    bodyParser            = require("body-parser"),


	methodOverride  = require("method-override")

var nodemailer = require('nodemailer');
var flash = require("connect-flash");

var multer  = require('multer');
var cloudinary = require('cloudinary').v2; //media upload
var Interninfo_final = require("../models/Interinfo");

var date = require('date-and-time');
var now = new Date();
const pattern = date.compile('ddd, MMM DD YYYY');
console.log(date.format(now, pattern));

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

router.get("/upload_assignment1", function(req, res){
	
		
    res.render("assign_upload/assignment_upload1");
});

router.get("/upsu", function(req, res){
	
		
    res.render("assign_upload/not-welcome");
});

//assignment 1 and 4
router.post("/upload_assignment1" , function(req, res){
	 
	
	console.log(req.body.internid);
	console.log(req.body.link);
	console.log(req.body.task);
	
	
  
	
 


     if(req.body.task === "Task1"){
	Interninfo_final.updateMany({InternID: req.body.internid }, {Task1: "Yes" , Task1_link:req.body.link ,Task1_date:date.format(now, pattern) }, function(err,result) {
    if (err) {
          console.log(err);
    }
		console.log("task1 reached");
	   res.render("./assign_upload/welcome");
   });
	}
	
	
	else if(req.body.task === "Task4"){
				 
   Interninfo_final.updateMany({InternID: req.body.internid }, {Task4: "Yes" ,Task4_link:req.body.link,Task4_date:date.format(now, pattern) }, function(err,result) {
    if (err) {
    console.log(err)
    }
		console.log(result);
	   res.render("./assign_upload/welcome");
   });
				 
	}	
});









 //upload.single('profile-file')
router.post("/upload_assignment" ,upload.single('profile'), function(req, res){
	 
	var filname = req.file.filename;
	console.log(req.body.internid);
	console.log(req.body.task);

	
  
	
 
// console.log(JSON.stringify(req.file))
	var path = './public/tempfile/' + filname;
	cloudinary.uploader.upload(path , function(error, result) {
		
		console.log(result)
	
		
			 fs.readdirSync('./public/tempfile').forEach(file => {
		 var path = './public/tempfile/' + filname;
		 console.log(path);
		 fs.unlink(path, function(err){
			 
			 if(err){
				  console.log("Error in deleting file");
			 }
			 
			 
			
			 
			 

			
		 })
   
  });
	});
 if(req.body.task === "Task2"){
				 
	Interninfo_final.updateMany({InternID: req.body.internid }, {Task2: "Yes",Task2_date:date.format(now, pattern) }, function(err,result) {
    if (err) {
    console.log(err)
    }
		
	   res.render("./assign_upload/welcome");
   });
				 
			 }else{
				 Interninfo_final.updateMany({InternID: req.body.internid }, {Task3: "Yes",Task3_date:date.format(now, pattern) }, function(err,result) {
    if (err) {
		
           console.log(err)
    }
					
	   res.render("./assign_upload/welcome");
   });
				 
			 }
});




//upload profile image

// router.get("/upload_image", function(req, res){
	
		
//     res.render("portal_intern/uploadimage");
// });


// router.post("/upload_image" ,upload.single('profile'), function(req, res){
	 
// 	var filname = req.file.filename;
// 	console.log(req.body.internid);
	

	
  
	
 
// // console.log(JSON.stringify(req.file))
// 	var path = './public/tempfile/' + filname;
// 	cloudinary.uploader.upload(path, {
//               folder: 'profile pictures',
//               use_filename: true
//              } , function(error, result) {
		
		
// 	     fs.readdirSync('./public/tempfile').forEach(file => {
// 		 var path = './public/tempfile/' + filname;
// 		 console.log(path);
			 
// 			 //responsible for deleting file
// 		 fs.unlink(path, function(err){
	    
// 	if(err){
// 		console.log("eroor in deleting");
// 	}
			 
// 	});
			 
	
   
//          });
		
// 	Interninfo_final.updateMany({InternID: req.body.internid }, {profile_img: result.url }, function(err,result) {
//     if (err) {
//     console.log(err)
//     }
		
//    res.render("./assign_upload/welcome");
//    });
// 	});
	
	

  
// });










module.exports =router;