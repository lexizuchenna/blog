const Posts = require("../models/Post");

const getSinglePost = async (req, res) => {
  const { link, author } = req.params;
  console.log(author);
  console.log(link);

  const post = await Posts.findOne({ link }).lean();
//   console.log(post);
  return res.status(200).render("posts/post", { post });
};

const getPostsByCategory = async (req, res) => {
  const { category } = req.query;
  const posts = await Posts.find({category}).lean()
  return res.status(200).render("posts/category", {posts, category});
};

module.exports = {
  getSinglePost,
  getPostsByCategory,
};
