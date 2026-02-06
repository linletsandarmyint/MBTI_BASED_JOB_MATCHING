const MBTIQuestion = require("../models/MBTIQuestion");
const User = require("../models/User");
const JobPost = require("../models/JobPost");
const JobApplication = require("../models/JobApplication");
const { logAudit } = require("../middleware/auditLogger");

// ================= CREATE MBTI QUESTION(S) =================
exports.createMBTIQuestion = async (req, res) => {
  try {
    // Get questions from body
    let questions = req.body.questions || req.body;

    // Case 1: single question → convert to array
    if (!Array.isArray(questions)) {
      questions = [questions];
    }

    // Validate each question
    for (const q of questions) {
      if (!q.question || !Array.isArray(q.options)) {
        return res.status(400).json({
          message: "Each question must have question text and options array",
        });
      }
    }

    // Insert as separate documents
    const savedQuestions = await MBTIQuestion.insertMany(questions);

    res.status(201).json({
      message: "MBTI question(s) created successfully",
      count: savedQuestions.length,
      questions: savedQuestions,
    });
  } catch (error) {
    console.error("❌ ADMIN CREATE QUESTION ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET ADMIN DASHBOARD STATS
 */
exports.getAdminDashboardStats = async (req, res) => {
  try {
    /* ================= USERS ================= */

    const totalUsers = await User.countDocuments();

    /* ================= COMPANIES ================= */
    const totalCompanies = await User.countDocuments({ role: "company" });
    const activeCompanies = await User.countDocuments({
      role: "company",
      isActive: true,
    });
    const deactivatedCompanies = await User.countDocuments({
      role: "company",
      isActive: false,
    });

    // OPTIONAL (only works if isActive exists)
    const activeUsers = await User.countDocuments({ isActive: true });
    const deactivatedUsers = await User.countDocuments({ isActive: false });

    /* ================= JOB POSTS ================= */

    const totalJobs = await JobPost.countDocuments();

    const activeJobs = await JobPost.countDocuments({ isActive: true });
    const archivedJobs = await JobPost.countDocuments({ isActive: false });

    /* ================= MBTI ================= */

    const totalMbtiQuestions = await MBTIQuestion.countDocuments();

    res.status(200).json({
      users: {
        total: totalUsers,
        active: activeUsers,
        deactivated: deactivatedUsers,
      },
      companies: {
        total: totalCompanies,
        active: activeCompanies,
        deactivated: deactivatedCompanies,
      },
      jobs: {
        total: totalJobs,
        active: activeJobs,
        archived: archivedJobs,
      },
      mbti: {
        questions: totalMbtiQuestions,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
// ================= GET ALL USERS =================
exports.getAllUsers = async (req, res) => {
  try {
    const { search, role, status } = req.query;

    let filter = {};

    // Search by name or email
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    // Filter by role
    if (role) {
      filter.role = role;
    }

    // Filter by status
    if (status === "active") filter.isActive = true;
    if (status === "deactivated") filter.isActive = false;

    const users = await User.find(filter).sort({ createdAt: -1 });

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    user.isActive = !user.isActive;
    await user.save();
    res.status(200).json({ message: "User status updated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await User.findByIdAndDelete(req.params.id);

    // 🔴 AUDIT LOG
    await logAudit({
      adminId: req.user._id,
      action: "DELETE_USER",
      entity: "User",
      entityId: user._id,
      details: `Deleted user: ${user.email}`,
    });

    res.status(200).json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// ADMIN: ARCHIVE / UNARCHIVE JOB
exports.toggleJobArchive = async (req, res) => {
  try {
    const job = await JobPost.findById(req.params.id);
    job.isActive = !job.isActive;
    await job.save();
    res.status(200).json({ message: "Job updated", job });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADMIN: DELETE JOB
exports.deleteJobAdmin = async (req, res) => {
  try {
    await JobPost.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Job deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADMIN: GET JOB DETAILS
exports.getJobDetails = async (req, res) => {
  try {
    const job = await JobPost.findById(req.params.id)
      .populate("company", "name email");

    const applicants = await JobApplication.countDocuments({ job: job._id });

    res.status(200).json({ job, applicants });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
/* ================= GET ALL JOBS (WITH APPLICANT COUNT) ================= */
exports.getAllJobs = async (req, res) => {
  try {
    const { search, status } = req.query;

    let filter = {};
    if (search) filter.title = { $regex: search, $options: "i" };
    if (status === "active") filter.isActive = true;
    if (status === "archived") filter.isActive = false;

    const jobs = await JobPost.find(filter)
      .populate("company", "name email")
      .sort({ createdAt: -1 });

    const jobsWithCounts = await Promise.all(
      jobs.map(async (job) => {
        const count = await JobApplication.countDocuments({
          job: job._id,
        });

        return {
          ...job.toObject(),
          applicantCount: count,
        };
      })
    );

    res.status(200).json(jobsWithCounts);
  } catch (error) {
    console.error("ADMIN JOB FETCH ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};
// ================= MBTI QUESTIONS =================

// ADMIN: GET ALL MBTI QUESTIONS (active + archived)
exports.getAllMBTIQuestions = async (req, res) => {
  try {
    const { status } = req.query;

    let filter = {};
    if (status === "active") filter.isActive = true;
    if (status === "archived") filter.isActive = false;

    const questions = await MBTIQuestion.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: questions.length,
      questions,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADMIN: ARCHIVE / UNARCHIVE MBTI QUESTION
exports.toggleMBTIQuestionStatus = async (req, res) => {
  try {
    const question = await MBTIQuestion.findById(req.params.id);
    question.isActive = !question.isActive;
    await question.save();

    res.status(200).json({
      success: true,
      message: "Question status updated",
      isActive: question.isActive,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.updateMbtiQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { question, options, isActive } = req.body;

    // Validate
    if (!question || !Array.isArray(options)) {
      return res.status(400).json({
        message: "Question text and options array are required",
      });
    }

    const updatedQuestion = await MBTIQuestion.findByIdAndUpdate(
      id,
      { question, options, isActive },
      { new: true },
    );
    if (!updatedQuestion) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.status(200).json({
      success: true,
      message: "Question updated successfully",
      question: updatedQuestion,
    });
  } catch (error) {
    console.error("UPDATE MBTI QUESTION ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};
// ADMIN: DELETE MBTI QUESTION
exports.deleteMbtiQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    const question = await MBTIQuestion.findById(id);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    await MBTIQuestion.findByIdAndDelete(id);

    res.status(200).json({ message: "Question deleted successfully" });
  } catch (error) {
    console.error("DELETE MBTI QUESTION ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};
// ADMIN: APPROVE JOB
exports.approveJob = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await JobPost.findById(id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    job.status = "approved";
    job.isActive = true;
    await job.save();

    // 🔴 AUDIT LOG
    await logAudit({
      adminId: req.user._id,
      action: "APPROVE_JOB",
      targetType: "JobPost",
      targetId: job._id,
      description: `Approved job: ${job.title}`,
    });

    res.status(200).json({
      message: "Job approved successfully",
      job,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ADMIN: REJECT JOB
exports.rejectJob = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await JobPost.findById(id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    job.status = "rejected";
    job.isActive = false;
    await job.save();

    // 🔴 AUDIT LOG
    await logAudit({
      adminId: req.user._id,
      action: "REJECT_JOB",
      targetType: "JobPost",
      targetId: job._id,
      description: `Rejected job: ${job.title}`,
    });

    res.status(200).json({
      message: "Job rejected successfully",
      job,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const AuditLog = require("../models/AuditLog");

exports.getAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find()
      .populate("admin", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      total: logs.length,
      logs,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};