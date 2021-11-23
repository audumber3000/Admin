
var express               = require("express"),
mongoose              = require("mongoose"),

bodyParser            = require("body-parser"),


methodOverride  = require("method-override")

var nodemailer = require('nodemailer');
var flash = require("connect-flash");

var multer  = require('multer');
var cloudinary = require('cloudinary').v2; //media upload
var interinfo = require('../models/Interinfo');
const { constants } = require("fs");


const router = express.Router();


//--------------------------feting all interns
const search_results = [];
interinfo.find({},function(req,res){
     for(var i = 0 ; i<res.length ; i++){
            search_results.push(res[i].Name);
            search_results.push(res[i].InternID);
        }
        });



//----------------------------routers

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