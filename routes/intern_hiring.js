
var express = require("express"),
	mongoose = require("mongoose"),

	bodyParser = require("body-parser"),


	methodOverride = require("method-override")

var nodemailer = require('nodemailer');
var flash = require("connect-flash");
var multer = require('multer');
var cloudinary = require('cloudinary').v2; //media upload
var Interninfo_final = require("../models/Interinfo");
var date = require('date-and-time');
var now = new Date();
const pattern = date.compile('ddd, MMM DD YYYY');


const router = express.Router();


var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, './public/tempfile')
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname)
	}
})
var upload = multer({ storage: storage })


cloudinary.config({
	cloud_name: 'education4ol',
	api_key: '438746385353451',
	api_secret: 'O9_8y7hKmkkUDo6-gqIO2lBg4zw'
});

var fs = require('fs');








// const Interninfo_final = mongoose.model('Interinfo_final', Interninfo);

var transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: 'hr.education4ol@gmail.com',
		pass: 'lwhxbrweilsirofg'
	}
});



router.get("/intern_application", function (req, res) {


	res.render("Intern_Hiring/application");
});



router.post("/intern_application", function (req, res) {
	let today = new Date().toLocaleDateString()

	console.log(today)
	var val = Math.floor(1000 + Math.random() * 9000);
	var applyID = val + today;

	//sending whatsapp
	const request = require('request');
	const my_apikey = "7DSIVLYJC9QVCVH06SVQ";
	const destination = "91" + req.body.contact.slice(-10);
	const message = 'Dear ' + req.body.name + ' 🧑‍🎓' + ',\n\nWe have received your application and appreciate the time and effort you put into it.Our team will carefully review your application for the internship position.\n\nWe will notify you of the status of your application within 24 to 48 hrs throught whatsapp , SMS and Email. Stay tuned ! \n\nRegards,\nHR Team , Education4ol \nPowered by UpClick Labs Pvt. Ltd.\nWebsite: www.education4ol.in \nLinkedin profile: https://www.linkedin.com/company/education-4-ol  '
	const api_url = "http://panel.rapiwha.com/send_message.php";
	const url = `${api_url}?apikey=${encodeURIComponent(my_apikey)}&number=${encodeURIComponent(destination)}&text=${encodeURIComponent(message)}`;

	// request(url, function (error, response, body) {
	// 	if (error) {
	// 		console.error(error);
	// 	} else {
	// 		const my_result_object = JSON.parse(body);
	// 		console.log(`Result: ${my_result_object.success}`);
	// 		console.log(`Description: ${my_result_object.description}`);
	// 		console.log(`Code: ${my_result_object.result_code}`);
	// 	}
	// });
	var mailOptions = {
		from: 'Education4ol (UpClick Labs)',
		to: req.body.email,
		subject: 'Thank you for applying at Education4ol (UpClick Labs)',
		text: 'Dear ' + req.body.name + ',\nWe appreciate your interest in internship at Education4ol (Upclick Labs Pvt. Ltd.).Thank you for giving us your valuable time.\n\nPlease cross verify your details given below for smooth interview and onboarding process \n\n Email : ' + req.body.email + '\n Contact number : ' + req.body.contact + '\n\nOur HR team will soon be connecting with you for further process. Please Keep an eye on Mails.\n\n*Note:If Nobody contacts you within 3 working days then please contact +91 8766742410. \n\nRegards,\nEducation4ol \nPowered by UpClick Labs  \n\nWebsite: www.education4ol.in \nLinkedIn profile: https://www.linkedin.com/company/education-4-ol  '
	};




	transporter.sendMail(mailOptions, function (error, info) {
		if (error) {
			console.log(error);
		} else {
			console.log('Email sent: ' + info.response);

			//saving to database
			// 	    mongoose.connect("mongodb+srv://audumber:Ramdas3000@cluster0-bj3vd.mongodb.net/Dashboard?retryWrites=true& w=majority");
			var InternSession = "Sep2021"  //Change
			Interninfo_final.create({
				Name: req.body.name, Contact: req.body.contact, Email: req.body.email, Internship: req.body.intern, CollegeName: req.body.clgname, CollegeState: req.body.clgstate, CollegeCity: req.body.clgcity, Qualification: req.body.qualification, ApplicationID: applyID, Accepted: "No", Selected: "No", Rejected: "No", Completed: "No", Year: req.body.clgyear, Skills: req.body.skills, ApplyDate: today, Session: InternSession, InternID: "No", Task1: "No", Task2: "No", Task3: "No", Task4: "No",



				Status: "Inactive",
				profile_img: "",
			}, function (err, small) {

				if (err) {
					console.log("somthing went wrong!!")
				}
				// res.render("Intern_Hiring/welcome" , {email:req.body.email});
				res.render("portal_intern/uploadphoto", { email: req.body.email });
			});
		}
	});

});


//---upload profile image--------------------------------------------------------------------------------

router.get("/upload_image", function (req, res) {
	res.render("portal_intern/uploadimage");
});


router.post("/upload_image", upload.single('profile'), async function (req, res) {

	var filname = req.file.filename;
	console.log(req.body.mail);


	// console.log(JSON.stringify(req.file))
	var path = './public/tempfile/' + filname;
	var audu = await cloudinary.uploader.upload(path, {
		folder: 'profile pictures',
		use_filename: true
	}, function (error, result) {


		fs.readdirSync('./public/tempfile').forEach(file => {
			var path = './public/tempfile/' + filname;
			console.log(path);

			//responsible for deleting file
			fs.unlink(path, function (err) {

				if (err) {
					console.log("eroor in deleting");
				}

			});
		});
	})

	console.log(audu);

	Interninfo_final.updateMany({ Email: req.body.mail }, { profile_img: audu.url }, function (err, result) {
		if (err) {
			console.log(err);
			res.render("./assign_upload/not-welcome");
		}

		res.render("Intern_Hiring/welcome");
	});






});





//---------------------------------------------------------------- upload image with intern id
router.post("/upload_image1", upload.single('profile'), async function (req, res) {

	var filname = req.file.filename;
	console.log(req.body.mail);


	// console.log(JSON.stringify(req.file))
	var path = './public/tempfile/' + filname;
	var audu = await cloudinary.uploader.upload(path, {
		folder: 'profile pictures',
		use_filename: true
	}, function (error, result) {


		fs.readdirSync('./public/tempfile').forEach(file => {
			var path = './public/tempfile/' + filname;
			console.log(path);

			//responsible for deleting file
			fs.unlink(path, function (err) {

				if (err) {
					console.log("eroor in deleting");
				}

			});
		});
	})

	console.log(audu);
	console.log(req.body.internid);

	Interninfo_final.updateMany({ InternID: req.body.internid }, { profile_img: audu.url }, function (err, result) {
		if (err) {
			console.log(err);
			res.render("./assign_upload/not-welcome");
		}

		res.render("Intern_Hiring/welcome3");
	});
	//---------------------------------------------------------------------------





});






module.exports = router;