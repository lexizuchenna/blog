const express = require("express");
const router = express.Router();

const {getSinglePost} = require("../controllers/post");


router.get("/:link", getSinglePost);

module.exports = router;