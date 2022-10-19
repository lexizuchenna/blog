const Posts = require("../models/Post");

const viewHome = async (req, res) => {
  const posts = await Posts.find().lean().sort([['createdAt', -1]]);
  const Business = posts.filter((post) => post.category.toLowerCase() === "business");

  const leftSide = posts.slice(0, 3)
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
    .render("home", { posts, categories, isAuth, user, Business, leftSide });
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
