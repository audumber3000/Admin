var express               = require("express"),
    mongoose              = require("mongoose"),

    bodyParser            = require("body-parser"),
    User                  = require("./models/user"),

	methodOverride  = require("method-override")

var nodemailer = require('nodemailer');
var flash = require("connect-flash");

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


//show sign up form
app.get("/instagram", function(req, res){

    res.render("instagram");
});

app.get("/hrdashboard", function(req, res){
    res.render("hrdashboard");
});


//intern intern_details
app.get("/hrdashboard_Interndetail", function(req, res){
	
	
	Interninfo_final.find({}, function (err, one_detail) {
          if (err){
            console.log("something went wrong!!!")
          }else{
      console.log(one_detail)
			   res.render("Intern_Details/dashboard_Interndetail" , {intern:one_detail});
          
          }
});
   
	
});

//--------------------------------------------------------------------------------------
//assignment details

app.get("/dashboard_assignedetail", function(req, res){
	
	
	Interninfo_final.find({Session : "July2021"}, function (err, one_detail) {
          if (err){
            console.log("something went wrong!!!")
          }else{
      console.log(one_detail)
			   res.render("dashboard_assignmentdetails" , {intern:one_detail});
          
          }
});
   
	
});




//--upload assignment-------------------------------------------------------------------------------------

//-----hiring dashboard-------------------------------------------------------------------------------------------




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




app.listen(3000,function(err){
	if(err){
		console.log("server connection error!!")
		console.log("Reconnecting . . . ")
	}else{
		console.log("connecting . . . ")
		console.log("connected successfully")
	}
})



// app.listen(process.env.PORT, process.env.IP, function(){
//     console.log("server started...")
// });
