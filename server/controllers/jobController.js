const JobPost = require("../models/JobPost");
const User = require("../models/User");
const JobApplication = require("../models/JobApplication");
const axios = require("axios");

// ================= HELPER: MBTI MATCH SCORE =================
const calculateMBTIMatchScore = (userMBTI, jobMBTIs = []) => {
  if (!userMBTI) return 0;

  let bestScore = 0;

  jobMBTIs.forEach((jobMBTI) => {
    let score = 0;
    for (let i = 0; i < 4; i++) {
      if (userMBTI[i] === jobMBTI[i]) score++;
    }
    if (score > bestScore) bestScore = score;
  });

  return bestScore;
};

// ================= HELPER: SKILL MATCH SCORE =================
const calculateSkillMatchScore = (userSkills, jobSkills) => {
  const userSkillNames = userSkills.map((s) => s.skill.toLowerCase());
  const required = jobSkills.map((s) => s.toLowerCase());

  if (!required.length) return 0;

  const matched = required.filter((skill) => userSkillNames.includes(skill));
  return matched.length / required.length; // 0 - 1
};

// ================= HELPER: EXPERIENCE SCORE =================
const calculateExperienceScore = (userSkills, jobSkills) => {
  const levelValue = (level) => {
    const l = level.toLowerCase();
    if (l === "beginner") return 0.5;
    if (l === "intermediate") return 0.8;
    if (l === "advanced") return 0.9;
    return 1; // Expert
  };

  const userSkillMap = {};
  userSkills.forEach((s) => {
    userSkillMap[s.skill.toLowerCase()] = levelValue(s.experienceLevel);
  });

  const scores = jobSkills.map(
    (skill) => userSkillMap[skill.toLowerCase()] || 0
  );

  const avg =
    scores.reduce((a, b) => a + b, 0) / (scores.length || 1);

  return avg;
};


// ================= FINAL MATCH SCORE =================
const calculateMatchScore = (user, job) => {
  const mbtiScore =
    calculateMBTIMatchScore(user.mbtiType, job.preferredMbtiTypes) / 4;
  const skillScore = calculateSkillMatchScore(user.skills, job.requiredSkills);
  const expScore = calculateExperienceScore(user.skills, job.requiredSkills);

  let score = skillScore * 0.6 + mbtiScore * 0.3 + expScore * 0.1;
  if (isNaN(score)) score = 0;

  return score;
};

// ================= GET MY JOBS =================
exports.getMyJobs = async (req, res) => {
  try {
    if (req.user.role !== "company")
      return res.status(403).json({ message: "Access denied" });

    const jobs = await JobPost.find({ createdBy: req.user._id });
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= GET ALL JOBS =================
exports.getJobs = async (req, res) => {
  try {
    const jobs = await JobPost.find({ status: "approved" });
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= GET MATCHED JOBS =================
exports.getMatchedJobs = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    // Populate company name from User model
    const jobs = await JobPost.find({ status: "approved" }).populate({
      path: "company", // field in JobPost
      select: "name", // only get the company name
    });

    const matchedJobs = jobs
      .map((job) => {
        const score = calculateMatchScore(user, job);

        let matchLabel = "Weak Match";
        if (score >= 0.8) matchLabel = "Strong Match";
        else if (score >= 0.6) matchLabel = "Good Match";
        else if (score >= 0.4) matchLabel = "Medium Match";


return {
  ...job._doc,
  matchScore: Math.round(score * 100),
  matchLabel,
  companyName: job.company?.name || "Unknown",
};

      })
      .filter((job) => job.matchScore >= 30)
      .sort((a, b) => b.matchScore - a.matchScore);

    res.status(200).json(matchedJobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= CREATE JOB =================
exports.createJob = async (req, res) => {
  try {
    if (req.user.role !== "company")
      return res.status(403).json({ message: "Only companies can post jobs" });

    const {
      title,
      description,
      requiredSkills,
      location,
      locationType,
      jobType,
      preferredMbtiTypes,
    } = req.body;

    if (!title) return res.status(400).json({ message: "Title is required" });

    const job = await JobPost.create({
      title,
      company: req.user._id,
      description,
      requiredSkills,
      location,
      locationType,
      jobType,
      preferredMbtiTypes,
      createdBy: req.user._id,
      status: "pending",
    });

    res.status(201).json({
      message: "Job created successfully. Waiting for admin approval.",
      job,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= APPROVE JOB =================
exports.approveJob = async (req, res) => {
  try {
    const job = await JobPost.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    job.status = "approved";
    await job.save();

    res.status(200).json({ message: "Job approved successfully", job });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= REJECT JOB =================
exports.rejectJob = async (req, res) => {
  try {
    const job = await JobPost.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    job.status = "rejected";
    await job.save();

    res.status(200).json({ message: "Job rejected successfully", job });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= UPDATE JOB =================
exports.updateJob = async (req, res) => {
  try {
    const job = await JobPost.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.createdBy.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Access denied" });

    if (job.status === "approved")
      return res.status(400).json({
        message: "Approved jobs cannot be edited. Please contact admin.",
      });

    const {
      title,
      description,
      requiredSkills,
      location,
      locationType,
      jobType,
      preferredMbtiTypes,
    } = req.body;

    job.title = title || job.title;
job.description = description || job.description;
job.requiredSkills = requiredSkills || job.requiredSkills;
job.location = location || job.location;
job.locationType = locationType || job.locationType;
job.jobType = jobType || job.jobType;
job.preferredMbtiTypes = preferredMbtiTypes || job.preferredMbtiTypes;


    await job.save();

    res.status(200).json({
      message: "Job updated successfully",
      job,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= DELETE JOB =================
exports.deleteJob = async (req, res) => {
  try {
    const job = await JobPost.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.createdBy.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Access denied" });

    await JobPost.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ================= AI EXPLAIN JOB =================
exports.aiExplainJob = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const job = await JobPost.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // ================== LOCAL SCORE ==================
    const user = await User.findById(req.user._id);
    const score = calculateMatchScore(user, job);
    const matchPercentage = Math.round(score * 100);

    // ================== AI PROMPT ==================
    const prompt = `
You are a helpful assistant.

Job Info:
Title: ${job.title}
Description: ${job.description}
Skills: ${job.requiredSkills.join(", ")}
MBTI: ${job.preferredMbtiTypes.join(", ")}

User Info:
MBTI: ${user.mbtiType}
Skills: ${user.skills.map((s) => s.skill).join(", ")}

Return JSON only in this format:

{
  "jobSummary": "...",
  "skillMatch": {
     "percentage": 0,
     "details": "..."
  },
  "mbtiMatch": {
     "percentage": 0,
     "details": "..."
  },
  "recommendation": "..."
}
`;

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: prompt },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    aiText = response.data.choices[0].message.content;

    let aiJson = {};
    try {
      aiJson = JSON.parse(aiText);
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Failed to parse AI response",
      });
    }

    res.status(200).json({
      success: true,
      matchPercentage,
      ai: aiJson,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ================= AI SUGGEST JOBS =================
exports.aiSuggestJobs = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const jobs = await JobPost.find({ status: "approved" });

    const jobList = jobs.map((job) => ({
      id: job._id,
      title: job.title,
      skills: job.requiredSkills,
      mbti: job.preferredMbtiTypes,
    }));

    const prompt = `
You are a job matching assistant.

User:
MBTI: ${user.mbtiType}
Skills: ${user.skills.map((s) => s.skill).join(", ")}

Jobs:
${JSON.stringify(jobList)}

Return JSON only like this:

{
  "suggestions": [
    {
      "jobId": "...",
      "title": "...",
      "matchPercentage": 0,
      "reason": "..."
    }
  ]
}
`;

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a job matching assistant." },
          { role: "user", content: prompt },
        ],
      },
      {
        headers: {
  Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
  "Content-Type": "application/json",
},
      },
    );

    const aiText = response.data.choices[0].message.content;

    res.status(200).json({
      success: true,
      suggestions: JSON.parse(aiText).suggestions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ================= AI RESUME BUILDER =================
exports.aiBuildResume = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const { jobId } = req.body;

    let job = null;
    if (jobId) {
      job = await JobPost.findById(jobId);
      if (!job) {
        return res.status(404).json({
          success: false,
          message: "Job not found",
        });
      }
    }

    const prompt = `
You are a professional resume writer.

User Info:
Name: ${user.name}
Email: ${user.email}
MBTI: ${user.mbtiType}
Skills: ${user.skills.map((s) => s.skill).join(", ")}
Experience Level: ${user.skills.map((s) => s.experienceLevel).join(", ")}

𝖸𝗎𝗋𝗂, [3/02/2026 9:47 PM]
${
  job
    ? `
Job Info:
Title: ${job.title}
Description: ${job.description}
Required Skills: ${job.requiredSkills.join(", ")}
`
    : ""
}

Write a clean resume in this format:

{
  "resume": {
    "header": {
      "name": "...",
      "email": "...",
      "summary": "..."
    },
    "skills": ["...", "..."],
    "experience": [
      {
        "role": "Student / Beginner",
        "details": "..."
      }
    ],
    "education": "..."
  }
}
`;

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a professional resume writer." },
          { role: "user", content: prompt },
        ],
      },
      {
        headers: {
  Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
  "Content-Type": "application/json",
},
      },
    );

    const aiText = response.data.choices[0].message.content;

    res.status(200).json({
      success: true,
      resume: JSON.parse(aiText).resume,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= APPLY FOR JOB =================
exports.applyForJob = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const userId = req.user._id;

    // Check job exists
    const job = await JobPost.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Prevent duplicate apply
    const alreadyApplied = await JobApplication.findOne({
      job: jobId,
      applicant: userId,
    });

    if (alreadyApplied) {
      return res.status(400).json({
        message: "You have already applied for this job",
      });
    }

    // Create application
    const application = await JobApplication.create({
      job: jobId,
      applicant: userId,
    });

    res.status(201).json({
      message: "Job applied successfully",
      application,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getApplicationStatus = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const userId = req.user._id;

    const application = await JobApplication.findOne({
      applicant: userId,
      job: jobId,
    });

    res.status(200).json({
      hasApplied: application ? true : false,
      status: application ? application.status : null,
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getMyApplications = async (req, res) => {
  try {
    const userId = req.user._id;

    const applications = await JobApplication.find({ applicant: userId })
      .populate("job")
      .sort({ createdAt: -1 });

    res.status(200).json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// ------------------ REVIEW APPLICATION ------------------
exports.reviewApplication = async (req, res) => {
  const { appId } = req.params;

  const application = await JobApplication.findById(appId);
  if (!application) {
    return res.status(404).json({ message: "Application not found" });
  }

  application.status = "reviewed";
  await application.save();

  res.json({ message: "Application marked as reviewed" });
};

// ------------------ ACCEPT APPLICATION ------------------
exports.acceptApplication = async (req, res) => {
  const { appId } = req.params;

  const application = await JobApplication.findById(appId);
  if (!application) {
    return res.status(404).json({ message: "Application not found" });
  }

  application.status = "accepted";
  await application.save();

  res.json({ message: "Application accepted" });
};

// ------------------ REJECT APPLICATION ------------------
exports.rejectApplication = async (req, res) => {
  const { appId } = req.params;

  const application = await JobApplication.findById(appId);
  if (!application) {
    return res.status(404).json({ message: "Application not found" });
  }


application.status = "rejected";
  await application.save();

  res.json({ message: "Application rejected" });
};
exports.getCompanyApplications = async (req, res) => {
  try {
    const companyId = req.user._id;

    const applications = await JobApplication.find()
      .populate({
        path: "job",
        match: { createdBy: companyId },
      })
      .populate("applicant", "name email")
      .sort({ createdAt: -1 });

    // Remove null jobs (not created by this company)
    const filtered = applications.filter((app) => app.job);

    res.status(200).json(filtered);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.getJobApplications = async (req, res) => {
  try {
    const { jobId } = req.params;

    const applications = await JobApplication.find({ job: jobId })
      .populate("applicant", "name email mbtiType skills")
      .sort({ appliedAt: -1 });
console.log(applications[0].applicant);

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: "Failed to load applications" });
  }
};
exports.getCompanyJobsWithCount = async (req, res) => {
  try {
    const companyId = req.user._id;

    const jobs = await JobPost.find({ createdBy: companyId });

    const jobsWithCounts = await Promise.all(
      jobs.map(async (job) => {
        const count = await JobApplication.countDocuments({ job: job._id });
        return { ...job.toObject(), applicantCount: count };
      }),
    );

    res.status(200).json(jobsWithCounts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { appId } = req.params;
    const { status } = req.body;

    const app = await JobApplication.findById(appId);
    if (!app) return res.status(404).json({ message: "Not found" });

    app.status = status;
    await app.save();

    res.status(200).json(app);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Update failed" });
  }
};
const skillPool = [
  "HTML",
  "CSS",
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Vue.js",
  "Angular",
  "Tailwind CSS",
  "Bootstrap",
  "Sass",
  "Node.js",
  "Express.js",
  "NestJS",
  "Django",
  "Flask",
  "Spring Boot",
  "Laravel",
  "MongoDB",
  "MySQL",
  "PostgreSQL",
  "SQLite",
  "Redis",
  "Python",
  "Java",
  "C",
  "C++",
  "C#",
  "PHP",
  "Go",
  "React Native",
  "Flutter",
  "Android",
  "iOS",
  "Docker",
  "Kubernetes",
  "CI/CD",
  "Nginx",
  "AWS",
  "Azure",
  "GCP",
  "Firebase",
  "Jest",
  "Mocha",
  "Cypress",
  "Selenium",
  "Figma",
  "Adobe XD",
  "UX Research",
  "Git",
  "GitHub",
  "GitLab",
  "Postman",
  "VS Code",
  "Communication",
  "Teamwork",
  "Problem Solving",
  "Time Management",
  "Critical Thinking",
];

const mbtiTypes = [
  "INTJ",
  "INTP",
  "ENTJ",
  "ENTP",
  "INFJ",
  "INFP",
  "ENFJ",
  "ENFP",
  "ISTJ",
  "ISFJ",
  "ESTJ",
  "ESFJ",
  "ISTP",
  "ISFP",
  "ESTP",
  "ESFP",
];

/* ================== UTILS ================== */

// 🔒 Strip json from AI
const cleanJson = (text) => {
  return text
    .replace(/json/gi, "") // remove "json" (case-insensitive)
    .replace(/[\r\n]+/g, "") // remove line breaks
    .trim();
};

// Normalize job object to a unique key string
const normalizeKey = (job) =>
  `${job.title}-${job.description}-${job.location}-${job.locationType}-${job.jobType}`
    .toLowerCase()
    .replace(/\s+/g, "");


exports.generateJobsAI = async (req, res) => {
  try {
   if (req.user.role !== "company") {
     return res.status(403).json({
       message: "Only companies can generate job posts",
     });
   }

   const { numJobs = 3 } = req.body;
   if (numJobs < 1 || numJobs > 20) {
     return res.status(400).json({
       message: "numJobs must be between 1 and 20",
     });
   }

    const company = await User.findById(req.user._id);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    
 const generatedJobs = [];
 const uniqueKeys = new Set();
 const usedTitles = new Set();
 let attempts = 0;

    const prompt = `
Generate ONE UNIQUE tech job post.


STRICT RULES:
- JSON ONLY (no text)
- DO NOT use "Frontend Developer" or "Backend Developer"
- Use innovative titles like:
  Software Engineer, UI Engineer, Platform Engineer,
  Web Application Engineer, Product Engineer,
  Full Stack Engineer, Application Developer

FIELDS:
- title (unique, creative)
- description (2–3 lines)
- requiredSkills (1–5 from: ${skillPool.join(", ")})
- location (real city)
- locationType: On-site | Remote | Hybrid
- jobType: Full-time | Part-time | Contract | Internship
- preferredMbtiTypes (1–3 from: ${mbtiTypes.join(", ")})

Format:
{
  "title": "",
  "description": "",
  "requiredSkills": [],
  "location": "",
  "locationType": "On-site | Remote | Hybrid",
  "jobType": "Full-time | Part-time | Contract | Internship",
  "preferredMbtiTypes": []
}
`;

     while (generatedJobs.length < numJobs && attempts < numJobs * 5) {
       attempts++;

       const response = await fetch(
         "https://openrouter.ai/api/v1/chat/completions",
         {
           method: "POST",
           headers: {
  Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
  "Content-Type": "application/json",
},

           body: JSON.stringify({
             model: "gpt-4o-mini",
             messages: [{ role: "user", content: prompt }],
             temperature: 1.1,
           }),
         },
       );

       const data = await response.json();
       const content = data.choices?.[0]?.message?.content;
       if (!content) continue;

       let job;
       try {
         job = JSON.parse(cleanJson(content));
       } catch {
         continue;
       }
       // ❌ avoid duplicate titles in same request
       if (usedTitles.has(job.title.toLowerCase())) continue;

       const key = normalizeKey(job);
       if (uniqueKeys.has(key)) continue;
       usedTitles.add(job.title.toLowerCase());
       uniqueKeys.add(key);

       const savedJob = await JobPost.create({
         ...job,
         company: req.user._id,
         createdBy: req.user._id,
         status: "pending",
         isActive: true,
       });

       generatedJobs.push(savedJob);
     }

    res.json({
      success: true,
      total: generatedJobs.length,
      jobs: generatedJobs,
    });
  } catch (err) {
    console.error("❌ Error generating AI jobs:", err);
    res.status(500).json({ message: err.message });
  }

};