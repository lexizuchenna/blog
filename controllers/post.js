const mongoose = require('mongoose')

const Posts = require("../models/Post");

// Get Single Post
const getSinglePost = async (req, res) => {
  const { link } = req.params;
  const post = await Posts.findOne({ link }).lean();

  const posts = await Posts.find().lean();
  const data = posts.map((post) => {
    return post.category;
  });

  const categories = [...new Set(data)];

  const isAuth = req.isAuthenticated();
  let user;

  if (isAuth) {
    user = req.user.role === "admin" ? "admin" : "user";
  } 

  return res.status(200).render("posts/post", { post, categories, isAuth, user });
};

// Get Posts by Category
const getPostsByCategory = async (req, res) => {
  const { category } = req.query;
  const categoryPosts = await Posts.find({category}).lean()

  const posts = await Posts.find().lean();
  const data = posts.map((post) => {
    return post.category;
  });

  const categories = [...new Set(data)];

  const isAuth = req.isAuthenticated();
  let user;

  if (isAuth) {
    user = req.user.role === "admin" ? "admin" : "user";
  } 
  return res.status(200).render("posts/category", {categoryPosts, categories, category});
};



module.exports = {
  getSinglePost,
  getPostsByCategory,
};
