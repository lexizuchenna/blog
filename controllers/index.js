const Posts = require("../models/Post");

const viewHome = async (req, res) => {
  const posts = await Posts.find()
    .lean()
    .sort([["createdAt", -1]]);
  const Business = posts.filter(
    (post) => post.category.toLowerCase() === "business"
  );

  const leftSide = posts.slice(0, 3);
  const recentPosts = posts.slice(3, 8);
  const mainPosts = posts.slice(3, 6);
  
  const trendingData = await Posts.find()
    .lean()
    .sort([["views", -1]]);
  
  let trending = trendingData.filter((x) => x.image.data !== null)
  let trendingPost = trending[0]

  const data = posts.map((post) => {
    return post.category;
  });

  const categories = [...new Set(data)];

  const isAuth = req.isAuthenticated();
  let user;

  if (isAuth) {
    user = req.user.role === "admin" ? "admin" : "user";
  }

  return res.status(200).render("home", {
    posts,
    categories,
    isAuth,
    user,
    Business,
    leftSide,
    recentPosts,
    mainPosts,
    trendingPost
  });
};
const viewAbout = async (req, res) => {
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
  return res.status(200).render("about", { categories, isAuth, user });
};
const viewContact = async (req, res) => {
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
  return res.status(200).render("contact", { categories, isAuth, user });
};

module.exports = {
  viewHome,
  viewAbout,
  viewContact,
};
