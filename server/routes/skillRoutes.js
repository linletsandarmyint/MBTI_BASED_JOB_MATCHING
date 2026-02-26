const express = require("express");
const router = express.Router();
const Skill = require("../models/Skill");

// GET all skills
router.get("/", async (req, res) => {
  try {
    const skills = await Skill.find();
    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
