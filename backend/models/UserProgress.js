const mongoose = require("mongoose");

const userProgressSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true
    },

    completed: {
      type: Number,
      default: 0
    },

    total: {
      type: Number,
      default: 10
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "UserProgress",
  userProgressSchema
);