const {userModel} = require("../models/user.model");
const apiError = require("../utils/apiError");
const apiResponse = require('../utils/apiResponse')
// passport js setup
const passport = require("passport");
var localStrategy = require("passport-local").Strategy;
passport.use(new localStrategy(userModel.authenticate()));

exports.registerUser = (req, res) => {
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

exports.login = (req, res, next) =>{
  passport.authenticate("local", (err, user, info) =>{
    if(err){
      return next(err);
    }
    if(!user){
      return res.status(404).json({message : "user not found"})
      // return res.status(404).json(new apiError(404,"user not found"))
    }

    req.logIn(user, (err) =>{
      if(err){
        return next(err)
      }
      return res.status(200).json(new apiResponse(200,user,"User Login Successfully"))
    })
  })(req, res, next);
} 