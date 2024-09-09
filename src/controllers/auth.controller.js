const {userModel} = require("../models/user.model");
const apiError = require("../utils/apiError");
const apiResponse = require('../utils/apiResponse')
// passport js setup
const passport = require("passport");
var localStrategy = require("passport-local").Strategy;
passport.use(new localStrategy(userModel.authenticate()));

exports.registerUser = async (req, res) => {
  try {
    const { username, email } = req.body;
    userModel.register(new userModel({username, email}), req.body.password)
    .then((result) =>{
        passport.authenticate("local")(req,res, ()=>{
            res.status(201).json(new apiResponse(201, result,"User register succesfully"))
        })
    });
  } catch (error) {
    console.log(error)
    res.status(500).json(new apiError(500, "internal Sever Error"));
  }
};
