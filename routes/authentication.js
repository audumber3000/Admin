//Authentication--------------------------------------------
var express = require("express");
var router = express.Router(); //changin all app.get by route.get
var passport = require("passport");

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

	successRedirect : "/wel",
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


   console.log(req.body.passport);
   console.log(req.body.username);
 
  
  
   //if condition satisied then only register


  var newUser  = new User({username:req.body.username });

  User.register(newUser ,req.body.password, function(err,user){
    
    console.log(req.body.password);
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



function isLoggedIn(req, res, next) { //next is the next thing that needs to be called.
    if (req.isAuthenticated()){
        return next();
    }
	  req.flash("error_msg","OOPS!! Entered crediantials are Incorrect!")
    res.redirect("/login");
}


module.exports = router;
