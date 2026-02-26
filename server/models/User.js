const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["jobseeker", "company", "admin"],
      default: "jobseeker",
    },
    avatar: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },

    skills: [
      {
        skill: {
          type: String, // "react", "mongodb", or manual entry
          required: true,
        }, // skill id (e.g. "react", "mongodb")
        experienceLevel: {
          type: String,
          enum: ["Beginner", "Intermediate", "Advanced", "Expert"],
          required: true,
        },
      },
    ],
    mbtiType: { type: String, default: null },
    skillsCompleted: { type: Boolean, default: false },
    mbtiLastTestAt: { type: Date, default: null }, // <--- Add this
  },
  { timestamps: true },
);

// 🔐 Hash password before saving (NO next)
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// 🔍 Compare password for login
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
