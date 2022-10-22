const express = require("express");
const router = express.Router();

const {
  getSinglePost,
  getPostsByCategory,
  getAllPosts,
} = require("../controllers/post");

router.get("/", getAllPosts);
router.get("/:username/:link", getSinglePost);
router.get("/category", getPostsByCategory);

module.exports = router;
