
var express               = require("express"),
    mongoose              = require("mongoose"),

    bodyParser            = require("body-parser"),


	methodOverride  = require("method-override")

var nodemailer = require('nodemailer');
var flash = require("connect-flash");

var multer  = require('multer');
var cloudinary = require('cloudinary').v2; //media upload

const hbs = require('nodemailer-express-handlebars')
var path  = require('path');


const router = express.Router();


var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'notification.education4ol@gmail.com',
      pass: 'Ramdas@3000'
    }
  });

  const handlebarOptions = {
    viewEngine: {
        partialsDir: path.resolve('./views/email/'),
        defaultLayout: false,
    },
    viewPath: path.resolve('./views/email/'),
};

transporter.use('compile', hbs(handlebarOptions))

router.get("/demopage" ,function(req,res){
	
    var mailOptions = {
        from: '"Team Education4ol" <notification.education4ol@gmail.com>', // sender address
        to: 'audumberchaudhari3000@gmail.com', // list of receivers
        subject: 'Welcome to Education4ol!',
        template: 'email' // the name of the template file i.e email.handlebars
        // context:{
        //     name: "Adebola", // replace {{name}} with Adebola
        //     company: 'My Company' // replace {{company}} with My Company
        // }
    };
    
    // trigger the sending of the E-mail
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
    });

    console.log("Audumber done");
	res.send("hello audumber");
});

router.get("/demopage1" , function(req,res){
    res.render("email/email")
})










module.exports =router;