const express = require("express");
const router = express.Router();

const Question = require("../models/Question");

// Get all questions
router.get("/", async (req, res) => {
  try {
    const { category } = req.query;

    const filter = category
      ? { category }
      : {};

    const questions = await Question.find(filter);

    res.json(questions);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

// Add a new question
router.post("/", async (req, res) => {
  try {
    const question = await Question.create(req.body);

    res.status(201).json(question);
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
});

module.exports = router;