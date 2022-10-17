const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");

const Users = require("../models/User");
const Posts = require("../models/Post");

// View Login Page
const viewLogin = async (req, res) => {
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

  return res.render("users/login", {
    errors: req.flash("errors"),
    success: req.flash("success"),
    categories,
    isAuth,
    user,
  });
};

const logoutUser = async (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    return res.redirect("/users/login");
  });
};

// View Admin Dashboard
const viewAdmin = async (req, res) => {
  let usersData = await Users.find().lean();
  let posts = await Posts.find().lean();

  const data = posts.map((post) => {
    return post.category;
  });

  const categories = [...new Set(data)];

  const isAuth = req.isAuthenticated();
  let user;

  if (isAuth) {
    user = req.user.role === "admin" ? "admin" : "user";
  }

  let users = usersData.filter((user) => user.username !== "admin");
  return res.render("users/admin/dashboard", {
    users,
    posts,
    categories,
    isAuth,
    user,
    errors: req.flash("errors"),
    success: req.flash("success"),
  });
};

// View Register User
const viewRegisterUser = async (req, res) => {
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

  return res.render("users/admin/register-user", {
    errors: req.flash("errors"),
    success: req.flash("success"),
    categories,
    isAuth,
    user,
  });
};

// Register User Handle
const registerUser = async (req, res) => {
  let username = await Users.findOne({
    username: req.body.username.toLowerCase(),
  });
  let email = await Users.findOne({
    email: req.body.email.toLowerCase(),
  });
  let err = [];
  let succ = [];

  if (username) {
    err.push({ msg: "Username already exists" });
    console.log(err);
    return res.status(400).render("users/admin/register-user", { err });
  }

  if (email) {
    err.push({ msg: "Email already exists" });
    return res.status(400).render("users/admin/register-user", { err });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPwd = await bcrypt.hash(req.body.password, salt);
  req.body.password = hashedPwd;
  req.body.username = req.body.username.toLowerCase();
  req.body.email = req.body.email.toLowerCase();
  req.body.role = "writer";

  const newUser = await Users.create(req.body);

  newUser.save();
  req.flash("success", "User Created");

  return res.status(201).redirect("/users/admin/register-user");
};

// Create A Post in Admin
const viewCreateAdminPost = async (req, res) => {
  return res.render("users/admin/create-post", {
    errors: req.flash("errors"),
    success: req.flash("success"),
  });
};

// Create a Post in Admin
const adminPost = async (req, res) => {
  console.log(req?.file);
  let text = req.body.title.replace(/[^a-zA-Z0-9- ]/g, "");
  let link = text.replace(/ /g, "-").toLowerCase();

  req.body.author = req.user.username;
  req.body.link = link;
  req.body.image = {
    data: fs.readFileSync(
      path.join(__dirname, "../public/my-images/" + req.file.filename)
    ),
    contentType: req.file.mimetype,
  };
  let image = req.body.image;

  //console.log(path.join(path.dirname(require.main.filename), image))

  console.log(link);

  const newPost = await Posts.create(req.body);
  newPost.save();

  res.redirect("/users/admin/create");
};

// View Admin Setting
const viewAdminSetting = async (req, res) => {
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

  return res.render("users/admin/setting", {
    errors: req.flash("errors"),
    success: req.flash("success"),
    categories,
    isAuth,
    user,
  });
};

// View Writer Dashboard
const viewWriter = async (req, res) => {
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

  return res.render("users/writer/dashboard", {
    errors: req.flash("errors"),
    success: req.flash("success"),
    categories,
    isAuth,
    user,
  });
};

// Create A Post in Writer
const viewCreateWriterPost = async (req, res) => {
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

  return res.render("users/writer/create-post", {
    errors: req.flash("errors"),
    success: req.flash("success"),
    categories,
    isAuth,
    user,
  });
};

// View Writer Setting
const viewWriterSetting = async (req, res) => {
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

  return res.render("users/writer/setting", {
    errors: req.flash("errors"),
    success: req.flash("success"),
    categories,
    isAuth,
    user,
  });
};

module.exports = {
  viewLogin,
  logoutUser,

  viewAdmin,
  viewRegisterUser,
  registerUser,
  viewCreateAdminPost,
  adminPost,
  viewAdminSetting,

  viewWriter,
  viewCreateWriterPost,
  viewWriterSetting,
};
