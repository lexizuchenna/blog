//const mongoose = require("mongoose");

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

  const relatedPostsData = await Posts.find({ category: post.category }).lean();
  let relatedPosts = relatedPostsData
    .filter((singlePost) => singlePost.title !== post.title)
    .slice(0, 5);

  return res
    .status(200)
    .render("posts/post", { post, categories, isAuth, user, relatedPosts });
};

// Get Posts by Category
const getPostsByCategory = async (req, res) => {
  const { category } = req.query;
  const categoryPosts = await Posts.find({ category }).lean();

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
  return res.status(200).render("posts/category", {
    categoryPosts,
    categories,
    category,
    user,
    isAuth,
  });
};

const getAllPosts = async (req, res) => {
  const page = req.query.p ? req.query.p : 1;

  try {
    const LIMIT = 4;

    const startIndex = (Number(page) - 1) * LIMIT;

    const total = await Posts.countDocuments({});
    const totalPages = Math.ceil(total / LIMIT);

    const fetchedPosts = await Posts.find()
      .sort({ createdAt: -1 })
      .limit(LIMIT)
      .skip(startIndex)
      .lean();

    const pagination = {
      page: Number(page),
      pageCount: totalPages,
    };

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

    return res
      .status(200)
      .render("posts/posts", {
        fetchedPosts,
        pagination,
        categories,
        isAuth,
        user,
      });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getSinglePost,
  getPostsByCategory,
  getAllPosts,
};
