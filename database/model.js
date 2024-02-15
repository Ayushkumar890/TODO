const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  task: String,
  title: String,
  date: String,
  day: String,
  time: String,
  email : String,
  created: { type: Date, default: Date.now }, 
});

const schemaUser = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  login_id: String,
  // verification_token: String,
  // verified: {
  //   type: Boolean,
  //   default: false,
  // },
});

exports.User = mongoose.model("User", taskSchema); 
exports.LoginUser = mongoose.model("LoginUser", schemaUser);
