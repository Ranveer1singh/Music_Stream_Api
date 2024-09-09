 const isLoggedIn = (req, res, next)=>{
    if (req.IsAuthenticate()) return next();
    else res.status(400).json({
        message : "User is not logged in ",
    })
};
    
module.exports= {isLoggedIn}