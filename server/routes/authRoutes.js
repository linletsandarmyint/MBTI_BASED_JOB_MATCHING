const express = require("express");
const {
  register,
  login,
  getProfile,
  saveSkills,
  logout,
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();
// TEST ROUTE (VERY IMPORTANT)
router.get("/test", (req, res) => {
  res.send("AUTH ROUTE WORKING");
});
router.post("/register", register);
router.post("/login", login);

// protected
router.get("/profile", protect, getProfile);
router.post("/skills", protect, saveSkills);
router.post("/logout", protect, logout);

module.exports = router;
