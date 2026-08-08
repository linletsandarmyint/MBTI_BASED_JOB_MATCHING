const express = require("express");
const router = express.Router();
const { protect, admin, authorize } = require("../middleware/authMiddleware");

// Controller
const adminController = require("../controllers/adminController");

// ================= MBTI QUESTIONS =================
// Create MBTI question(s)
router.post(
  "/mbti/questions",
  protect,
  authorize("admin"),
  adminController.createMBTIQuestion,
);

// Get all MBTI questions (active + archived)
router.get(
  "/mbti/questions",
  protect,
  authorize("admin"),
  adminController.getAllMBTIQuestions,
);

// Update MBTI question
router.put(
  "/mbti/questions/:id",
  protect,
  authorize("admin"),
  adminController.updateMbtiQuestion,
);

// Archive / Unarchive MBTI question
router.put(
  "/mbti/questions/:id/status",
  protect,
  authorize("admin"),
  adminController.toggleMBTIQuestionStatus,
);


// Delete MBTI question
router.delete(
  "/mbti/questions/:id",
  protect,
  authorize("admin"),
  adminController.deleteMbtiQuestion,
);

// ================= USERS =================
// Get all users (with filters: search, role, status)
router.get("/users", protect, authorize("admin"), adminController.getAllUsers);

// Toggle user status (active / deactivated)
router.put(
  "/users/:id/status",
  protect,
  authorize("admin"),
  adminController.toggleUserStatus,
);

// Delete user
router.delete("/users/:id", protect, authorize("admin"), adminController.deleteUser);

// ================= JOBS =================
// Get all jobs (with applicant count)
router.get("/jobs", protect, authorize("admin"), adminController.getAllJobs);

// Get job details
router.get("/jobs/:id", protect, authorize("admin"), adminController.getJobDetails);

// Archive / Unarchive job
router.put(
  "/jobs/:id/archive",
  protect,
  authorize("admin"),
  adminController.toggleJobArchive
);


// Delete job
router.delete("/jobs/:id", protect, authorize("admin"), adminController.deleteJobAdmin);

// Approve job
router.put("/jobs/:id/approve", protect, authorize("admin"), adminController.approveJob);

// Reject job
router.put("/jobs/:id/reject", protect, authorize("admin"), adminController.rejectJob);

// ================= DASHBOARD STATS =================
router.get(
  "/dashboard",
  protect,
  authorize("admin"),
  adminController.getAdminDashboardStats,
);

// ================= AUDIT LOGS =================
router.get("/audit-logs", protect, authorize("admin"), adminController.getAuditLogs);

module.exports = router;
