const express = require('express')
const http = require('http');
require('dotenv').config();
const app = express();
var morgan = require("morgan")
// mongo db connection 
const db = require('./config/db');
const authRoute = require("./routes/auth.route")
const {userModel} = require('./models/user.model')
// passport set up
const passport = require("passport")
const ExpressSession = require("express-session");

// connect to data base
db.connect();

// middleWares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'))
// passport js for authentication 
app.use(ExpressSession({
    resave:false,
    saveUninitialized:false,
    secret: process.env.SecretKey || "jai_ho"
}))
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(userModel.serializeUser())
passport.deserializeUser(userModel.deserializeUser())

app.use("/api/auth", authRoute)
// create server for run application 
const Port = process.env.Port  || 3000;
const server = http.createServer(app);

server.listen(Port , (err) =>{
    try {
        if(err){
            throw new Error("Failed To start Srver: ", err);
        }
        console.log(`Server is runnig at http://localhost:${Port}`)
    } catch (error) {
        throw new Error("Internal server error", error)
    }
})