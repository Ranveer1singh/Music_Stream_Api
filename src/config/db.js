const mongoose = require("mongoose");

const connect = (URL) => {
  try {
    
    mongoose.connect(URL);
  
    const db = mongoose.connection;
    db.on(
      "error",
      console.error.bind(console, "MongoDB Connection Not Established")
    );
  
    db.once("open", () => {
      console.log("Connected to data base");
    });
  } catch (error) {
    console.log("error", error);
    
  }
};

module.exports = { connect };
