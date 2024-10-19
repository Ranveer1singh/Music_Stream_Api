const { userModel } = require("../models/user.model");
const { songModel } = require("../models/song.model");
const { getGridFSBucket } = require("../config/gridFs");
const { Readable } = require("stream");
const crypto = require("crypto");
const id3 = require("node-id3");

const apiError = require("../utils/apiError");
const { promises } = require("dns");
const apiResponse = require("../utils/apiResponse");

exports.uploadSongs = async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json(new apiError(400, "No files were uploaded."));
  }

  try {
    const gfsBucket = await getGridFSBucket("audio");
    const gfsBucketPoster = await getGridFSBucket("poster");

    await Promise.all(
      req.files.map(async (file) => {
        const randomName = crypto.randomBytes(20).toString("hex");
        let songData;

        try {
          songData = id3.read(file.buffer);
        } catch (idError) {
          console.error("Error reading ID3 tags:", idError);
          songData = { title: "Unknown", artist: "Unknown", album: "Unknown" };
        }

        // Upload the song file
        await new Promise((resolve, reject) => {
          Readable.from(file.buffer)
            .pipe(gfsBucket.openUploadStream(randomName))
            .on("error", reject)
            .on("finish", resolve);
        });

        // Upload the poster if it exists
        if (songData.image && songData.image.imageBuffer) {
          await new Promise((resolve, reject) => {
            Readable.from(songData.image.imageBuffer)
              .pipe(gfsBucketPoster.openUploadStream(randomName + "poster"))
              .on("error", reject)
              .on("finish", resolve);
          });
        }

        // Create song document in database
        await songModel.create({
          title: songData.title || "Unknown",
          artist: songData.artist || "Unknown",
          album: songData.album || "Unknown",
          size: file.size,
          poster: songData.image ? randomName + "poster" : undefined,
          fileName: randomName,
        });
      })
    );

    res
      .status(201)
      .json(new apiResponse(201, {}, "Songs uploaded successfully"));
  } catch (error) {
    console.error("Error in uploadSongs:", error.message);
    return res
      .status(500)
      .json(
        new apiError(
          500,
          error.message || "An error occurred while uploading songs"
        )
      );
  }
};
