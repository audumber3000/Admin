
var express               = require("express"),
    mongoose              = require("mongoose"),

    bodyParser            = require("body-parser"),


	methodOverride  = require("method-override")

var nodemailer = require('nodemailer');
var flash = require("connect-flash");

var multer  = require('multer');
var cloudinary = require('cloudinary').v2; //media upload
var Interninfo_final = require("../models/Interinfo");
var Task_storage = require("../models/task_storage");
var Task = require("../models/task");

var date = require('date-and-time');
var now = new Date();
const value = date.format(now,'DD/MM/YYYY HH:mm:ss');
console.log(date.format(now, value));

const now2 = date.addDays(now, 18)
console.log(date.format(now2, 'DD/MM/YYYY HH:mm:ss'));

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
const { route } = require("./hrdashboard_hiring");

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
router.get("/upload_task" , function(req,res){

  res.render("new_assignment");

})


//work in progress to improve the assignment page. problem is we are seeing 258 details but it should show only active interns assignment.
router.get("/upAs",async function(req,res){
  var Atask = await Task.find({});
  selected_interns = await Interninfo_final.find({ Accepted: "Yes", Selected: "Yes", Rejected: "No", Completed: "No" },async function (err, one_detail) {
    if (err) {
      console.log("something went wrong!!!")
    }
    console.log(one_detail.length)
    for(var i=0 ; i<one_detail.length ; i++){
      
          var ktask = await Task.updateOne({InternID:one_detail[i].InternID}, {status:"Active"});
          console.log(ktask)
          console.log(typeof(one_detail[i].InternID))
      
      
    }
  });
})

router.post("/upload_task" , function(req, res){
  console.log("Updated1111111")
  Task_storage.create({task_id : req.body.task_id , titile:req.body.task_title ,discription : req.body.task_discription , points :[req.body.task_p1 , req.body.task_p2 , req.body.task_p3 , req.body.task_p4] ,task_date:"" ,task_due_date:"",task_submit_date:"", task_link:"",task_status:"",task_score:""  })
	console.log("Updated")
	});


  //task allotment
router.post("/allot_task" ,async function(req,res){
  console.log("Enter into allot_task");
  console.log(req.body.taskid.length)
  console.log(req.body.internid)
  var Atask = await Task_storage.find({task_id:req.body.taskid});

  console.log(Atask);

  await Task.updateMany({InternID:req.body.internid},{  $push: {Task: Atask} });
  
  await Task.updateMany({'InternID':req.body.internid , 'Task.task_id':req.body.taskid} , {'$set': {
    'Task.$.task_date':date.format(now, value),
    'Task.$.task_due_date': date.format(now2, 'DD/MM/YYYY HH:mm:ss'),
    'Task.$.task_status':'Incomplete'
    
  }})


console.log("Done")




  })







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



//-----------------task Over view

router.post("/task/reminder" , function(req,res){
  console.log("reached audumber heer.....")
  return false;
})











module.exports =router;