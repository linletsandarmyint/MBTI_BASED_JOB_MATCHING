const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getJobTrendsByMbti,
  getMbtiJobTrends,
  getJobTrends,
} = require("../controllers/analyticsController");

// Route for MBTI-specific job trends (with optional query)
router.get("/job-trends-by-mbti", protect, getJobTrendsByMbti);

// ANY logged-in user can view MBTI job trends
router.get("/mbti-job-trends", protect, getMbtiJobTrends);

// General job trends for all MBTI types
router.get("/job-trends", getJobTrends);

module.exports = router;
