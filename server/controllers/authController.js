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

    if (!Array.isArray(skills)) {
      return res.status(400).json({ message: "Invalid skills format" });
    }

    req.user.skills = skills;
    await req.user.save();

    res.json({ message: "Skills saved successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= LOGOUT =================
exports.logout = async (req, res) => {
  res.json({ message: "Logged out successfully" });
};
