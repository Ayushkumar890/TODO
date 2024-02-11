const mongoose = require("mongoose");

const task = new mongoose.Schema({
  task: {
    type: String,
  },
  title: {
    type: String,
  },
  time: {
    type: String,
  },
  date: {
    type: String,
  },
  day: {
    type: String,
  },
  created: {
    type: Date,

    default: Date.now,
  },
});

// const schemaUser = new mongoose.Schema({
//   name: String,
//   email: String,
//   password: String,
//   verification_token: String,
//   verified: {
//     type: Boolean,
//     default: false,
//   },
// });

exports.User = mongoose.model("User", task);
// exports.LoginUser = mongoose.model("LoginUser", schemaUser);
