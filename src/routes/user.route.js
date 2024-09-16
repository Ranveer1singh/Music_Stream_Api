const express = require("express");
const { home, allSongs, playSong } = require("../controllers/user.controller");
const { isLoggedIn } = require("../middlewares/auth.middleware");
const router = express.Router();


router.post('/',isLoggedIn, home);
router.get('/songs',isLoggedIn, allSongs);
router.post('/play-song/:id',isLoggedIn, playSong);

module.exports = router