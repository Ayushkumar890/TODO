const { LoginUser } = require("../database/model");
const bodyParser = require("body-parser");
const axios = require("axios");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sgMail = require("@sendgrid/mail");
const crypto = require("crypto");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");

exports.getIndex = (req, res) => {
  res.render("home");
};

exports.getRegister = (req, res) => {
  res.render("register");
};

// POST__REGISTER

exports.postRegister = async (req, res) => {
  const { email, password1, password2, name } = req.body;

  // checking if name or email already exists in the database
  const userExists = await LoginUser.findOne({ email: email });
  try {
    if (password1 !== password2) {
      res.render("register", {
        message: "Passwords don't match!",
        color: "red",
      });
    } else if (password1.length < 6) {
      res.render("register", {
        message: "Password is too short",
        color: "red",
      });
    } else {
      if (!userExists) {
        hashedPass = await bcrypt.hash(password1, 10);
        const token = crypto.randomBytes(32).toString("hex");

        //   const photo = "/assets/images/client.jpg";
        await LoginUser.create({
          name: name,
          email: email,
          password: hashedPass,
          verification_token: token,
        });

        verification_link = `http://localhost:3000/verify/${token}`;

        const message = {
          to: email,
          from: "Thexitingway@gmail.com",
          subject: "TODO Verification!",
          text: `Verify your account here (paste link on browser if not clickabl)\n \n ${verification_link} \n\n Thanks For Choosing our platform! \n Team, The Xiting Way`,
        };
        await sgMail
          .send(message)
          .then((response) => console.log("Email sent!"))
          .catch((error) => console.log(error.message));
        res.redirect("login?message=Email Sent! Verify to login.&color=green");
      } else {
        res.render("register", {
          message: "User with similar data already exists!",
          color: "red",
        });
      }
    }
  } catch (e) {
    console.log(e);
    res.send("Something Went Wrong!");
  }
};

// VERIFY TOKEN

exports.verifyToken = async (req, res) => {
  try {
    const user = await LoginUser.findOneAndUpdate(
      { verification_token: req.params.token },
      { $set: { verified: true } }
    );
    res.redirect(
      "/login?message=Account Verified! You can login now.&color=green"
    );
  } catch (e) {
    console.log(e);
    res.send("<h1>Something Went Wrong!</h1>");
  }
};

// GET__LOGIN

exports.getLogin = async (req, res) => {
  const token = await req.cookies.token;
  console.log(token);
  if (token) {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    const the_user = await LoginUser.findById(decoded._id);
    res.redirect("/task");
  } else {
    res.render("login", { message: req.query.message, color: req.query.color });
  }
};

// POST__LOGIN

exports.postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const current_user = await LoginUser.findOne({
      $or: [{ email: email }, { password: password }],
    });
    if (!current_user) {
      res.render("login", {
        message: "Account doesn't exist! check entered credentials.",
        color: "red",
      });
    } else if (!current_user.verified) {
      res.render("login", {
        message: "Account not Verified! check email and verify before login.",
        color: "red",
      });
    } else {
      const passCheck = await bcrypt.compare(
        req.body.password,
        current_user.password
      );
      if (passCheck) {
        const token = jwt.sign(
          { email: current_user.email, _id: current_user._id },
          process.env.JWT_SECRET
        );
        res.cookie("token", token, {
          httpOnly: true,
          expires: new Date(Date.now() + 4 * 3600000), //4 hours
        });
        res.redirect("/task");
      } else {
        res.render("login", { message: "Invalid Password!", color: "red" });
      }
    }
  } catch (e) {
    console.log(e);
    res.render("login", { message: "Invalid Credentials!", color: "red" });
  }
};
