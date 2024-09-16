const { userModel } = require("../models/user.model");
const { songModel } = require("../models/song.model");
const apiError = require("../utils/apiError");
const apiResponse = require("../utils/apiResponse");

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