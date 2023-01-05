
var express               = require("express"),
mongoose              = require("mongoose"),

bodyParser            = require("body-parser"),


methodOverride  = require("method-override")

var nodemailer = require('nodemailer');
var flash = require("connect-flash");

var multer  = require('multer');
var cloudinary = require('cloudinary').v2; //media upload
var interinfo = require('../models/Interinfo');
var certificate = require("../models/certificate")
var query = require('../models/query');
const { constants } = require("fs");
const { Certificate } = require("crypto");
const Email = require("./email_templating");

const router = express.Router();


//sending bulk mail0-------------------------
router.get("/marketing" , function(req,res){
    res.render('communication/marketing_tool');
})




 

router.post("/email" , async function(req,res){
    
    
    if(req.body.people == "all"){
        data =await interinfo.find({},function(req,res,err){
            if (err){
                console.log("Error while sending the email....")
            }
        });
        Email.bulk_email(data , req.body.sub , req.body.email); 

    }else if(req.body.people == "applied"){

    }else if(req.body.people == "selected"){

    }
})

//--------------------------feting all interns
const search_results = [];
interinfo.find({},function(req,res){
     for(var i = 0 ; i<res.length ; i++){
            search_results.push(res[i].Name);
            search_results.push(res[i].InternID);
        }
        });



//----------------------------routers

router.get("/certificate/request" , async function(req,res){
  var allcert = await certificate.find({});
    res.render('certificate' , {certificate:allcert});
})

router.get("/ticket" ,async function(req,res){
    
    let allquery = await query.find({status: 'Open'});
   
    console.log(allquery);
    res.render('dashboard_activity' , {allquery :allquery});
})

router.post("/modify/ticket" , async function(req,res){

   let da =  await query.findOneAndUpdate({_id :req.body.doc_id} , {status:"closed"})


    res.redirect("/ticket");
})


router.get("/communication" ,function(req,res){
    res.render('communication/whatsapp' , {Results:search_results , found : ""});
});

router.post('/communication/find' , async function(req,res){

    var search = req.body.myCountry;
    

    if(isNaN(search)){
    console.log("find name");
    var f1 = "";    
    let result_1 = await  interinfo.find({Name:search} , function(err,res){
        if(err){
            console.log("problem in fetching data");
        }
        f1 = res;
        
      });
      console.log(f1);
      res.render('communication/whatsapp',{Results:search_results , found : f1});
    
    
    }else{
        console.log("find id");
        
       var f2 = "";
       let result_2 = await interinfo.find({InternID:search} , function(err,res){
          if(err){
              console.log("problem in fetching data")
          }
          f2 = res;
         
        });
        console.log(f2)
        res.render('communication/whatsapp' , {Results:search_results , found : f2 });
    }

// res.render('communication/whatsapp');



})










module.exports =router;