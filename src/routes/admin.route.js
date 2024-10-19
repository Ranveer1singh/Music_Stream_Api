const express = require("express");
const { isAdmin } = require("../middlewares/auth.middleware");
const { uploadSongs } = require("../controllers/admin.controller");
const { multerHandler  } = require("../config/multer");
const router = express.Router();

router.post("/",isAdmin, multerHandler('songs'),uploadSongs)
// create routes for songs delete , edit , 
module.exports = router