// const express = require("express");
// const router = express.Router();
// const { protect } = require("../middleware/authMiddleware");

// const {
//   getRandomQuestions,
//   submitMbti,
//   saveProgress,
//   getSavedProgress,
//   getAttempts,
//   retakeMbti,
// } = require("../controllers/mbtiController");

// router.get("/random", protect, getRandomQuestions);
// router.post("/submit", protect, submitMbti);
// router.post("/save", protect, saveProgress);
// router.get("/save", protect, getSavedProgress);
// router.get("/attempts", protect, getAttempts);

// // 🔥 RETAKE ROUTE
// router.post("/retake", protect, retakeMbti);

// module.exports = router;
const express = require("express");
const {
  getQuestions,
  submitAnswers,
  getRandomQuestions,
  saveAnswers,
  getSavedAnswers,
  getPastAttempts,
  getMbtiDescription,
  getAllTypes,
  getMyMbti,
  generateMbtiQuestionAI,
  deleteAllMbtiQuestions,
  retakeMbti,
  compareMbti,
} = require("../controllers/mbtiController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Get 10 random MBTI questions
router.get("/random", getRandomQuestions);

// Fetch questions (protected so only logged-in users can answer)
router.get("/questions", protect, getQuestions);

//save answers
router.post("/save", protect, saveAnswers);
//get saved progress answers
router.get("/save", protect, getSavedAnswers);
// Submit answers
router.post("/submit", protect, submitAnswers);
router.get("/attempts", protect, getPastAttempts);
router.get("/descriptions/:type", getMbtiDescription);
router.get("/all-types", getAllTypes);
router.get("/my-mbti", protect, getMyMbti);
router.post("/generate", protect, generateMbtiQuestionAI);
router.delete("/questions", deleteAllMbtiQuestions);
router.post("/retake", protect, retakeMbti);
router.get("/compare", protect, compareMbti);
module.exports = router;