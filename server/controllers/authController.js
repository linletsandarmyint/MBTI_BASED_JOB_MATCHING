const User = require("../models/User");
const jwt = require("jsonwebtoken");

// 🔑 Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

// ================= REGISTER =================
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const avatar = `https://api.dicebear.com/8.x/pixel-art/svg?seed=${email}`;

    const user = await User.create({
      name,
      email,
      password,
      role: role || "jobseeker",
      avatar,
    });
    // 🔑 generate token after user exists
    const token = generateToken(user._id);

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        skills: user.skills,
        mbtiType: user.mbtiType,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= LOGIN =================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user._id);

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= PROFILE =================
exports.getProfile = async (req, res) => {
  res.json({
    message: "Protected route accessed",
    user: req.user,
  });
};

// ================= SAVE SKILLS =================
exports.saveSkills = async (req, res) => {
  try {
    const { skills } = req.body;

    // Validate request body
    if (!Array.isArray(skills) || skills.length === 0) {
      return res.status(400).json({ message: "Skills array is required" });
    }

    // Validate each skill
    const validLevels = ["Beginner", "Intermediate", "Advanced", "Expert"];
    for (let i = 0; i < skills.length; i++) {
      const s = skills[i];
      if (!s.skill || !s.experienceLevel) {
        return res
          .status(400)
          .json({
            message: `Skill and experienceLevel are required for item ${i}`,
          });
      }
      if (!validLevels.includes(s.experienceLevel)) {
        return res
          .status(400)
          .json({
            message: `Invalid experienceLevel at item ${i}. Allowed: ${validLevels.join(", ")}`,
          });
      }
    }

    // Save skills to user
    req.user.skills = skills;
    req.user.skillsCompleted = true; // ✅ mark as completed
    await req.user.save();

    res.status(200).json({
      message: "Skills saved successfully",
      skills: req.user.skills,
      skillsCompleted: req.user.skillsCompleted,
    });
  } catch (error) {
    console.error("Save Skills Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ================= LOGOUT =================
exports.logout = async (req, res) => {
  res.json({ message: "Logged out successfully" });
};
