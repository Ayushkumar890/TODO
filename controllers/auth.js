// const { LoginUser } = require("../database/model");
// const bodyParser = require("body-parser");
// const axios = require("axios");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// const sgMail = require("@sendgrid/mail");
// const crypto = require("crypto");
// const cookieParser = require("cookie-parser");
// const mongoose = require("mongoose");

// exports.getIndex = (req, res) => {
//   res.render("index");
// };

// exports.getRegister = (req, res) => {
//   res.render("register");
// };

// exports.getLogin = (req, res) => {
//   res.render("login");
// };

// exports.postRegister = async (req, res) => {
//   const { email, linkedin, password1, password2, accountType } = req.body;

//   // checking if name or email already exists in the database
//   const userExists = await LoginUser.findOne({ email: email });
//   try {
//     if (password1 !== password2) {
//       res.render("register", {
//         message: "Passwords don't match!",
//         color: "red",
//       });
//     } else if (password1.length < 8) {
//       res.render("register", {
//         message: "Password is too short",
//         color: "red",
//       });
//     } else {
//       if (!userExists) {
//         hashedPass = await bcrypt.hash(password1, 10);
//         const token = crypto.randomBytes(32).toString("hex");

//         //   const photo = "/assets/images/client.jpg";
//         await LoginUser.create({
//           email: email,
//           password: hashedPass,
//           verification_token: token,
//           // photo: photo,
//         });

//         verification_link = `http://localhost:3000/verify/${token}`;
//         // verification_link = `https://techack-devlance.onrender.com/verify/${token}`;
//         const message = {
//           to: email,
//           from: "Thexitingway@gmail.com",
//           subject: "DevLance Verification!",
//           text: `Verify your account here (paste link on browser if not clickabl)\n \n ${verification_link} \n\n Thanks For Choosing Devlance! \n Team, The Xiting Way`,
//         };
//         await sgMail
//           .send(message)
//           .then((response) => console.log("Email sent!"))
//           .catch((error) => console.log(error.message));
//         res.redirect("login?message=Email Sent! Verify to login.&color=green");
//       } else {
//         res.render("register", {
//           message: "User with similar data already exists!",
//           color: "red",
//         });
//       }
//     }
//   } catch (e) {
//     console.log(e);
//     res.send("Something Went Wrong!");
//   }
// };

// exports.verifyToken = async (req, res) => {
//   try {
//     const user = await devlancer.findOneAndUpdate(
//       { verification_token: req.params.token },
//       { $set: { verified: true } }
//     );
//     res.redirect(
//       "/login?message=Account Verified! You can login now.&color=green"
//     );
//   } catch (e) {
//     console.log(e);
//     res.send("<h1>Something Went Wrong!</h1>");
//   }
// };

// exports.postLogin = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const current_user = await devlancer.findOne({
//       $or: [{ email: email }, { password: password }],
//     });
//     if (!current_user) {
//       res.render("login", {
//         message: "Account doesn't exist! check entered credentials.",
//         color: "red",
//       });
//     } else if (!current_user.verified) {
//       res.render("login", {
//         message: "Account not Verified! check email and verify before login.",
//         color: "red",
//       });
//     } else {
//       const passCheck = await bcrypt.compare(
//         req.body.password,
//         current_user.password
//       );
//       if (passCheck) {
//         const token = jwt.sign(
//           { email: current_user.email, _id: current_user._id },
//           process.env.JWT_SECRET
//         );
//         res.cookie("token", token, {
//           httpOnly: true,
//           expires: new Date(Date.now() + 8 * 3600000), //8 hours
//         });
//         res.redirect("/");
//       } else {
//         res.render("login", { message: "Invalid Password!", color: "red" });
//       }
//     }
//   } catch (e) {
//     console.log(e);
//     res.render("login", { message: "Invalid Credentials!", color: "red" });
//   }
// };

// // exports.logout = (req, res) => {
// //   res.cookie("token", null, {
// //     httpOnly: true,
// //     expires: new Date(Date.now()), //deleting cookies now
// //   });
// //   res.redirect("login");
// // };
