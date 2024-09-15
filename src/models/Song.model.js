const mongoose = require("mongoose");

const songSchema = mongoose.Schema({
    title : {
        type : String,
        requried : [true, "Song Title Is must Required"],
        trim : true
    },
    artist: {
        type : String,
        requried : [true, "artist Is must Required"],
        trim : true
    },
    album: {
        type : String,
        // requried : [true, "artist Is must Required"],
        trim : true
    },
    category : [
        {
            type : String,
            enum: ["punjabi", "gujrati"]
        },
    ],
    likes : [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ], 
    size  : {
        type: Number
    },
    Poster :{
        type : String,
        trim : true
    }, 
    fileName : {
        type : String,
        required : true
    }
})

const songModel = mongoose.model("Song", songSchema);
module.exports = {
    songModel
}