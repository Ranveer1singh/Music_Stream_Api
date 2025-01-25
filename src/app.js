const express = require('express')
const http = require('http');
require('dotenv').config();
const app = express();
var morgan = require("morgan")
var cors = require('cors')
// mongo db connection 
const db = require('./config/db');
const authRoute = require("./routes/auth.route")
const userRoute = require("./routes/user.route")
const adminRoute = require("./routes/admin.route")
const {UserModel} = require('./models/User.model')
// passport set up
const passport = require("passport")
const ExpressSession = require("express-session");
const errorHandler = require('./utils/errorHandling');

// connect to data base
db.connect(process.env.MONGO_URL);

 // cors
 const corsOptions = {
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
credentials: true, // If you're using cookies/sessions
methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
// exposedHeaders: ['set-cookie'],
//   optionsSuccessStatus: 204
}
app.use(cors(corsOptions))
// app.use(cors())
// app.use((req, res, next) => {
//     console.log(`${req.method} ${req.url}`, {
//         headers: req.headers,
//         body: req.body,
//     });
//     next();
// });
// app.options('*', cors(corsOptions));


// middleWares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'))
app.use(errorHandler)

   

// passport js for authentication 
app.use(ExpressSession({
    resave:false,
    saveUninitialized:false,
    secret: process.env.SecretKey || "jai_ho",
    cookie: {
        secure: process.env.NODE_ENV === 'production', // false in development
        httpOnly: true,
        sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
      }
}))
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(UserModel.serializeUser())
passport.deserializeUser(UserModel.deserializeUser())

app.use("/api/", authRoute)
app.use("/api/user", userRoute)
app.use("/api/admin", adminRoute)
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