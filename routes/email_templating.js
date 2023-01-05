const express = require("express");
const mongoose = require("mongoose");

var EmailTemplate = require('email-templates-v2');

const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');


var Interninfo_final = require("../models/Interinfo");
const Email = require("./email_templating");



// const router = express.Router();


const date1 = new Date();
console.log("current Time", date1);
var ISToffSet = 330; //IST is 5:30; i.e. 60*5+30 = 330 in minutes 
offset= ISToffSet*60*1000;
var ISTTime = new Date(date1.getTime()+offset);



//const Interninfo_final = mongoose.model('Interninfo_final', Interninfo);

//const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: 'notification.education4ol@gmail.com',
//         pass: 'pnhigjdtuzopobqn'
//     }
// });

const transporter = nodemailer.createTransport({
    pool: true,
    port: 465,
    service: 'gmail',
    host: "smtp.gmail.com",
    secure: true, // use TLS
    auth: {
      user: "notification.education4ol@gmail.com",
      pass: "pnhigjdtuzopobqn",
    },
  });

transporter.use('compile', hbs({
    viewEngine: {
        extname: '.hbs',
        layoutsDir: 'views/email/',
        defaultLayout: false,
        partialsDir: 'views/partials/'
    },
    viewPath: 'views/email/',
    extName: '.hbs'

}));





function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

//-----all functions------------------------------
async function bulk_email(data, sub , email) {
   
    console.log(data[0].Email)
    for (let i = 0; i < data.length; i++) {
        console.log(data[i].Email)
        // create template based sender function
        await sleep(2000);
        var sendPwdReminder = {
            from: 'Education4ol Team <notification.education4ol@gmail.com>',
            
            // to: data[i].Email,
            to:"audumberchaudhari1003@gmail.com",
            subject: sub,
            template: 'audu',
            context:{
                name: data[i].Name,
                email: email // replace {{name}} with Adebola
            }
    
        };
        // use template based sender to send a message
        transporter.sendMail(sendPwdReminder, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
        
      }
   
    
    

    
}









module.exports = {
    bulk_email,

};
