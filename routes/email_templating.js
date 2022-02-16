
const express           = require("express");
const mongoose          = require("mongoose");

var EmailTemplate = require('email-templates-v2');

const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');


var Interninfo_final = require("../models/Interinfo");

const router = express.Router();




//const Interninfo_final = mongoose.model('Interninfo_final', Interninfo);

const transporter = nodemailer.createTransport({
service: 'gmail',
auth: {
user: 'hr.education4ol@gmail.com',
pass: 'Ramdas@3001'
}
});






router.get("/email", function(req, res){

    transporter.use('compile',hbs({
        viewEngine: {
            extname: '.hbs',
            layoutsDir: 'views/email/',
            defaultLayout : 'audu',
            partialsDir : 'views/partials/'
            },
            viewPath: 'views/email/',
            extName: '.hbs'
        
    }));


// create template based sender function
var sendPwdReminder = {
    from: 'hr.education4ol@gmail.com',
    subject: 'Password reminder for !',
    to : 'audumberchaudhari3000@gmail.com',
    subject: 'Congratulations ! Interview process',
    text: 'Hello, audu3000 , Your password is: audumber3000',
    template : 'audu'
     
};

// use template based sender to send a message

transporter.sendMail( sendPwdReminder, function(error, info){
    if (error) {
    console.log(error);
    } else {
    console.log('Email sent: ' + info.response);
      
     
      
    }
    });







});












module.exports =router;