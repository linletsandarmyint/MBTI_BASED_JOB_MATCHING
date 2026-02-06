const MBTIQuestion = require("../models/MBTIQuestion");
const User = require("../models/User");
const MBTIResult = require("../models/MBTIResult");
const MbtiAttempt = require("../models/MbtiAttempt");
const mbtiDescription = require("../seed/mbtiDescription");
// GET 10 random questions
exports.getRandomQuestions = async (req, res) => {
  try {
   const questions = await MBTIQuestion.aggregate([
     { $match: { isActive: true } }, // ✅ ONLY active
     { $sample: { size: 10 } },
   ]);
res.status(200).json({
  success: true,
  total: questions.length,
  questions,
});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Fetch all MBTI questions for admin (with active / archived filter)
exports.getQuestions = async (req, res) => {
  try {
    const { status } = req.query; // active | archived | undefined

    let filter = {};

    if (status === "active") {
      filter.isActive = true;
    } else if (status === "archived") {
      filter.isActive = false;
    }

    const questions = await MBTIQuestion.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: questions.length,
      questions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Save MBTI answers
exports.saveAnswers = async (req, res) => {
  try {
    const { answers } = req.body;
    const userId = req.user.id; // if using authentication
    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ message: "No answers provided" });
    }
    // Convert array to object (Map-compatible)
    const answerMap = {};
    answers.forEach((a) => {
      if (!a.questionId || !a.value) {
       throw new Error("Each answer must have questionId and value");
      }
      answerMap[a.questionId] = a.value;
    });
    const result = await MBTIResult.create({
      user: userId,
      answers: answerMap, // ✅ now it matches Map type
    });

    res.status(200).json({ message: "Progress saved!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to save progress" });
  }
};
exports.getSavedAnswers = async (req, res) => {
  try {
    const userId = req.user.id;

    const saved = await MBTIResult.findOne({ user: userId }).sort({
      createdAt: -1,
    });

    if (!saved) {
      return res.status(200).json({ answers: [] });
    }

    res.status(200).json({ answers: saved.answers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch answers" });
  }
};

// Submit MBTI answers and calculate type
exports.submitAnswers = async (req, res) => {
  try {
    const userId = req.user.id; // ✅ get user from auth middleware

    let { answers } = req.body; // answers can be array of strings or objects
    if (!answers || answers.length !== 10) {
      return res.status(400).json({ message: "Invalid answers" });
    }

    const user = await User.findById(userId);

    // ⏱️ 3-minute cooldown
    if (user.mbtiLastTestAt) {
      const diff = Date.now() - new Date(user.mbtiLastTestAt).getTime();
      if (diff < 3 * 60 * 1000) {
        const remaining = Math.ceil((3 * 60 * 1000 - diff) / 1000);
        return res.status(429).json({
  message: `Please wait ${remaining} seconds before retaking the test`,
});

      }
    }

    // If objects, map to value
    answers = answers.map((a) => (typeof a === "string" ? a : a.value));

    // Initialize counts
    const counts = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };

    // Count letters
    answers.forEach((letter) => {
      if (counts.hasOwnProperty(letter)) {
        counts[letter] += 1;
      } else {
        console.warn("⚠️ Invalid letter found:", letter);
      }
    });

    // Build MBTI type
    const mbtiType =
      (counts.E >= counts.I ? "E" : "I") +
      (counts.S >= counts.N ? "S" : "N") +
      (counts.T >= counts.F ? "T" : "F") +
      (counts.J >= counts.P ? "J" : "P");

    // Save attempt
    await MbtiAttempt.create({
      user: userId,
      answers,
      mbtiType,
    });
    // 🔥 Save MBTI and last test time
    user.mbtiType = mbtiType;
    user.mbtiLastTestAt = new Date();
    await user.save();
    res.status(200).json({ message: "MBTI calculated", mbtiType, counts });
  } catch (error) {
    console.error("❌ MBTI SUBMIT ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};
// Get past MBTI attempts
exports.getPastAttempts = async (req, res) => {
  try {
    const attempts = await MbtiAttempt.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .select("mbtiType createdAt");

    res.json(attempts);
  } catch (err) {
    res.status(500).json({ message: "Failed to load attempts" });
  }
};
// Get description by type
exports.getMbtiDescription = (req, res) => {
  const { type } = req.params;
  const upperType = type.toUpperCase();

  const description = mbtiDescription[upperType];

  if (!description) {
    return res.status(404).json({
      message: "MBTI type not found",
    });
  }

  res.status(200).json({
    type: upperType,
    ...description,
  });
};
// Get current user's MBTI
exports.getMyMbti = async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json({ mbtiType: user.mbtiType });
};
// Get all 16 types
exports.getAllTypes = (req, res) => {
  res.json(mbtiDescription);
};


// -------------------- AI MBTI QUESTION GENERATION --------------------
exports.generateMbtiQuestionAI = async (req, res) => {
  try {
    const prompt = `
Generate 30 unique MBTI questions in JSON array format ONLY.
Rules:
- Two options per question
- Neutral everyday language
- Avoid yes/no questions
- No markdown, no explanations, only valid JSON
- Each option must clearly represent opposite traits
- Format:

[
  {
    "question": "",
    "options": [
      { "text": "", "value": "" },
      { "text": "", "value": "" }
    ]
  }
]

Valid values: E, I, S, N, T, F, J, P
`;

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
          temperature: 0.7,
        }),
      },
    );

    const data = await response.json();
    let content = data.choices?.[0]?.message?.content;
    if (!content)
      return res.status(500).json({ message: "AI returned empty response" });

    // Remove markdown (```json and ```)
    content = content.replace(/```json|```/g, "").trim();

    let questions;
    try {
      questions = JSON.parse(content);
    } catch (err) {
      console.error("Invalid AI JSON:", content);
      return res.status(500).json({ message: "AI returned invalid JSON" });
    }

    // Save each question if not duplicate
    const savedQuestions = [];
    for (const q of questions) {
      const exists = await MBTIQuestion.findOne({ question: q.question });
      if (exists) continue; // skip duplicates

      const saved = await MBTIQuestion.create({
        question: q.question,
        options: q.options,
        isActive: true,
      });
      savedQuestions.push(saved);
    }

    res.json({ success: true, savedQuestions });
  } catch (error) {
    console.error("AI MBTI Error:", error);
    res.status(500).json({ message: "Failed to generate MBTI questions" });
  }
};

exports.deleteAllMbtiQuestions = async (req, res) => {
  try {
    const result = await MBTIQuestion.deleteMany({});
    res.json({
      success: true,
      message: "All MBTI questions deleted",
      deletedCount: result.deletedCount,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// POST /api/mbti/retake
exports.retakeMbti = async (req, res) => {
  try {
    const user = req.user; // from auth middleware

    const NOW = new Date();
    const LIMIT_MINUTES = 3;

    if (user.mbtiLastRetakeAt) {
      const diffMs = NOW - user.mbtiLastRetakeAt;
      const diffMinutes = diffMs / (1000 * 60);

      if (diffMinutes < LIMIT_MINUTES) {
        const remaining = Math.ceil(LIMIT_MINUTES - diffMinutes);
        return res.status(429).json({
          message: `Please wait ${remaining} minute(s) before retaking the test.`,
        });
      }
    }
    // reset MBTI data
    user.mbtiType = null;
    user.mbtiAnswers = {};
    user.mbtiLastRetakeAt = NOW;

    await user.save();

    res.json({ message: "Retake allowed" });
  } catch (err) {
    res.status(500).json({ message: "Retake failed" });
  }
};
exports.compareMbti = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get last 2 attempts
    const attempts = await MbtiAttempt.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(2);

    if (attempts.length < 2) {
      return res.status(400).json({
        message: "You need at least 2 attempts to compare results",
      });
    }

    res.json({
      previous: attempts[1],
      current: attempts[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Compare failed" });
  }
};