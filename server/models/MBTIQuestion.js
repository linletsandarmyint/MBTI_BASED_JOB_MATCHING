const mongoose = require("mongoose");

const optionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  value: {
    type: String, // "E", "I", "S", "N", "T", "F", "J", "P"
    required: true,
  },
});

const mbtiQuestionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },
    options: {
      type: [optionSchema],
      required: true,
      validate: [(val) => val.length > 0, "At least one option is required"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  },
);

module.exports = mongoose.model("MBTIQuestion", mbtiQuestionSchema);
