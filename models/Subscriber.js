const mongoose = require("mongoose");

const SubscriberSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    isSubscribed: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Subscriber", SubscriberSchema);
