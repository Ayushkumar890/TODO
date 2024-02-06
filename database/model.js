const mongoose = require("mongoose");

const userschema = new mongoose.Schema({
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

exports.User = mongoose.model("User", userschema);