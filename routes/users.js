const express = require("express");
const router = express.Router();

const {loginUser} = require("../controllers/user");


router.get("/login", loginUser);

module.exports = router;