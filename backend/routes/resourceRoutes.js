const express = require("express");
const router = express.Router();

const Resource = require("../models/Resource");

// Get all resources
router.get("/", async (req, res) => {
  try {
    const resources = await Resource.find();

    res.json(resources);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

// Add a new resource
router.post("/", async (req, res) => {
  try {
    const resource = await Resource.create(req.body);

    res.status(201).json(resource);
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
});

module.exports = router;