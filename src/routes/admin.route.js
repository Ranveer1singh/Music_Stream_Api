const express = require("express");
const { isAdmin } = require("../middlewares/auth.middleware");
const { uploadSongs } = require("../controllers/admin.controller");
const { upload } = require("../config/multer");
const router = express.Router();

router.post("/",isAdmin,upload.array('songs'),uploadSongs)

module.exports = router