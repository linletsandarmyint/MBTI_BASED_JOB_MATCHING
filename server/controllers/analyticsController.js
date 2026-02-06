const JobApplication = require("../models/JobApplication");
const JobPost = require("../models/JobPost");

/* MBTI-specific job trends
 */
const getJobTrendsByMbti = async (req, res) => {
  try {
    const { mbti, from, to } = req.query;

    if (!mbti || !from || !to) {
      return res.status(400).json({
        message: "mbti, from, and to are required",
      });
    }

    const trends = await JobApplication.aggregate([
      { $match: { appliedAt: { $gte: new Date(from), $lte: new Date(to) } } },
      {
        $lookup: {
          from: "users",
          localField: "applicant",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      { $match: { "user.mbtiType": mbti } },
      {
        $lookup: {
          from: "jobposts",
          localField: "job",
          foreignField: "_id",
          as: "job",
        },
      },
      { $unwind: "$job" },
      {
        $group: {
          _id: "$job.title",
          applications: { $sum: 1 },
        },
      },
    ]);

    res.json({
      mbti,
      topJobs: trends.map((t) => ({
        jobTitle: t._id,
        applications: t.applications,
      })),
    });
  } catch (err) {
    res.status(500).json({ message: "Analytics failed" });
  }
};

/* Total applications per MBTI
 */
const getMbtiJobTrends = async (req, res) => {
  try {
    const trends = await JobApplication.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "applicant",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $group: {
          _id: "$user.mbtiType",
          count: { $sum: 1 },
        },
      },
    ]);

    res.json({
      trends: trends.map((t) => ({
        mbti: t._id || "Unknown",
        count: t.count,
      })),
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Job → MBTI distribution (Big-Data style)
 */
const getJobTrends = async (req, res) => {
  try {
    const jobs = await JobPost.find({});
    const trends = [];

    for (const job of jobs) {
      const stats = await JobApplication.aggregate([
        { $match: { job: job._id } },
        {
          $lookup: {
            from: "users",
            localField: "applicant",
            foreignField: "_id",
            as: "user",
          },
        },
        { $unwind: "$user" },
        {
          $group: {
            _id: "$user.mbtiType",
            count: { $sum: 1 },
          },
        },
      ]);

      trends.push({
        jobTitle: job.title,
        mbtiStats: stats.map((s) => ({
          mbti: s._id,
          count: s.count,
        })),
      });
    }

    res.json({ jobTrends: trends });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  getJobTrendsByMbti,
  getMbtiJobTrends,
  getJobTrends,
};