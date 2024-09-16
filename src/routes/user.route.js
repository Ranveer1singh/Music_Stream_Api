const express = require("express");
const { home, allSongs } = require("../controllers/user.controller");
const { isLoggedIn } = require("../middlewares/auth.middleware");
const router = express.Router();


router.post('/',isLoggedIn, home);
router.get('/songs',isLoggedIn, allSongs);

module.exports = router