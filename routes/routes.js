const express = require("express"); // import express
const router = express(); // create router object
router.use(express.json()); // parse application/json
router.use(express.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded
const { User } = require("../database/model"); // import user model
const multer = require("multer");
const mongoose = require("mongoose");

// insert user in a database
router.post("/adduser", async (req, res) => {
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
    res.redirect("/");
  } catch (error) {
    // Handle any errors that occur during the user addition process
    console.error("Error adding user:", error);
    res.status(500).send("Error adding user");
  }
});



// router.get("/", async (req, res) => {
//   res.render("home", { title: "Home" });
// });

router.get("/task", async (req, res) => {
  const users = await User.find();
  // console.log(users);
  res.render("index", { title: "Home", users: users });
});

router.get("/adduser", (req, res) => {
  res.render("user_add", { title: "Add User" });
});

router.get("/about", (req, res) => {
  res.render("about", { title: "about" });
});

module.exports = router;
