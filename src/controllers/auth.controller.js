const { userModel } = require("../models/user.model");
const apiError = require("../utils/apiError");
const apiResponse = require("../utils/apiResponse");
// passport js setup
const passport = require("passport");
const errorHandler = require("../utils/errorHandling");
var localStrategy = require("passport-local").Strategy;
passport.use(new localStrategy(userModel.authenticate()));

exports.registerUser = async (req, res) => {
  try {
    const { username, email } = req.body;
    const user = await userModel.findOne({ username });
    if (user) {
      return res.status(400).json(new apiError(400, "User Already Exist"));
    }
    const registerUser = await userModel.register(
      new userModel({ username, email }),
      req.body.password
    );

    passport.authenticate("local")(req, res, () => {
      res
        .status(201)
        .json(new apiResponse(201, {}, "User register succesfully"));
    });
    // .then((result) =>{
    //     passport.authenticate("local")(req,res, ()=>{
    //         res.status(201).json(new apiResponse(201, result,"User register succesfully"))
    //     })
    // });
  } catch (error) {
    console.log(error);
    return res.status(500).json(new apiError(500, error.message));
  }
};

exports.login = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      // return res.status(404).json({message : "user not found"})
      return res.status(404).json(new apiError(404, "user not found"));
    }

    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      return res
        .status(200)
        .json(new apiResponse(200, {}, "User Login Successfully"));
    });
  })(req, res, next);
};

exports.logout = async (req, res, next) => {
  try {
    if (req.isAuthenticated()) {
      await new Promise((resolve, reject) => {
        req.logout((err) => {
          if (err) reject(err);
          else resolve();
        });
      });
      return res.status(400).json(new apiError(400, err.message));
    } else {
      return res
        .status(200)
        .json(new apiResponse(200,{}, "User Logout Successfully"));
    }
  } catch (error) {
    return res.status(500).json(new apiError(500, error.message));
  }
};
