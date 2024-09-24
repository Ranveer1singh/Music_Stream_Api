const express = require("express");
const { home, allSongs, playSong, addPlayList } = require("../controllers/user.controller");
const { isLoggedIn } = require("../middlewares/auth.middleware");
const router = express.Router();


router.post('/',isLoggedIn, home);
router.get('/songs',isLoggedIn, allSongs);
router.post('/play-song/:id',isLoggedIn, playSong);
router.post('/playlist',isLoggedIn,addPlayList)

// playlist create , edit , delete , get

module.exports = router