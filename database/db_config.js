const mongoose = require("mongoose");

db = () => {
  mongoose
    .connect(process.env.MONGO_URI, { dbName: "CURD" })
    .then(() => {
      console.log("database connected");
    })
    .catch((e) => {
      console.log(e);
    });
};

module.exports = db;
