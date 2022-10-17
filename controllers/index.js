const Posts = require("../models/Post");

const viewHome = async (req, res) => {
  const posts = await Posts.find().lean()
  const data = posts.map((post) => {
    return post.category
  })

  const category = [... new Set(data)]

  return res.status(200).render("home", {posts, category});
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
