const express = require("express");
const router = express.Router();

const {getSinglePost, getPostsByCategory} = require("../controllers/post");


router.get("/:author/:link", getSinglePost);
router.get("/category", getPostsByCategory);




module.exports = router;