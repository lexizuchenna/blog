const mongoose = require("mongoose");

const PostSchema = mongoose.Schema(
  {
    author: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    creator: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: "user",
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
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Post", PostSchema);
