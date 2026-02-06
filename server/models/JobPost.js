const mongoose = require("mongoose");

const jobPostSchema = new mongoose.Schema(
  {
    /* ================= BASIC JOB INFO ================= */

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    /* ================= COMPANY ================= */

    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    /* ================= LOCATION ================= */

    location: { type: String, required: true },
    locationType: {
      type: String,
      enum: ["On-site", "Remote", "Hybrid"],
      required: true,
    },

    /* ================= JOB DETAILS ================= */

    jobType: {
      type: String,
      enum: ["Full-time", "Part-time", "Contract", "Internship"],
      required: true,
    },

    requiredSkills: [
      {
        type: String,
        trim: true,
      },
    ],

    preferredMbtiTypes: [
      {
        type: String,
        enum: [
          "INTJ",
          "INTP",
          "ENTJ",
          "ENTP",
          "INFJ",
          "INFP",
          "ENFJ",
          "ENFP",
          "ISTJ",
          "ISFJ",
          "ESTJ",
          "ESFJ",
          "ISTP",
          "ISFP",
          "ESTP",
          "ESFP",
        ],
      },
    ],

    /* ================= WORKFLOW ================= */

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    activeCompanies: {
      type: Boolean,
      default: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("JobPost", jobPostSchema);
