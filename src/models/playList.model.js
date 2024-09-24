const mongoose = require("mongoose");

const playListSchema = mongoose.Schema({
    name : {
     type : String,
     required : true,
     trim:true   
    },
    user:{
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    poster:{
        type : String,
        default :"/dummyImages/defaultmusic.png"
    },
    songs : [{
        type : mongoose.Schema.Types.ObjectId,
        ref:"Song",
        
    }]

})

const playList = mongoose.model('PlayList', playListSchema);
module.exports={
    playList

}