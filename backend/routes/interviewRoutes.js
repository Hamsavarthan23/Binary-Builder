const express = require("express");
const router = express.Router();

const Interview = require("../models/Interview");

// Get all interview questions
router.get("/", async (req, res) => {
  try {
    const interviews = await Interview.find();

    res.json(interviews);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

// Add interview question
router.post("/", async (req, res) => {
  try {
    const interview = await Interview.create(req.body);

    res.status(201).json(interview);
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
});

// Update interview completion status
router.put("/:id", async (req, res) => {
  try {
    const interview = await Interview.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true
      }
    );

    res.json(interview);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

module.exports = router;