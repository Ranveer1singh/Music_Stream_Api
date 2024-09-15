const mongoose = require("mongoose")
const conn = mongoose.connection;

let gfsBucket, gfsBucketPoster ;
conn.once('open', ()=>{
    gfsBucket = new mongoose.mongo.GridFSBucket(conn.db,{
        bucketName : "audio"
    });

    gfsBucketPoster = new mongoose.mongo.GridFSBucket(conn.db,{
        bucketName : "poster"
    }); 
})

module.exports ={gfsBucket, gfsBucketPoster}