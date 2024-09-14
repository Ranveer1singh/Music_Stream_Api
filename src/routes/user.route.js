const express = require("express");
const { home } = require("../controllers/user.controller");
const { isLoggedIn } = require("../middlewares/IsLoggedIn");
const router = express.Router();


router.post('/',isLoggedIn, home);

module.exports = router