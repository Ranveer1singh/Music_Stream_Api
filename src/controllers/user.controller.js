const { userModel } = require("../models/user.model");
const apiError = require("../utils/apiError");
const apiResponse = require("../utils/apiResponse");

exports.home = async(req, res)=> {
    try {
        const User = await userModel.findOne({username:req.session.passport.user})
        res.status(200).json(new apiResponse(200, User,"User Found Succesfully"))
    } catch (error) {
     return res.status(500).json(new apiError(500, "Internal Server Error"))   
    }
}

// username:req.session.passport.user