const express = require("express");
const router = express.Router();

const UserProgress = require("../models/UserProgress");

// Get all progress records
router.get("/", async (req, res) => {
  try {
    const progress = await UserProgress.find();

    res.json(progress);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

// Create progress record
router.post("/", async (req, res) => {
  try {
    const progress = await UserProgress.create(req.body);

    res.status(201).json(progress);
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
});

// Update progress
router.put("/:id", async (req, res) => {
  try {
    const progress = await UserProgress.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true
      }
    );

    res.json(progress);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

module.exports = router;