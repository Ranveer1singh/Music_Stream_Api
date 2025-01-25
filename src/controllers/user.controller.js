const { userModel } = require("../models/User.model");
const { songModel } = require("../models/Song.model");
const apiError = require("../utils/apiError");
const apiResponse = require("../utils/apiResponse");
const {getGridFSBucket} = require("../config/gridFs");
const { playList } = require("../models/PlayList.model");
const { update } = require("node-id3");


exports.home = async(req, res)=> {
    try {
        const User = await userModel.findOne({username:req.session.passport.user})
        res.status(200).json(new apiResponse(200, User,"User Found Succesfully"))
    } catch (error) {
     return res.status(500).json(new apiError(500, "Internal Server Error"))   
    }
}

exports.allSongs = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const sortBy = req.query.sortBy || 'createdAt';
        const order = req.query.order === 'asc' ? 1 : -1;
        const search = req.query.search || '';

        const query = search
            ? { 
                $or: [
                    { title: { $regex: search, $options: 'i' } },
                    { artist: { $regex: search, $options: 'i' } },
                    { album: { $regex: search, $options: 'i' } }
                ]
            }
            : {};

        const totalSongs = await songModel.countDocuments(query);
        const totalPages = Math.ceil(totalSongs / limit);

        const songs = await songModel.find(query)
            .sort({ [sortBy]: order })
            .skip((page - 1) * limit)
            .limit(limit)
            .select('-__v');  // Excluding the version key

        if (songs.length === 0) {
            return res.status(404).json(new apiError(404, "No songs found matching the criteria"));
        }

        const response = {
            songs,
            currentPage: page,
            totalPages,
            totalSongs
        };

        res.status(200).json(new apiResponse(200, response, "Songs fetched successfully"));
    } catch (error) {
        console.error("Error in allSongs:", error);
        return res.status(500).json(new apiError(500, error.message || "An error occurred while fetching songs"));
    }
};
// Example API calls:
// GET /user/songs?page=1&limit=10
// GET /user/songs?sortBy=artist&order=asc
// GET /user/songs?artist=Anurag Kulkarni
// GET /user/songs?search=Ramuloo

// username:req.session.passport.user



exports.playSong = async (req, res) => {
    try {
        const songId = req.params.id;

        // Find the song in the database
        const song = await songModel.findById(songId);
        if (!song) {
            return res.status(404).json(new apiError(404, "Song not found"));
        }

        // Get the GridFS bucket
        const gfsBucket = await getGridFSBucket('audio');

        // Find the file in GridFS
        const files = await gfsBucket.find({ filename: song.fileName }).toArray();
        if (files.length === 0) {
            return res.status(404).json(new apiError(404, "Audio file not found"));
        }

        const file = files[0];

        // Set the proper headers for audio streaming
        res.set('Content-Type', 'audio/mpeg');
        res.set('Content-Length', file.length);
        res.set('Accept-Ranges', 'bytes');

        // Create a read stream and pipe it to the response
        const readStream = gfsBucket.openDownloadStreamByName(song.fileName);
        
        // Add error handling for the stream
        readStream.on('error', (streamErr) => {
            console.error("Error in streaming the file:", streamErr);
            res.status(500).json(new apiError(500, "Error streaming the audio file"));
        });

        readStream.pipe(res);

    } catch (error) {
        console.error("Error in playSong:", error);
        res.status(500).json(new apiError(500, "An error occurred while streaming the song"));
    }
};


exports.addPlayList = async (req, res) => {
    try {
        const userId = req.user._id;
        
        if(!userId){
            return res.status(404).json(new apiError(404, "User Id Not Found"))
        }

        const {name} = req.body;

        if(!name){
            return res.status(400).json(new apiError(400, "Playlist name is requiured"))
        }

        const newPlayList = new playList({
            name,
            user:userId
        })

        await newPlayList.save();
        
        res.status(201).json(new apiResponse(201, newPlayList, "Playlist created successfully"));
    } catch (error) {
        return res.status(500).json(new apiError(500,{},`Error In Add playlist ${error.message}`))
    }
}

exports.editPlayList = async (req, res) =>{
    try {
        const playListId = req.params.id;
        if(!playListId){
            return res.status(404).json(new apiError(404,"playlist id not found"))
        }

        const {name} = req.body;

        const updatedPlayList = await playList.findByIdAndUpdate(
            playListId,
            {name},
            {new:true});
            
        return res.status(200).
        json(new apiResponse(200,updatedPlayList,"playlist updated "))
    } catch (error) {
        return res.status(500).
        json(new apiError(500, error.message))
    }
}

exports.getAllPlayList = async(req, res)=>{
    try {
        const userId = req.user._id;
        if(!userId){
            return res.status(404).
            json(new apiError(404,"userId Not Found"))
        }
        const allPlayList = await playList.find({user:userId}).populate("songs");
        if(allPlayList.length<=0){
            return res.status(404).
            json(new apiResponse(404,allPlayList, "play list not found"))
        }
        return res.status(200).
        json(new apiResponse(200,allPlayList, "playlist fetched successfully"))
    } catch (error) {
        return res.status(500).
        json(new apiError(500, error.message))
    }
}

exports.deletePlayList = async(req, res) =>{
    try {
        const {id} = req.params;
        const deletedPlayList  = await playList.findByIdAndDelete({_id:id});

        if(!deletedPlayList){
            return res.status(404).json(new apiError(404,"Play List not Found"));
        }

        return res.status(200).json(new apiResponse(200,deletedPlayList,"PlayList deleted successfully "))
    } catch (error) {
        return res.status(500).
        json(new apiError(500, error.message))   
    }
}


// add songs into playlist
exports.addSongToPlayList = async(req, res)=>{
    try {
        const {id}= req.params;
        const {songId} = req.body;

        if(!songId){
                return res.status(400).json(new apiError(400, "Song ID is required"));
        }
        const PlayList = await playList.findById(id);

        if(!PlayList){
            return res.status(400).json(new apiError(400,"Playlist is not found"))
        }

        if(PlayList.songs.includes(songId)){
            return res.status(400).json(new apiError(400, "song is already in Playlist"))
        }
        PlayList.songs.push(songId);
        await PlayList.save();
        return res.status(200).
        json(
            new apiResponse (
                200,
                PlayList,
                "song added to playlist"
            )
        )
    } catch (error) {
        return res.status(500).json(new apiError(500, error.message))
        
    }
}
exports.removeSongToPlayList = async(req, res)=>{
    try {
        const {id}= req.params;
        const {songId} = req.body;

        if(!songId){
                return res.status(400).json(new apiError(400, "Song ID is required"));
        }
        const PlayList = await playList.findById(id);

        if(!PlayList){
            return res.status(400).json(new apiError(400,"Playlist is not found"))
        }

        if(!PlayList.songs.includes(songId)){
            return res.status(400).json(new apiError(400, "song is not in Playlist"))
        }
        PlayList.songs.pull(songId);
        await PlayList.save();
        return res.status(200).
        json(
            new apiResponse (
                200,
                "song removed to playlist"
            )
        )
    } catch (error) {
        return res.status(500).json(new apiError(500, error.message))
        
    }
}