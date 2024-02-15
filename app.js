const express = require("express");
const { response } = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const multer = require("multer");
const bodyParser = require("body-parser");
const axios = require("axios");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sgMail = require("@sendgrid/mail");
const crypto = require("crypto");
const cookieParser = require("cookie-parser");
const { User, LoginUser } = require("./database/model.js");

require("dotenv").config();
const { Template } = require("ejs");

const app = express();
const port = process.env.PORT || 3000;

const API_KEY = process.env.SENDGRID_API_KEY;
sgMail.setApiKey(API_KEY);
// Connect to MongoDB

const db = require("./database/db_config.js");
db();

//   middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// set Template engine
app.set("view engine", "ejs");
app.use(express.static("Public"));

// app.use(
//   session({
//     secret: "my secret key",
//     saveUninitialized: true,
//     resave: false,
//   })
// );

// app.use((req, res, next) => {
//   res.locals.message = req.session.massage;
//   delete req.session.massage;
//   next();
// });

// insert user in a database

app.post("/adduser", async (req, res) => {
  try {
    // Find the currently logged-in user
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const loginUser = await LoginUser.findById(decoded._id);

    // Create the task 
    await User.create({
      task: req.body.task,
      title: req.body.title,
      date: req.body.date,
      day: req.body.day,
      time: req.body.time,
      email: loginUser.email, 
    });

    // Redirect to the homepage after successful 
    req.session.message = {
      type: "success",
      message: "Task added successfully!",
    };
    res.redirect("/task");
  } catch (error) {
    // Handling errors 
    console.error("Error adding task:", error);
    res.status(500).send("Error adding task");
  }
});


const userExists = (req, res, next) => {
  const token = req.cookies.token;
  console.log(token);
  if (token) {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const the_user = LoginUser.findById(decoded._id);
    next();
  } else {
    res.render("login");
  }
};

const {
  getRegister,
  postRegister,
  getIndex,
  getLogin,
  postLogin,
  logout,

} = require("./controllers/auth");
const { use } = require("passport");

app.get("/", getIndex);

app.post("/register", postRegister);

app.get("/register", getRegister);

app.post("/register", postRegister);

app.get("/login", getLogin);

app.post("/login", postLogin);

app.get("/logout", logout);


app.get("/task", userExists, async (req, res) => {
  try {
    // Find the currently logged-in user
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const loginUser = await LoginUser.findById(decoded._id).exec();

    // Fetch all the tasks from the database
    
    const users = await User.find();

    res.render("index", { title: "Home", users: users, loginUser: loginUser });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).send("Error fetching tasks");
  }
});

app.get("/adduser", (req, res) => {
  res.render("user_add", { title: "Add User" });
});

app.get("/about", (req, res) => {
  res.render("about", { title: "about" });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
