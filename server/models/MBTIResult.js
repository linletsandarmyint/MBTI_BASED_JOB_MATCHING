const mongoose = require("mongoose");

const mbtiResultSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Store answers as a key-value map: questionId => answer (S/N, E/I, etc.)
    answers: {
      type: Map,
      of: String,
      required: true,
    },
    mbtiType: {
      type: String,
      enum: [
        "ESTP",
        "ESFP",
        "ISTP",
        "ISFP",
        "ENTP",
        "ENFP",
        "INTP",
        "INFP",
        "ESTJ",
        "ESFJ",
        "ISTJ",
        "ISFJ",
        "ENTJ",
        "ENFJ",
        "INTJ",
        "INFJ",
      ],
      default: null, // optional, can be set after calculation
    },
  },
  {
    timestamps: true, // automatically adds createdAt and updatedAt
  },
);

module.exports = mongoose.model("MBTIResult", mbtiResultSchema);
