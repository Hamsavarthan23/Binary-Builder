const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true
    },

    category: {
      type: String,
      default: "General"
    },

    completed: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Interview", interviewSchema);