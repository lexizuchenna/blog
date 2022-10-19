const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const _ = require("lodash");

const Users = require("../models/User");
const Posts = require("../models/Post");

// View Login Page
const viewLogin = async (req, res) => {
  let errors;
  if (req?.session?.messages && req?.session?.messages !== []) {
    req.flash("errors", req?.session?.messages);
    errors = [req?.session?.messages.pop()];
    console.log(errors);
  }

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

  let success = req.flash("success");

  return res.render("users/login", {
    errors,
    success,
    categories,
    isAuth,
    user,
  });
};

// Create a Post in
const createPost = async (req, res) => {
  const user = req.user.role === "admin" ? "admin" : "user";
  const { title, category, post } = req.body;
  let prevPost = await Posts.findOne({ title });

  if (prevPost) {
    req.flash("errors", "Post title already taken");
    return res.status(422).redirect(`/users/${user}/create`);
  }

  if (title === "" || category === "" || post === "") {
    req.flash("errors", "Fill required fields");
    return res.status(422).redirect(`/users/${user}/create`);
  }

  let image = req?.file;

  if (image) {
    req.body.image = {
      data: fs.readFileSync(
        path.join(__dirname, "../public/uploads/" + image.filename)
      ),
      contentType: image.mimetype,
    };
  } else {
    req.body.image = {
      data: null,
      contentType: null,
    };
  }

  let text = req.body.title.replace(/[^a-zA-Z0-9- ]/g, "");
  let link = text.replace(/ /g, "-").toLowerCase();

  req.body.author = req.user.name;
  req.body.link = link;
  req.body.category = category.toLowerCase();
  req.body.creator = req.user.id;

  const newPost = await Posts.create(req.body);
  newPost.save();

  await Users.findByIdAndUpdate(
    req.user.id,
    { numberOfPosts: parseInt(req.user.numberOfPosts) + 1 },
    { new: true }
  );

  req.flash("success", "Post created...");

  return res.status(201).redirect(`/users/${user}/create`);
};

// Edit A Post
const editPost = async (req, res) => {
  const user = req.user.role === "admin" ? "admin" : "user";
  const { id } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    console.log(id);
    req.flash("errors", "Post not valid");
    return res.status(404).redirect(`/users/${user}/dashboard`);
  }

  let image = req?.file;

  if (image) {
    req.body.image = {
      data: fs.readFileSync(
        path.join(__dirname, "../public/uploads/" + image.filename)
      ),
      contentType: image.mimetype,
    };
  }

  let updatedPost = await Posts.findByIdAndUpdate(id, req.body, { new: true });

  req.flash("success", `${updatedPost.title} updated successfully...`);

  return res.status(201).redirect(`/users/${user}/dashboard`);
};

// Delete Post
const deletePost = async (req, res) => {
  const user = req.user.role === "admin" ? "admin" : "user";
  const { id } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).redirect(`/users/${user}/dashboard`);
  }

  const post = await Posts.findByIdAndRemove(id);
  const deletedUser = await Users.findById(post.creator);

  await Users.findByIdAndUpdate(
    post.creator,
    { numberOfPosts: parseInt(deletedUser.numberOfPosts) - 1 },
    { new: true }
  );

  req.flash("success", `${post.title} deleted`);
  return res.status(200).redirect(`/users/${user}/dashboard`);
};

// Change Data
const changeData = async (req, res) => {
  let user = req?.user?.role === "admin" ? "admin" : "user";

  let passwordMatch = await bcrypt.compare(
    req.body.password,
    req.user.password
  );

  if (passwordMatch === false) {
    req.flash("errors", "Incorrect Password");
    return res.status(404).redirect(`/users/admin/setting`);
  }

  await Users.findByIdAndUpdate(
    req.user.id,
    { name: req.body.name, email: req.body.email },
    { new: true }
  );

  req.flash("success", "Profiile Updated");
  return res.status(200).redirect(`/users/${user}/setting`);
};

// Change Password
const changePassword = async (req, res) => {
  let user = req.user.role === "admin" ? "admin" : "user";

  let passwordMatch = await bcrypt.compare(
    req.body.oldPassword,
    req.user.password
  );

  if (passwordMatch === false) {
    req.flash("errors", "Incorrect Password");
    return res.status(404).redirect(`/users/admin/setting`);
  }

  if (req.body.password !== req.body.password2) {
    req.flash("errors", "Passwords don't match");
    return res.status(404).redirect(`/users/admin/setting`);
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPwd = await bcrypt.hash(req.body.password, salt);

  await Users.findByIdAndUpdate(
    req.user.id,
    { password: hashedPwd },
    { new: true }
  );

  req.flash("success", "Password Changed");
  return res.status(200).redirect(`/users/${user}/setting`);
};

// Logout
const logoutUser = async (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    return res.redirect("/users/login");
  });
};

/*
    ----------
    ADMIN
    ----------
*/

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

  let success = req.flash("success");
  let errors = req.flash("errors");

  return res.render("users/admin/dashboard", {
    errors,
    success,
    users,
    posts,
    categories,
    isAuth,
    user,
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

  let success = req.flash("success");
  let errors = req.flash("errors");

  return res.render("users/admin/register-user", {
    errors,
    success,
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
    return res.status(400).render("users/admin/register-user", { err });
  }

  if (email) {
    err.push({ msg: "Email already exists" });
    return res.status(400).render("users/admin/register-user", { err });
  }

  if (req.body.role === "select role" || req.body.role === "") {
    err.push({ msg: "Choose role" });
    return res.status(400).render("users/admin/register-user", { err });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPwd = await bcrypt.hash(req.body.password, salt);
  req.body.password = hashedPwd;
  req.body.username = req.body.username.toLowerCase();
  req.body.email = req.body.email.toLowerCase();
  req.body.role = req.body.role.toLowerCase();

  const newUser = await Users.create(req.body);

  newUser.save();
  req.flash("success", "User Created");

  return res.status(201).redirect("/users/admin/register-user");
};

// View Edit User
const viewEditUser = async (req, res) => {
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

  let success = req.flash("success");
  let errors = req.flash("errors");

  let { id } = req.params;
  const editUser = await Users.findById(id).lean();

  return res.render("users/admin/edit-user", {
    errors,
    success,
    categories,
    isAuth,
    user,
    editUser,
  });
};

// Edit User Handle
const editUser = async (req, res) => {
  const { id } = req.body;
  let data = req.body;

  const adminData = await Users.findById(id);

  if (req.body.password === "" && req.body.password2 === "") {
    data = _.omit(req.body, ["password", "password2"]);
  }

  if (req.body.password !== req.body.password2) {
    req.flash("errors", "Passwords don't match");
    return res.status(400).redirect(`/users/admin/edit-user/${id}`);
  }

  if (req.body.role === "select role" || req.body.role === "") {
    req.flash("errors", "Choose a role");
    return res.status(400).redirect(`/users/admin/edit-user/${id}`);
  }

  if (req.body.username === "admin" && req.body.role === "writer") {
    req.flash("errors", "Cannot change admin role");
    return res.status(400).redirect(`/users/admin/edit-user/${id}`);
  }

  if (req.user.username !== "admin" && adminData.username === "admin") {
    req.flash("errors", "Cannot modify admin");
    return res.status(400).redirect(`/users/admin/edit-user/${id}`);
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    req.flash("errors", "User not valid");
    return res.status(404).redirect(`/users/admin/dashboard`);
  }

  if (
    req.body.password === req.body.password2 &&
    req.body.password !== "" &&
    req.body.password2 !== ""
  ) {
    const salt = await bcrypt.genSalt(10);
    const hashedPwd = await bcrypt.hash(req.body.password, salt);
    data.password = hashedPwd;
  }

  data.username = req.body.username.toLowerCase();
  data.email = req.body.email.toLowerCase();
  data.role = req.body.role.toLowerCase();

  let updatedUser = await Users.findByIdAndUpdate(id, data, { new: true });

  req.flash("success", `${updatedUser.username} Updated Successfully...`);

  return res.status(201).redirect("/users/admin/dashboard");
};

// Create A Post in Admin
const viewCreateAdminPost = async (req, res) => {
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
  let success = req.flash("success");
  let errors = req.flash("errors");

  return res.render("users/admin/create-post", {
    errors,
    success,
    categories,
    user,
    isAuth,
  });
};

// View Admin Edit Post
const viewAdminEditPost = async (req, res) => {
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

  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).redirect(`/users/${user}/edit`);
  }

  const post = await Posts.findById(id).lean();

  let success = req.flash("success");
  let errors = req.flash("errors");

  return res.status(200).render("users/admin/edit-post", {
    post,
    errors,
    success,
    categories,
    user,
    isAuth,
  });
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

  let success = req.flash("success");
  let errors = req.flash("errors");

  const currentUser = await Users.findById(req.user.id).lean();

  return res.render("users/admin/setting", {
    errors,
    success,
    categories,
    isAuth,
    user,
    currentUser,
  });
};

// Delete User
const deleteUser = async (req, res) => {
  const user = req.user.role === "admin" ? "admin" : "user";
  const { id } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).redirect(`/users/${user}/dashboard`);
  }

  const deletedUser = await Users.findByIdAndRemove(id);

  req.flash("success", `${deletedUser.name} deleted`);
  return res.status(200).redirect(`/users/${user}/dashboard`);
};

/*
    ----------
    WRITER
    ----------
*/

// View Writer Dashboard
const viewWriter = async (req, res) => {
  const posts = await Posts.find().lean();
  let userPost = posts.filter((post) => String(post.creator) === req.user.id);

  const data = posts.map((post) => {
    return post.category;
  });

  const categories = [...new Set(data)];

  const isAuth = req.isAuthenticated();
  let user;

  if (isAuth) {
    user = req.user.role === "admin" ? "admin" : "user";
  }

  let success = req.flash("success");
  let errors = req.flash("errors");

  return res.render("users/writer/dashboard", {
    errors,
    success,
    categories,
    isAuth,
    user,
    userPost,
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

  let success = req.flash("success");
  let errors = req.flash("errors");

  return res.render("users/writer/create-post", {
    errors,
    success,
    categories,
    isAuth,
    user,
  });
};

// View Edit Post
const viewWriterEditPost = async (req, res) => {
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
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).redirect(`/users/user/edit`);
  }

  const post = await Posts.findById(id).lean();

  if (String(post.creator) !== req.user.id) {
    req.flash("errors", "Permission Denied");
    return res.status(400).redirect("/users/user/dashboard");
  }

  let success = req.flash("success");
  let errors = req.flash("errors");

  return res
    .status(200)
    .render("users/writer/edit-post", {
      post,
      errors,
      success,
      categories,
      user,
      isAuth,
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

  let success = req.flash("success");
  let errors = req.flash("errors");

  const currentUser = await Users.findById(req.user.id).lean();

  return res.render("users/writer/setting", {
    errors,
    success,
    categories,
    isAuth,
    user,
    currentUser,
  });
};

module.exports = {
  viewLogin,
  viewAdminEditPost,
  editPost,
  deletePost,
  createPost,
  changeData,
  changePassword,
  logoutUser,

  viewAdmin,
  viewRegisterUser,
  registerUser,
  viewEditUser,
  editUser,
  viewCreateAdminPost,
  viewAdminSetting,
  deleteUser,

  viewWriter,
  viewCreateWriterPost,
  viewWriterEditPost,
  viewWriterSetting,
};
