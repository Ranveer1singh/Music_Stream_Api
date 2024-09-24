const express = require("express");
const { registerUser, login, logout } = require("../controllers/auth.controller");
const router = express.Router();

router.post('/register',registerUser)
router.post("/login",login)
router.get('/logout',logout)
// forgot password & Change Password api 

module.exports = router;