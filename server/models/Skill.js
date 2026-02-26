const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema(
  {
    idd: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // optional (adds createdAt & updatedAt)
  },
);

module.exports = mongoose.model("Skill", skillSchema);
