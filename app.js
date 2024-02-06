const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const session = require("express-session");
// const { Template } = require("ejs");
const router = require("./routes/routes");

const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB

const db = require("./database/db_config.js");
db();

// create a user model
const User = require("./database/model");


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

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});