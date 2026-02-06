 // routes/aiRoutes.js
const express = require("express");
const { testOpenRouter } = require("../controllers/aiController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Protected route example
router.get("/test", protect, testOpenRouter);

module.exports = router;
