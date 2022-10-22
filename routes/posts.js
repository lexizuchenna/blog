const express = require("express");
const router = express.Router();

const {
  getSinglePost,
  getPostsByCategory,
  getAllPosts,
  getPostBySearch,
} = require("../controllers/post");

router.get("/", getAllPosts);
router.get("/:username/:link", getSinglePost);
router.get("/category", getPostsByCategory);
router.get("/search", getPostBySearch);

module.exports = router;
