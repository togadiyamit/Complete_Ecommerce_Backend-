const express = require("express");

const router1 = express.Router();

const {registerUser,loginUser,currentUser,} = require("../controller/userController");
const validateToken = require("../middlewear/validTokenHandler");

router1.post("/register",registerUser)
router1.post("/login",loginUser)
router1.get("/current",validateToken)
router1.get("/current",currentUser)

module.exports = router1;