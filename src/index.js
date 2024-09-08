const express = require('express')
const http = require('http');
require('dotenv').config();
const app = express();
// mongo db connection 
const db = require('./config/db');

// connect to data base
db.connect();

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