
const express = require("express");
const mongoose = require("mongoose");

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
        pass: 'lwhxbrweilsirofg'
    }
});

transporter.use('compile', hbs({
    viewEngine: {
        extname: '.hbs',
        layoutsDir: 'views/email/',
        defaultLayout: 'audu',
        partialsDir: 'views/partials/'
    },
    viewPath: 'views/email/',
    extName: '.hbs'

}));



function task_alloted(mail , name) {
    console.log("entring into email mafila")
    console.log(mail , name);
   
    // create template based sender function
    var sendPwdReminder = {
        from: 'Project Team <hr.education4ol@gmail.com>',
        
        to: mail,
        subject: 'New Task Alloted!',
        template: 'email',
        context:{
            name: name, // replace {{name}} with Adebola
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

    return true;
}






module.exports = {
    task_alloted
};












