
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
    pass: 'lwhxbrweilsirofg'
  }
});




router.get("/dashboard_new_hiring", isLoggedIn, async function (req, res) {


  accepted_interns = await Interninfo_final.find({ Accepted: "No", Selected: "No", Rejected: "No" }, function (err, one_detail) {
    if (err) {
      console.log("something went wrong!!!")
    }
  });

  selected_interns = await Interninfo_final.find({}, function (err, one_detail) {
    for (var i = 0; i < one_detail.length; i++) {
      // console.log(one_detail[i].Email+","+one_detail[i].Name)
    
    }
    if (err) {
      console.log("something went wrong!!!")
    }
  });

  res.render("dashboard_new_hiring", { intern: accepted_interns, selected_interns: selected_interns });
});



router.post("/selection_action_completed", isLoggedIn, async function (req, res) {
  console.log(req.body.internid);
  console.log("status changed!")
  let founduser = await Interninfo_final.updateOne({ InternID: req.body.internid }, { Completed: "Yes", Status: "Inactive" });
  console.log(founduser);
  res.redirect("/dashboard_new_hiring");

})


router.post("/selection_action", isLoggedIn, async function (req, res) {
  var action = req.body.action;
  var applyid = req.body.custId;

  //rejection mail
  var mailrejected = {
    from: 'hr.education4ol@gmail.com',
    to: req.body.email,
    subject: 'Sorry, Rejected ! - ' + req.body.name,
    text: 'Hi ' + req.body.name + ',\n\nThank you for your interest in our internship program. We appreciate the time you took to apply and to share your qualifications with us. \n\nAfter careful consideration, we have decided to move forward with other candidates whose skills and experience more closely match the specific needs of the internship. \n\nWe encourage you to continue to explore internship opportunities and We will keep your resume on file in case another opportunity opens up. \n\nThank you again for your interest in our company. We wish you the best of luck in your job search \n\nIf you have any queries please feel free to drop a text at +91 8766742410 (whatsapp)\n\nCheers ! \n\n Education4ol | Powered by UpClick Labs \n Company Details : www.education4ol.in \n Company Linkdin : https://www.linkedin.com/company/education-4-ol  '
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

    if (action == "notify") {
      //sending mail		  
      
      var mailOptions = {
        from: 'hr.education4ol@gmail.com',
        to: req.body.email,
        subject: 'Congratulations, Internship application accepted!',
        html: 'Dear ' + req.body.name + ',<br><br>Congratulations! Our tech team is happy with your skill set and projects mentioned in the application. We are really happy to onboard you as an Intern. Please read the below mail carefully and reply.<br><br><strong>Hiring Process Flow Chart:</strong><br><br>Step 1: New Intern Application link: <a href="https://dashboard-education4ol.herokuapp.com/intern_application">https://dashboard-education4ol.herokuapp.com/intern_application</a> (Completed)<br>Step 2: Application Screening Process (Completed)<br>Step 3: Payment (payment link will be sent for 750/- Rs , which will be used for deserializing your Certificates and LOR) (Pending)<br>Step 4: Offer Letter (Pending)<br><br><strong>Perks & Benefits of Internship:</strong><br><br>1. Internship Certificate<br>2. LOR (Letter of Recommendation)<br>3. Opportunity to work on Real-Time Projects.<br>4. Referrals From Company for Full-time Jobs.<br>5. Star Performance Certificate (Depends On your Performance).<br>6. PPO (pre-placement offer) Full time will be offered By Our Parent Company "UPCLICK LABS Pvt. Ltd." based on your performance from Rs. 4LPA to 8LPA<br><br>We look forward to having you on board.!<br><br>Please Reply with "<strong>YES</strong>" so we could initiate the payment link for the application fee followed by the offer Letter.<br><br>*Note: for any queries, feel free to contact us on +91 8766742410 (WhatsApp) or email: hr.education4ol@gmail.com.<br><br>Regards,<br>HR Team, Education4ol<br>Powered by UpClick Labs Pvt. Ltd. , Pune <br>Website: <strong>www.education4ol.in</strong><br>LinkedIn profile: <a href="https://www.linkedin.com/company/education-4-ol">https://www.linkedin.com/company/education-4-ol</a>'
      };


      //sending whatsapp
      const request = require('request');
      const my_apikey = "7DSIVLYJC9QVCVH06SVQ";
      const destination ="91"+req.body.contact.slice(-10);
      const message = 'Dear ' + req.body.name +' 🧑‍🎓'+ ',\nCongratulations ! Our tech team is happy with your skill set and projects mentioned in the internship application . We are really happy to onboard you as an Intern. Please read the Email send to you carefully and Reply As soon as possible. \n\n*Note : for any queries feel free to contact us on +91 8766742410 (whatsapp Here) or email : hr.education4ol@gmail.com. \n\nRegards,\nRohit Kale\nHR Team , Education4ol \nPowered by UpClick Labs Pvt. Ltd.\nWebsite: www.education4ol.in \nLinkedin profile: https://www.linkedin.com/company/education-4-ol  '
      const api_url = "http://panel.rapiwha.com/send_message.php";
      const url = `${api_url}?apikey=${encodeURIComponent(my_apikey)}&number=${encodeURIComponent(destination)}&text=${encodeURIComponent(message)}`;

      request(url, function (error, response, body) {
        if (error) {
          console.error(error);
        } else {
          const my_result_object = JSON.parse(body);
          console.log(`Result: ${my_result_object.success}`);
          console.log(`Description: ${my_result_object.description}`);
          console.log(`Code: ${my_result_object.result_code}`);
        }
      });








      //sending SMS
      var unirest = require("unirest");
      var sms_req = unirest("POST", "https://www.fast2sms.com/dev/bulkV2");

      sms_req.headers({
        "authorization": "tl4vJzuUZL7cYe90DNgKoRFqynaP6X2WpTshmQdkxbSwAHC5iEEQ4WOiKhnoeqjIHdZkgBNR2PXL19ra",
        "Content-Type": "application/json"
      });

      sms_req.form({
        "sender_id": "UPCLIK",
        "message": "149356",
        "variables_values": req.body.name,
        "route": "dlt",
        "numbers": req.body.contact,
      });

      sms_req.end(function (res) {

        console.log(res.body);
      });

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
    else if (action === "selected") {
      let v = Math.floor(1000 + Math.random() * 9000);
      var val = await uniq(v);
      console.log(val);

      Interninfo_final.updateOne({ ApplicationID: applyid }, { Accepted: "Yes", Selected: "Yes", InternID: val, Status: "Active" }, function (err, result) {
        if (err) {
          res.send(err);
        }

        Interninfo_final.find({}, function (err, one_detail) {
          if (err) {
            console.log("something went wrong!!!")
          } else {


            //sending whastapp
            //sending whatsapp
      const request = require('request');
      const my_apikey = "7DSIVLYJC9QVCVH06SVQ";
      const destination = "91"+req.body.contact.slice(-10);
      const message ='Dear ' + req.body.name +' 🧑‍🎓'+ ',\n\nWe are glad to inform that you have cleared your interview and you have been selected as an intern at Education4ol.\nWe are looking forward to the best in you throughout this learning experience\n\n 👨‍💻Intern ID :' + val + '\n\nAll the very best for your future endeavors 🙌. \n\nRegards,\nEducation4ol \nPowered by UpClick Labs '
      const api_url = "http://panel.rapiwha.com/send_message.php";
      const url = `${api_url}?apikey=${encodeURIComponent(my_apikey)}&number=${encodeURIComponent(destination)}&text=${encodeURIComponent(message)}`;

      request(url, function (error, response, body) {
        if (error) {
          console.error(error);
        } else {
          const my_result_object = JSON.parse(body);
          console.log(`Result: ${my_result_object.success}`);
          console.log(`Description: ${my_result_object.description}`);
          console.log(`Code: ${my_result_object.result_code}`);
        }
      });
      const htmlTemplate = `
      <html>
        <head>
          <style>
            /* Add CSS styles here */
          </style>
        </head>
        <body>
          <h1>Congratulations!</h1>
          <p>Dear ${req.body.name},</p>
          <p>We are glad to inform you that you have been selected as an intern at Education4ol.</p>
          <p>Intern ID: ${val}</p>
          <p>All the very best for your future endeavors.</p>
          <p>Regards,<br>Education4ol<br>Powered by UpClick Labs</p>
        </body>
      </html>
    `;

            //sending mail		  
            var mailOptions = {
              from: 'hr.education4ol@gmail.com',
              to: req.body.email,
              subject: 'Congratulations! You have been selected.',
              // text: 'Dear ' + req.body.name + ',\nWe are glad to inform that you have cleared your interview and you have been selected as an intern at Education4ol.\nWe are looking forward to the best in you throughout this learning experience\n\n Intern ID :' + val + '\n\nAll the very best for your future endeavors. \n\nRegards,\nEducation4ol \nPowered by UpClick Labs \n\nWebsite: www.education4ol.com \nLinkedin profile: https://www.linkedin.com/company/education-4-ol  '
              html:htmlTemplate
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
    } else if (action === "rejected") {

       //sending whatsapp
       const request = require('request');
       const my_apikey = "7DSIVLYJC9QVCVH06SVQ";
       const destination = "91"+req.body.contact.slice(-10);
       const message ='Hi ' + req.body.name +" 😥 "+ ',\n\nApplication Rejected ⛔ \n\nThank you for applying to our internship program. We have chosen other candidates whose qualifications better match our needs. Your resume will be kept on file for future opportunities. If you have any queries please feel free to drop a text at +91 8766742410 (whatsapp)\n\nCheers 🤝! \n\nRohit Kale (HR Team) \nEducation4ol | Powered by UpClick Labs \nwww.education4ol.in'
       const api_url = "http://panel.rapiwha.com/send_message.php";
       const url = `${api_url}?apikey=${encodeURIComponent(my_apikey)}&number=${encodeURIComponent(destination)}&text=${encodeURIComponent(message)}`;
 
       request(url, function (error, response, body) {
         if (error) {
           console.error(error);
         } else {
           const my_result_object = JSON.parse(body);
           console.log(`Result: ${my_result_object.success}`);
           console.log(`Description: ${my_result_object.description}`);
           console.log(`Code: ${my_result_object.result_code}`);
         }
       });

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
    }else if(action==="remind") {

      //sending mail		  
      var mailOptions = {
        from: 'hr.education4ol@gmail.com',
        to: req.body.email,
        subject: 'Urgent: Final call, Need Action on application!',
        text: 'Dear ' + req.body.name + ',\nWe wanted to follow up on your internship application with our company. We have received a high volume of applications, and time is running out. We believe you would be a great fit, but we need to hear back from you ASAP. If you are still interested, please let us know by replying "YES" or if not with "NO". We need to make our decisions soon, so we appreciate your urgent response. \n\n*Note : for any queries feel free to contact us on +91 8766742410 (whatsapp) or email : hr.education4ol@gmail.com. \n\nRegards,\nHR Team , Education4ol \nPowered by UpClick Labs Pvt. Ltd.\nWebsite: www.education4ol.in \nLinkedin profile: https://www.linkedin.com/company/education-4-ol  '
      };


      //sending whatsapp
      const request = require('request');
      const my_apikey = "7DSIVLYJC9QVCVH06SVQ";
      const destination ="91"+req.body.contact.slice(-10);
      const message = 'Hey ' + req.body.name +' 🧑‍🎓'+ '\n\nFinal Call , Action needed ⏰\n\nWe wanted to follow up on your internship application with our company. We have received a high volume of applications, and time is running out. We believe you would be a great fit, but we need to hear back from you as soon as possible. If you are still interested, please let us know by replying "YES" or if not with "NO". We need to make our decisions soon, so we appreciate your urgent response.\n\nRegards,\nRohit Kale\nHR Team , Education4ol \nPowered by UpClick Labs Pvt. Ltd.\nwww.education4ol.in'
      const api_url = "http://panel.rapiwha.com/send_message.php";
      const url = `${api_url}?apikey=${encodeURIComponent(my_apikey)}&number=${encodeURIComponent(destination)}&text=${encodeURIComponent(message)}`;

      request(url, function (error, response, body) {
        if (error) {
          console.error(error);
        } else {
          const my_result_object = JSON.parse(body);
          console.log(`Result: ${my_result_object.success}`);
          console.log(`Description: ${my_result_object.description}`);
          console.log(`Code: ${my_result_object.result_code}`);
        }
      });



      //sending mail	   	
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
          return res.redirect('/dashboard_new_hiring');

        }
      });

    }else if(action==="payment") {

       //sending mail		  
       var mailOptions = {
        from: 'hr.education4ol@gmail.com',
        to: req.body.email,
        subject: 'Payment Link Initated',
        text: 'Dear ' + req.body.name + ',\nThankyou for the confirmation. To proceed with the next step, we kindly request you to make a payment of 750/- as the certification fee. This fee will be utilized for digitalization of your Certificates and Letter of Recommendation (LOR).\n\n Please click on the following link to make the payment: https://app.education4ol.in/payment/user \n\nOnce the payment is successfully made, please reply as "Payment Done" to initate the process for Offer Letter. \n\n*Note : for any queries feel free to contact us on +91 8766742410 (whatsapp) or email : hr.education4ol@gmail.com. \n\nRegards,\nHR Team , Education4ol \nPowered by UpClick Labs Pvt. Ltd.\nWebsite: www.education4ol.in \nLinkedin profile: https://www.linkedin.com/company/education-4-ol  '
      };


      //sending whatsapp
      const request = require('request');
      const my_apikey = "7DSIVLYJC9QVCVH06SVQ";
      const destination ="91"+req.body.contact.slice(-10);
      const message = 'Hey ' + req.body.name +' 👨‍💻'+ '\n\nThankyou for the confirmation. To proceed with the next step, we kindly request you to make a payment of 750/- as the certification fee. This fee will be utilized for digitalization of your Certificates and Letter of Recommendation (LOR).\n\n Please click on the following link to make the payment: https://app.education4ol.in/payment/user \n\nOnce the payment is successfully made, please reply as "Payment Done" to initate the process for Offer Letter 📜. \n\nRohit Kale\n+918766742410\nHR Team , Education4ol'
      const api_url = "http://panel.rapiwha.com/send_message.php";
      const url = `${api_url}?apikey=${encodeURIComponent(my_apikey)}&number=${encodeURIComponent(destination)}&text=${encodeURIComponent(message)}`;

      request(url, function (error, response, body) {
        if (error) {
          console.error(error);
        } else {
          const my_result_object = JSON.parse(body);
          console.log(`Result: ${my_result_object.success}`);
          console.log(`Description: ${my_result_object.description}`);
          console.log(`Code: ${my_result_object.result_code}`);
        }
      });



      //sending mail	   	
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
          return res.redirect('/dashboard_new_hiring');

        }
      });





    } else {

      Interninfo_final.updateOne({ ApplicationID: applyid }, { Rejected: "Yes" }, function (err, result) {
        return res.redirect('/dashboard_new_hiring');
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