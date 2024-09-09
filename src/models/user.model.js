const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');
const userSchema = mongoose.Schema({
    username : {
        type : String,
        required : [true, "User name is Required"],
        trim: true
    },
    email : {
        type:String,
        required : [true, "Email Is Required"],
        trim:true,
    },
    playList  : [{
        type : mongoose.Schema.Types.ObjectId,
        ref: "PlayList"
    }],
    liked:[
        {
            type : mongoose.Schema.Types.ObjectId,
            ref:"song"
        }
    ],

    profileImage : {
        type: String,
        default:"/dummyImages/defaultuser.png"
    },
    isAdmin : {
        type : Boolean,
        default : false
    },
    
})
userSchema.plugin(plm);

const userModel = mongoose.model("User", userSchema);
module.exports = {
    userModel
}