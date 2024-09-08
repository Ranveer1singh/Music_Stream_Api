const express = require('express')
const http = require('http');
require('dotenv').config();
const app = express();


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