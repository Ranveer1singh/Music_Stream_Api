const mongoose = require("mongoose");

const connect = () => {
  mongoose.connect("mongodb://127.0.0.1:27017/music_app");

  const db = mongoose.connection;
  db.on(
    "error",
    console.error.bind(console, "MongoDB Connection Not Established")
  );

  db.once("open", () => {
    console.log("Connected to data base");
  });
};

module.exports = { connect };
