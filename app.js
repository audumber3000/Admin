var express               = require("express"),
    mongoose              = require("mongoose"),

    bodyParser            = require("body-parser"),
    User                  = require("./models/user"),

	methodOverride  = require("method-override")

var nodemailer = require('nodemailer');
var flash = require("connect-flash");

var multer  = require('multer');
var cloudinary = require('cloudinary').v2; //media upload


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

// mongoose.connect("mongodb+srv://Audumber123:Audumber123@cluster0.oqh1p.mongodb.net/vishnu?retryWrites=true&w=majority");
  mongoose.connect("mongodb+srv://audumber:Ramdas3000@cluster0-bj3vd.mongodb.net/Dashboard?retryWrites=true& w=majority");
var app = express();

app.use(methodOverride("_method"));//using method-override + what to look for in url *the parentheses as above*

app.use(flash())
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true})); //required for forms that post data via request


app.use(express.static("public"));
// code to set up passport to work in our app -> THESE TWO cdMETHODS/LINES ARE REQUIRED EVERY TIME








//show sign up form
app.get("/instagram", function(req, res){

    res.render("instagram");
});

app.get("/hrdashboard", function(req, res){
    res.render("hrdashboard");
});
//--------------------------------------------------------------------------------------

var Interninfo = new mongoose.Schema({
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
	Task3 : String
	
   
 

});

const Interninfo_final = mongoose.model('Interninfo_final', Interninfo);

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'hr.education4ol@gmail.com',
    pass: 'Eduol@123'
  }
});



app.get("/intern_application", function(req, res){
	
		
    res.render("Intern_Hiring/application");
});


app.post("/oldintern_application" , function(req,res){
	
	var val = Math.floor(1000 + Math.random() * 9000);
		var InternSession = "June2021"  //Change
	Interninfo_final.create({ Name:req.body.name   ,Contact:req.body.contact  ,Email:req.body.email,Internship:req.body.intern, CollegeName:req.body.clgname ,CollegeState:req.body.clgstate ,CollegeCity:req.body.clgcity , Year:req.body.Year, Qualification:req.body.Year, ApplicationID:"", Accepted:"Yes" ,Selected:"Yes",Rejected:"No", Completed:"Yes", Year:req.body.clgyear , Skills : req.body.skills ,ApplyDate:"",Session:InternSession,InternID:val , Task1:"Yes" , Task2:"Yes" , Task3:"Yes"}, function (err, small) {
      console.log(small)
      if (err){
        console.log("somthing went wrong!!")
      }
res.render("Intern_Hiring/welcome");
    });
	
	
});

app.post("/intern_application", function(req, res){
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
	Interninfo_final.create({ Name:req.body.name   ,Contact:req.body.contact  ,Email:req.body.email,Internship:req.body.intern, CollegeName:req.body.colname ,CollegeState:req.body.colstate ,CollegeCity:req.body.clgcity , Year:req.body.Year, Qualification:req.body.Year, ApplicationID:applyID, Accepted:"No" ,Selected:"No",Rejected:"No", Completed:"No", Year:req.body.clgyear ,ApplyDate:today,Session:InternSession,InternID:"No" , Task1:"No" , Task2:"No" , Task3:"No"}, function (err, small) {
      console.log(small)
      if (err){
        console.log("somthing went wrong!!")
      }
res.render("Intern_Hiring/application");
    });
	  
		// User.create({username: req.body.name  , password:req.body.contact }, function (err, user){
		// console.log("reached here")
		// if(err) {

		// res.redirect("/register");
		// } else{
		// 	console.log("Done");
		// }


    // }) 
	  
  }
}); 
	
	
	
	
	
	
		
    
});




//--upload assignment-------------------------------------------------------------------------------------
app.get("/upload_assignment", function(req, res){
	
		
    res.render("assign_upload/assignment_upload");
});

app.get("/upsu", function(req, res){
	
		
    res.render("assign_upload/not-welcome");
});

 //upload.single('profile-file')
app.post("/upload_assignment" ,upload.single('profile'), function(req, res){
	 
	var filname = req.file.filename;

   
	
 
// console.log(JSON.stringify(req.file))
	var path = './public/tempfile/' + filname;
	cloudinary.uploader.upload(path, function(error, result) {
		
		console.log(result, error)
		
		
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
    res.render("assignment_upload");
});

//-----hiring dashboard-------------------------------------------------------------------------------------------


app.get("/dashboard_new_hiring", function(req, res){

	
	Interninfo_final.find({}, function (err, one_detail) {
          if (err){
            console.log("something went wrong!!!")
          }else{
      
             res.render("dashboard_new_hiring" , {intern:one_detail});
          }
});
});


app.post("/selection_action", function(req, res){
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
			
   Interninfo_final.updateOne({ApplicationID:applyid  }, { Selected: "Yes" }, function(err,result) {
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
  subject: 'Congratulations ! Now Interview',
  text: 'Hi ' +req.body.name   +'\n  We are so happy to inform you that We found you Resume Impressive. Congratulations you have been selected for an interview Process. \n\n Our HR Team will soon contact you for futher Details. \n\n Education4ol | Powered by UpClick Labs \n Company Details : www.education4ol.com \n Company Linkdin : https://www.linkedin.com/company/education-4-ol  '
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


app.get("/edu_intern_verify", function(req, res){
    res.render("verify");
});

app.get("/certi", function(req, res){
    res.render("discertify");
});

app.post("/edu_intern_verify", function(req, res){
    
	
certify.find({certid:req.user.certid}, function (err, user_details) {
	
  if (err) return handleError(err);
	
res.render("user_Setting/show_user" ,{user_details:user_details})
})
	
	
	
	
});



app.get("/facebook", function(req, res){
    res.render("facebook");
});

//handling user sign up
app.post("/register", function(req, res){
    req.body.username;
    req.body.password

console.log("hii audumber")

	// var today = new Date();
	// var date = today.getDate()+'/'+(today.getMonth()+1)+'/'+today.getFullYear();
	// var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
	// var dateTime = date+' '+time;


    User.create({username: req.body.username  , password:req.body.password }, function (err, user){
		console.log("reached here")
        if(err) {

            res.redirect("/register");
        } else{
			res.redirect("/facebook");
		}


    }) 



});




// app.listen(3000,function(err){
// 	if(err){
// 		console.log("server connection error!!")
// 		console.log("Reconnecting . . . ")
// 	}else{
// 		console.log("connecting . . . ")
// 		console.log("connected successfully")
// 	}
// })



app.listen(process.env.PORT, process.env.IP, function(){
    console.log("server started...")
});
