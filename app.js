const express = require("express");
// const bodyParser = require("body-parser");
// const axios = require("axios");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// const sgMail = require("@sendgrid/mail");
// const crypto = require("crypto");
// const cookieParser = require("cookie-parser");
const { response } = require("express");
const mongoose = require("mongoose");
const session = require("express-session");

require("dotenv").config();
// const { Template } = require("ejs");
const router = require("./routes/routes");

const app = express();
const port = process.env.PORT || 3000;

// const API_KEY = process.env.SENDGRID_API_KEY;
// sgMail.setApiKey(API_KEY);
// Connect to MongoDB

const db = require("./database/db_config.js");
db();

// create a user model
const User = require("./database/model");
// const LoginUser = require("./database/model");

// const {
//   getRegister,
//   postRegister,
//   getIndex,
//   verifyToken,
//   getLogin,
//   postLogin,
//   // logout,
// } = require("./controllers/auth");

//   middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// set Template engine

app.set("view engine", "ejs");
app.use(express.static("Public"));

app.use("/", require("./routes/routes"));

// app.get("/", getIndex);

// app.get("/register", getRegister);

// app.post("/register", postRegister);

// app.get("/verify/:token", verifyToken);

// app.get("/login", getLogin);

// app.post("/login", postLogin);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
