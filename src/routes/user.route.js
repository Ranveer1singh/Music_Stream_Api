const express = require("express");
const { home, allSongs, playSong, addPlayList, editPlayList, getAllPlayList, deletePlayList, addSongToPlayList } = require("../controllers/user.controller");
const { isLoggedIn } = require("../middlewares/auth.middleware");
const router = express.Router();

// this is User Profile route
router.post('/',isLoggedIn, home);

// get all uploaded songs
router.get('/songs',isLoggedIn, allSongs);

// play song 
router.post('/play-song/:id',isLoggedIn, playSong);
// create update, delete, get playlist
router.post('/playlist',isLoggedIn,addPlayList)
router.patch('/playlist/:id',isLoggedIn,editPlayList)
router.delete('/playlist/:id',isLoggedIn,deletePlayList)
router.get('/playlist',isLoggedIn,getAllPlayList)

router.post('/playlist/:id/add-song',isLoggedIn,addSongToPlayList)


module.exports = router