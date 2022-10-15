const Posts = require("../models/Post");

const viewHome = async (req, res) => {
  // const posts = await Posts.find()
  return res.status(200).render("home");
};
const viewAbout = async (req, res) => {
  return res.status(200).render("about");
};
const viewContact = async (req, res) => {
  return res.status(200).render("contact");
};

module.exports = {
  viewHome,
  viewAbout,
  viewContact,
};
