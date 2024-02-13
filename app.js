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
// const router = require("./routes/routes");

const app = express();
const port = process.env.PORT || 3000;


const API_KEY = process.env.SENDGRID_API_KEY;
sgMail.setApiKey(API_KEY);
// Connect to MongoDB

const db = require("./database/db_config.js");
db();

// create a user model
// const User = require("./database/model");
// const LoginUser = require("./database/model");

//   middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// set Template engine
app.set("view engine", "ejs");
app.use(express.static("Public"));

app.use(
  session({
    secret: "my secret key",
    saveUninitialized: true,
    resave: false,
  })
);

app.use((req, res, next) => {
  res.locals.message = req.session.massage;
  delete req.session.massage;
  next();
});

// insert user in a database

app.post("/adduser", async (req, res) => {
  try {
    console.log(req.body);
    // Create a new user instance based on the request body and uploaded file
    await User.create({
      task: req.body.task,
      title: req.body.title,
      date: req.body.date,
      day: req.body.day,
      time: req.body.time,
    });

    // Redirect to the homepage after successful user addition

    req.session.message = {
      type: "success",
      message: "User added successfully!",
    };
    res.redirect("/task");
  } catch (error) {
    // Handle any errors that occur during the user addition process
    console.error("Error adding user:", error);
    res.status(500).send("Error adding user");
  }
});

const {
  getRegister,
  postRegister,
  getIndex,
  verifyToken,
  getLogin,
  postLogin,
} = require("./controllers/auth");

app.get("/", getIndex);


app.post("/register", postRegister);

app.get("/register", getRegister);

app.post("/register", postRegister);

app.get("/verify/:token", verifyToken);

app.get("/login", getLogin);

app.post("/login", postLogin);

app.get("/task", async (req, res) => {
  const users = await User.find();
  // console.log(users);
  res.render("index", { title: "Home", users: users });
});

app.get("/adduser", (req, res) => {
  res.render("user_add", { title: "Add User" });
});

app.get("/about", (req, res) => {
  res.render("about", { title: "about" });
});

// app.use("/", require("./routes/routes"));

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
