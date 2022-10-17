const mongoose = require("mongoose");


const PostSchema = mongoose.Schema(
  {
    author: {
      type: String,
      required: true,
      default: "codeblog",
    },
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    post: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      //required: true,
    },
    image: {
      data: Buffer,
      contentType: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Post", PostSchema);
