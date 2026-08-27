const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },

    category: {
      type: String,
      required: true,
      enum: ["Aptitude", "Coding"]
    },

    topic: {
      type: String,
      required: true
    },

    question: {
      type: String,
      required: true
    },

    options: {
      type: [String],
      default: []
    },

    answer: {
      type: String,
      default: ""
    },

    difficulty: {
      type: String,
      default: "Easy"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Question", questionSchema);