const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const nodemailer = require('nodemailer');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const session = require('express-session');

const User = require("./models/user");
const Interninfo_final = require("./models/Interinfo");
const Payment_save = require("./models/payment_history");
const refral = require("./models/refral");
const task = require("./models/task");
const task_storage = require("./models/task_storage");

const app = express();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/tempfile')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
});
const upload = multer({ storage: storage });

// Configure Cloudinary
cloudinary.config({ 
  cloud_name: 'education4ol', 
  api_key: '438746385353451', 
  api_secret: 'O9_8y7hKmkkUDo6-gqIO2lBg4zw' 
});

// Connect to MongoDB
mongoose.connect("mongodb+srv://audumber:Ramdas3000@cluster0-bj3vd.mongodb.net/Dashboard?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
});

// Middleware setup
app.use(methodOverride("_method"));
app.use(flash());
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));

// Session middleware configuration
app.use(session({
  secret: 'Once again Rusty wins cutest dog!', // Replace with your own secret key
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Set to true if you're using https
}));

// Initialize Passport and use session for persistent login sessions
app.use(passport.initialize());
app.use(passport.session());

// Passport configuration
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Static file serving middleware
app.use(express.static("public"));

// Routes
const account_details = require('./routes/demo');
const assign_upload = require('./routes/assign_upload');
const intern_details = require('./routes/intern_details');
const intern_hiring = require('./routes/intern_hiring');
const hrdashboard_hiring = require('./routes/hrdashboard_hiring');
const auth_hiring = require('./routes/authentication');
const communication = require('./routes/communication');

app.use("/", account_details);
app.use("/", assign_upload);
app.use("/", intern_details);
app.use("/", intern_hiring);
app.use("/", hrdashboard_hiring);
app.use("/", auth_hiring);
app.use("/", communication);

// Additional routes
app.get("/instagram", (req, res) => {
  res.render("instagram");
});

app.get("/hrdashboard", isLoggedIn, async (req, res) => {
  try {
    const one_detail = await Interninfo_final.find({});
    const audu = one_detail.length;
    let selected = 0, rejected = 0, completed = 0;

    one_detail.forEach(detail => {
      if (detail.Selected == "Yes") selected++;
      if (detail.Rejected == "Yes") rejected++;
      if (detail.Completed == "Yes") completed++;
    });

    res.render("hrdashboard", { selected, rejected, completed, total: audu });
  } catch (err) {
    console.log("something went wrong!!!", err);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/hrdashboard_Interndetail", isLoggedIn, async (req, res) => {
  try {
    const one_detail = await Interninfo_final.find({});
    res.render("Intern_Details/dashboard_Interndetail", { intern: one_detail });
  } catch (err) {
    console.log("something went wrong!!!", err);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/hrdashboard_Interndetail", isLoggedIn, async (req, res) => {
  try {
    const one_detail = await Interninfo_final.find({ Session: req.body.customRadio });
    res.render("Intern_Details/dashboard_Interndetail", { intern: one_detail });
  } catch (err) {
    console.log("something went wrong!!!", err);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/dashboard_assignedetail", isLoggedIn, async (req, res) => {
  try {
    const one_detail = await Interninfo_final.find({ Selected: "Yes", Completed: "No" });
    const task1 = await task.find({ status: "Active" });
    const tasks = await task_storage.find({});
    res.render("dashboard_assignmentdetails", { intern: one_detail, task1, tasks });
  } catch (err) {
    console.log("something went wrong!!!", err);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/intern_profile", async (req, res) => {
  try {
    const one_detail = await Interninfo_final.find({ InternID: req.body.internid });
    res.render("portal_intern/Profile", { intern: one_detail });
  } catch (err) {
    console.log("something went wrong!!!", err);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/intern_messager", (req, res) => {
  res.render("portal_intern/messanger");
});

app.get("/assignment_display", (req, res) => {
  res.render("portal_intern/assignment_display");
});

app.get("/intern_portal", (req, res) => {
  res.render("portal_intern/dashboard_ID");
});

app.get("/intern_activity", async (req, res) => {
  try {
    const one_detail = await Interninfo_final.find({ InternID: req.body.intern_id });
    res.render("portal_intern/intern_activity", { intern: one_detail });
  } catch (err) {
    console.log("something went wrong!!!", err);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/dashboard_report", isLoggedIn, (req, res) => {
  res.render("dashboard_reports");
});

app.get("/Education4ol/refral/Harsha", (req, res) => {
  res.render("ref1");
});

app.get("/edu_intern_verify", (req, res) => {
  res.render("verify");
});

app.get("/certi", (req, res) => {
  res.render("discertify");
});

app.post("/edu_intern_verify", async (req, res) => {
  try {
    const user_details = await certify.find({ certid: req.user.certid });
    res.render("user_Setting/show_user", { user_details });
  } catch (err) {
    console.log("something went wrong!!!", err);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/payment_report", async (req, res) => {
  try {
    const data = await Payment_save.find({});
    res.render("ref1", { payment: data });
  } catch (err) {
    console.log("something went wrong!!!", err);
    res.status(500).send("Internal Server Error");
  }
});

// Middleware to check if user is authenticated
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error_msg", "OOPS!! Entered credentials are incorrect!");
  res.redirect("/login");
}



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
