const apiError = require("../utils/apiError")

const isAdmin = (req, res, next)=>{
try {
    if(req.user.isAdmin){
        return next();
    }else{
        return res.status(400).json(new apiError(400, {}, "Only admin can Upload the song"))
    }
} catch (error) {
    return res.status(500).json(new apiError(500, {}, "error in isadmin function "))
}
}

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
    
module.exports= {isAdmin,isLoggedIn}