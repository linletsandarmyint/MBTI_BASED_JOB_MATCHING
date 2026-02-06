const express = require("express");
const router = express.Router();

const {
  getJobs,
  getMatchedJobs,
  createJob,
  getMyJobs,
  approveJob,
  rejectJob,
  updateJob,
  deleteJob,
  aiExplainJob,
  aiSuggestJobs,
  aiBuildResume,
  applyForJob,
  getApplicationStatus,
  getMyApplications,
  reviewApplication,
  acceptApplication,
  rejectApplication,
  getCompanyApplications,
  getJobApplications,
  getCompanyJobsWithCount,
  updateApplicationStatus,
  generateJobsAI,
} = require("../controllers/jobController");

const { protect, authorize } = require("../middleware/authMiddleware");

// ========== COMPANY ==========
router.post("/", protect, authorize("company"), createJob);
router.get("/my", protect, authorize("company"), getMyJobs);
router.get(
  "/company/me",
  protect,
  authorize("company"),
  getCompanyJobsWithCount,
);
router.post("/generate", protect, authorize("company"), generateJobsAI);

// ========== JOBSEEKER ==========
router.get("/", protect, authorize("jobseeker"), getJobs);
router.get("/matched", protect, authorize("jobseeker"), getMatchedJobs);
router.post("/:jobId/apply", protect, authorize("jobseeker"), applyForJob);
router.get(
  "/:jobId/application-status",
  protect,
  authorize("jobseeker"),
  getApplicationStatus,
);
router.get(
  "/applications/me",
  protect,
  authorize("jobseeker"),
  getMyApplications,
);

// ========== ADMIN ==========
router.put("/:id/approve", protect, authorize("admin"), approveJob);
router.put("/:id/reject", protect, authorize("admin"), rejectJob);

// ========== SHARED ==========
router.put("/:id", protect, updateJob);
router.delete("/:id", protect, deleteJob);

// ========== APPLICATIONS (COMPANY) ==========
router.get(
  "/applications/company/me",
  protect,
  authorize("company"),
  getCompanyApplications,
);
router.get(
  "/:jobId/applications",
  protect,
  authorize("company"),
  getJobApplications,
);
router.put(
  "/applications/:appId/review",
  protect,
  authorize("company"),
  reviewApplication,
);
router.put(
  "/applications/:appId/accept",
  protect,
  authorize("company"),
  acceptApplication,
);
router.put(
  "/applications/:appId/reject",
  protect,
  authorize("company"),
  rejectApplication,
);
router.put(
  "/applications/:appId/status",
  protect,
  authorize("company"),
  updateApplicationStatus,
);

// ========== AI ==========
router.get("/ai-explain/:jobId", protect, aiExplainJob);
router.get("/ai-suggest", protect, aiSuggestJobs);
router.post("/ai-resume", protect, aiBuildResume);

module.exports = router;
