const mongoose = require("mongoose");

const mbtiAttemptSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    answers: { type: [String], required: true },
    mbtiType: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("MbtiAttempt", mbtiAttemptSchema);
