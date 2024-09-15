const { userModel } = require("../models/user.model");
const {songModel} = require("../models/song.model")
const {gfsBucket, gfsBucketPoster} = require("../config/gridFs")
const {Readable} = require("stream")
const crypto = require('crypto')
const id3 = require("node-id3")

const apiError = require("../utils/apiError");
const { promises } = require("dns");
const apiResponse = require("../utils/apiResponse");





exports.uploadSongs = async(req, res) =>{
try {
    await Promise.all(req.files.map(async(file)=>{
        const randomName = crypto.randomBytes(20).toString('hex');
        const songData = id3.read(file.buffer);

        Readable.from(file.buffer).pipe(gfsBucket.openUploadStream(randomName));
        Readable.from(songData.image.imageBuffer).pipe(gfsBucket.openUploadStream(randomName  + "poster"));
        
        await songModel.create({
            title: songData.title,
        artist: songData.artist,
        album: songData.album,
        size: file.size,
        poster: randomName + 'Poster',
        fileName: randomName
        })
    }));
    res.status(201).json(new apiResponse(201,{},"Song uplaoded "))
    
} catch (error) {
    return res.status(500).json(new apiError(500,error.message))
}
}