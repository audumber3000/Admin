
var express = require("express"),
  mongoose = require("mongoose"),

  bodyParser = require("body-parser"),


  methodOverride = require("method-override")

var nodemailer = require('nodemailer');
var flash = require("connect-flash");

var multer = require('multer');
var cloudinary = require('cloudinary').v2; //media upload

var Interninfo_final = require("../models/Interinfo");

const router = express.Router();




//const Interninfo_final = mongoose.model('Interninfo_final', Interninfo);

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'hr.education4ol@gmail.com',
    pass: 'Ramdas@3001'
  }
});


router.get("/dashboard_new_hiring", isLoggedIn, function (req, res) {


  Interninfo_final.find({}, function (err, one_detail) {
    if (err) {
      console.log("something went wrong!!!")
    } else {

      res.render("dashboard_new_hiring", { intern: one_detail });
    }
  });
});


router.post("/selection_action", isLoggedIn, async function (req, res) {
  var action = req.body.action;
  var applyid = req.body.custId;

  //rejection mail
  var mailrejected = {
    from: 'hr.education4ol@gmail.com',
    to: req.body.email,
    subject: 'Sorry ! Rejected',
    text: 'Hi ' + req.body.name + '\n  We are so Sorry to inform you that  we can’t move forward with your application at this point. \n\n Thank you for applying. We appreciate your effort. \n\n Education4ol | Powered by UpClick Labs \n Company Details : www.education4ol.in \n Company Linkdin : https://www.linkedin.com/company/education-4-ol  '
  };

  //---------------------------------------section one
  if (req.body.section === "one") {
    if (action === "interview") {

      Interninfo_final.updateOne({ ApplicationID: applyid }, { Accepted: "Yes" }, function (err, result) {
        if (err) {
          res.send(err);
        }



        var mailOptions = {
          from: 'hr.education4ol@gmail.com',
          to: req.body.email,
          subject: 'Congratulations ! Interview process',
          text: 'Dear ' + req.body.name + ',\nWe are so happy to inform you that We found you Resume Impressive. After reviewing your application, we are excited to move forward with the interview process.\n\nPlease Keep an eye on your mail. With in a day or two your Interview will shedule and communicated to you through Email.\n\nNOTE : Please Reply this mail with "YES" to proceed futher. \n\nRegards,\nEducation4ol \nPowered by UpClick Labs  \n\nWebsite: www.education4ol.in \nLinkedIn profile: https://www.linkedin.com/company/education-4-ol  '
        };

        //sending mail	   	
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);

            //rendering back to dashboard   
            Interninfo_final.find({}, function (err, one_detail) {
              if (err) {
                console.log("something went wrong!!!")
              } else {
                return res.redirect('/dashboard_new_hiring');
              }
            });

          }
        });



      });
    }
    else {
      Interninfo_final.updateOne({ ApplicationID: applyid }, { Rejected: "Yes" }, function (err, result) {
        if (err) {
          res.send(err);
        }
        Interninfo_final.find({}, function (err, one_detail) {
          if (err) {
            console.log("something went wrong!!!")
          } else {

            transporter.sendMail(mailrejected, function (error, info) {
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

  async function uniq(id) { //func used to get unique internid

    var inid = id;
    console.log(inid);
    while (true) {
      let result = await Interninfo_final.find({ InternID: inid });
      console.log(result);
      if (result.length == 0) {
        console.log(inid);
        return inid;
      }
      inid = Math.floor(1000 + Math.random() * 9000);
    }
  }

  if (req.body.section === "two") {
    if (action === "selected") {
      let v = Math.floor(1000 + Math.random() * 9000); 
      var val = await uniq(v);
      console.log(val);

      Interninfo_final.updateOne({ ApplicationID: applyid }, { Selected: "Yes", InternID: val, Status: "Active" }, function (err, result) {
        if (err) {
          res.send(err);
        }

        Interninfo_final.find({}, function (err, one_detail) {
          if (err) {
            console.log("something went wrong!!!")
          } else {

            //sending mail		  
            var mailOptions = {
              from: 'hr.education4ol@gmail.com',
              to: req.body.email,
              subject: 'Congratulations! You have been selected.',
              text: 'Dear ' + req.body.name + ',\nWe are glad to inform that you have cleared your interview and you have been selected as an intern at Education4ol.\nWe are looking forward to the best in you throughout this learning experience\n\n Intern ID :' + val + '\n\nAll the very best for your future endeavors. \n\nRegards,\nEducation4ol \nPowered by UpClick Labs \n\nWebsite: www.education4ol.com \nLinkedin profile: https://www.linkedin.com/company/education-4-ol  '
            };

            //sending mail	   	
            transporter.sendMail(mailOptions, function (error, info) {
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
    } else {
      Interninfo_final.updateOne({ ApplicationID: applyid }, { Rejected: "Yes" }, function (err, result) {
        if (err) {
          res.send(err);
        }
        Interninfo_final.find({}, function (err, one_detail) {
          if (err) {
            console.log("something went wrong!!!")
          } else {
            //sending rejection mails		  
            transporter.sendMail(mailrejected, function (error, info) {
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


function isLoggedIn(req, res, next) { //next is the next thing that needs to be called.
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error_msg", "OOPS!! Entered crediantials are Incorrect!")
  res.redirect("/login");
}







module.exports = router;