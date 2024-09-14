const apiError = require("../utils/apiError");

 const isLoggedIn =  (req, res, next)=>{
    try {
       if (req.isAuthenticated()) return next();
       else res.status(400).json({
           message : "User is not logged in ",
       })
 } catch (error) {
    return res.status(500).json(new apiError(500, {}, "Iss Loggedin Failed"))
 }
};
    
module.exports= {isLoggedIn}