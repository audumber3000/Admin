var express               = require("express"),
    mongoose              = require("mongoose"),

    bodyParser            = require("body-parser"),
    User                  = require("./models/user"),

	methodOverride  = require("method-override")

var nodemailer = require('nodemailer');
var flash = require("connect-flash");
var passport = require("passport")
var LocalStrategy = require('passport-local').Strategy; 
var multer  = require('multer');
var cloudinary = require('cloudinary').v2; //media upload
var Interninfo_final = require("./models/Interinfo");


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
app.use(passport.initialize());
app.use(passport.session());


app.use(require("express-session")({
	secret : "Once again Rusty wins cutest doh!",
	resavae : false,
	saveUnitialization :false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(express.static("public"));
// code to set up passport to work in our app -> THESE TWO cdMETHODS/LINES ARE REQUIRED EVERY TIME


//-----------------------------routes
const account_details = require('./routes/demo');
app.use("/" , account_details);

const assign_upload = require('./routes/assign_upload');
app.use("/" , assign_upload);

const intern_details = require('./routes/intern_details');
app.use("/" , intern_details);

const intern_hiring = require('./routes/intern_hiring');
app.use("/" , intern_hiring);

const hrdashboard_hiring = require('./routes/hrdashboard_hiring');
app.use("/" , hrdashboard_hiring);

const auth_hiring = require('./routes/authentication');
app.use("/" , auth_hiring);

//show sign up form
app.get("/instagram", function(req, res){

    res.render("instagram");
});

app.get("/hrdashboard",isLoggedIn, async function(req, res){
	
	 Interninfo_final.find({}, await function (err, one_detail) {
          if (err){
            console.log("something went wrong!!!")
          }else{
			var audu =   one_detail.length;
		
		console.log(audu);
			var selected = 0 ;
			var rejected = 0;
			var completed = 0;  
			  
			  console.log(one_detail[0].Accepted);  
			  
			 for(let i = 0 ; i < audu ; i++){
			 
		 
			
			 if(one_detail[i].Selected == "Yes"){
			 selected = selected + 1;
			
			 }
			 if(one_detail[i].Rejected == "Yes"){
			 rejected = rejected + 1;
			 }
			 if(one_detail[i].Completed == "Yes"){
			 completed =completed  + 1;
			 }
				  
				  
			  }
	 
			  
			
			
			
			   console.log(selected); 
			   console.log(rejected); 
			   console.log(completed); 
	res.render("hrdashboard", {selected : selected , rejected:rejected , completed:completed , total : audu});
			  
			  
			  
        // res.render("Intern_Details/dashboard_Interndetail" , {intern:one_detail});
          }
});

	
	
   
});


//intern intern_details
app.get("/hrdashboard_Interndetail",isLoggedIn, function(req, res){
	
	
	Interninfo_final.find({}, function (err, one_detail) {
          if (err){
            console.log("something went wrong!!!")
          }else{
      console.log(one_detail)
			   res.render("Intern_Details/dashboard_Interndetail" , {intern:one_detail});
          
          }
});
   
	
});

//from filters
app.post("/hrdashboard_Interndetail",isLoggedIn, function(req, res){
	
	console.log(req.body.customRadio);
	Interninfo_final.find({Session: req.body.customRadio}, function (err, one_detail) {
          if (err){
            console.log("something went wrong!!!")
          }else{
      // console.log(one_detail)
			   res.render("Intern_Details/dashboard_Interndetail" , {intern:one_detail});
          
          }
});
   
	
});
//--------------------------------------------------------------------------------------
//assignment details

app.get("/dashboard_assignedetail" ,isLoggedIn, function(req, res){
	
	
	Interninfo_final.find({Session : "July2021"}, function (err, one_detail) {
          if (err){
            console.log("something went wrong!!!")
          }else{
      console.log(one_detail)
			   res.render("dashboard_assignmentdetails" , {intern:one_detail});
          
          }
});
   
	
});




//--intern poratl-------------------------------------------------------------------------------------

app.post("/intern_profile", function(req, res){
	console.log("profile id");
	console.log(req.body.internid);
	
			Interninfo_final.find({InternID : req.body.internid}, function (err, one_detail) {
          if (err){
            console.log("something went wrong!!!")
          }else{
			  
			  
			  
			  
			  
			  
			    res.render("portal_intern/Profile",{ intern:one_detail})
		}
});

});
   

app.get("/intern_messager", function(req, res){
	
res.render("portal_intern/messanger")
});
   
app.get("/assignment_display", function(req, res){
	
res.render("portal_intern/assignment_display")
});


app.get("/intern_portal", function(req, res){
	
res.render("portal_intern/dashboard_ID")
});
   

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'education4ol4@gmail.com',
    pass: 'Audumber@3000'
  }
});



	

app.post("/intern_portal", function(req, res){

	console.log(req.body.intern_id);

	
		
	Interninfo_final.find({InternID : req.body.intern_id}, function (err, one_detail) {
          if (err){
            console.log("something went wrong!!!")
          }else{
			  
			  if(one_detail.length <1){
				  console.log("please enter valid id")
				  res.render("portal_intern/incorrect_info")
			  }else{
				    console.log(one_detail)
			  var val = Math.floor(1000 + Math.random() * 9000);
				  console.log(val);
				  console.log(one_detail[0].Email)
				  
	var mailOptions = {
  from: 'education4ol4@gmail.com',
  to: one_detail[0].Email,
  subject: 'OTP for Intern Portal',
  text: 'Hi Intern'   +'\n Thankyou for  Using Intern portal . \n\n 1.OTP : ' + val  + '\n\n Good Luck ! with the Intern Portal , we hope you have an smooth Experience. \n\n Education4ol | Powered by UpClick Labs \n Company Details : www.education4ol.com \n Company Linkedin : https://www.linkedin.com/company/education-4-ol  '
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
   
app.post("/intern_portal_otp", function(req, res){

	console.log(req.body.intern_id)
	console.log(req.body.pto)
	console.log(req.body.intern_otp)
	
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


//intern-Activity-------------------------------------------------------------------------------------

app.get("/intern_activity" , function(req, res){
	
Interninfo_final.find({InternID : req.body.intern_id}, function (err, one_detail) {
          if (err){
            console.log("something went wrong!!!")
          }else{
			  
			res.render("portal_intern/intern_activity",{ intern:one_detail})
		}
	
      });
	
	});









//-----report-------------------------------------------------------------------------------------------


app.get("/dashboard_report" , isLoggedIn, function(req, res){
	
res.render("dashboard_reports");
});








//-----------------------------------------------------------------------------------------------


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

	


    User.create({username: req.body.username  , password:req.body.password }, function (err, user){
		console.log("reached here")
        if(err) {

            res.redirect("/register");
        } else{
			res.redirect("/facebook");
		}


    }) 



});


function isLoggedIn(req, res, next) { //next is the next thing that needs to be called.
    if (req.isAuthenticated()){
        return next();
    }
	  req.flash("error_msg","OOPS!! Entered crediantials are Incorrect!")
    res.redirect("/login");
}



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
