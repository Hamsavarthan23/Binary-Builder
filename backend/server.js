const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'placement_portal_super_secret_key_123';

// Middleware
app.use(cors());
app.use(express.json());

// --- MONGOOSE SCHEMAS & MODELS ---
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
  },
  { timestamps: true }
);

const interviewSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    category: { type: String, default: 'General' },
    completed: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const questionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: String, required: true, enum: ['Aptitude', 'Coding'] },
    topic: { type: String, required: true },
    question: { type: String, required: true },
    options: { type: [String], default: [] },
    answer: { type: String, default: '' },
    difficulty: { type: String, default: 'Easy' }
  },
  { timestamps: true }
);

const resourceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    link: { type: String, required: true }
  },
  { timestamps: true }
);

const userProgressSchema = new mongoose.Schema(
  {
    category: { type: String, required: true },
    completed: { type: Number, default: 0 },
    total: { type: Number, default: 10 }
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model('User', userSchema);
const Interview = mongoose.models.Interview || mongoose.model('Interview', interviewSchema);
const Question = mongoose.models.Question || mongoose.model('Question', questionSchema);
const Resource = mongoose.models.Resource || mongoose.model('Resource', resourceSchema);
const UserProgress = mongoose.models.UserProgress || mongoose.model('UserProgress', userProgressSchema);

// --- AUTOMATIC DATABASE SEEDING ---
const seedData = async () => {
  try {
    await Question.deleteMany({});
    await Resource.deleteMany({});
    await Interview.deleteMany({});
    await UserProgress.deleteMany({});

    console.log("Cleared old database records.");

    // Questions (Aptitude & Coding)
    await Question.insertMany([
      {
        title: "Speed, Distance, and Time",
        category: "Aptitude",
        topic: "Time & Distance",
        question: "A train running at 60 km/h crosses a pole in 9 seconds. What is the length of the train?",
        options: ["120m", "150m", "180m", "300m"],
        answer: "150m",
        difficulty: "Easy"
      },
      {
        title: "Percentage Basics",
        category: "Aptitude",
        topic: "Percentages",
        question: "What is 20% of 150?",
        options: ["20", "25", "30", "35"],
        answer: "30",
        difficulty: "Easy"
      },
      {
        title: "Work and Time",
        category: "Aptitude",
        topic: "Time & Work",
        question: "A can do a piece of work in 10 days and B in 15 days. In how many days can they complete it together?",
        options: ["5 days", "6 days", "8 days", "9 days"],
        answer: "6 days",
        difficulty: "Medium"
      },
      {
        title: "Profit and Loss Margin",
        category: "Aptitude",
        topic: "Profit & Loss",
        question: "If an item bought for $80 is sold for $100, what is the profit percentage?",
        options: ["15%", "20%", "25%", "30%"],
        answer: "25%",
        difficulty: "Easy"
      },
      {
        title: "Two Sum",
        category: "Coding",
        topic: "Arrays",
        question: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
        options: [],
        answer: "Use a Hash Map for O(n) time and O(n) space complexity.",
        difficulty: "Easy"
      },
      {
        title: "Reverse a Linked List",
        category: "Coding",
        topic: "Linked Lists",
        question: "Given the head of a singly linked list, reverse the list and return its new head.",
        options: [],
        answer: "Iterative pointer manipulation using prev, current, and next pointers.",
        difficulty: "Medium"
      },
      {
        title: "Valid Anagram",
        category: "Coding",
        topic: "Strings",
        question: "Given two strings s and t, return true if t is an anagram of s, and false otherwise.",
        options: [],
        answer: "Count character frequencies using a fixed-size array or hash map.",
        difficulty: "Easy"
      }
    ]);

    // Resources
    await Resource.insertMany([
      {
        title: "DSA Roadmap 2026",
        description: "Complete step-by-step guide to mastering Data Structures and Algorithms.",
        category: "Coding",
        link: "https://geeksforgeeks.org"
      },
      {
        title: "Aptitude & Reasoning Practice",
        description: "Top quantitative aptitude problems with detailed formulas.",
        category: "Aptitude",
        link: "https://indiabix.com"
      },
      {
        title: "System Design Primer",
        description: "Comprehensive guide to designing scalable web applications and microservices.",
        category: "System Design",
        link: "https://github.com/donnemartin/system-design-primer"
      }
    ]);

    // Interviews
    await Interview.insertMany([
      {
        question: "Explain the difference between SQL and NoSQL databases.",
        category: "Database",
        completed: false
      },
      {
        question: "What is the Virtual DOM in React and how does reconciliation work?",
        category: "Frontend",
        completed: false
      },
      {
        question: "What are the core differences between TCP and UDP protocols?",
        category: "Networking",
        completed: false
      }
    ]);

    // Progress
    await UserProgress.insertMany([
      { category: "Aptitude", completed: 4, total: 10 },
      { category: "Coding", completed: 3, total: 12 },
      { category: "Interview Prep", completed: 2, total: 8 }
    ]);

    console.log("Database seeded successfully!");
  } catch (err) {
    console.error("Error seeding database:", err.message);
  }
};

// --- MONGODB CONNECTION ---
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/placement_portal';

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected Successfully');
    seedData();
  })
  .catch((err) => console.error('MongoDB Connection Error:', err.message));

// --- API ROUTES ---

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Placement Portal API Running' });
});

// --- AUTHENTICATION ROUTES ---

// 1. Register User
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Please enter all required fields.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'An account with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      token,
      user: { id: newUser._id, name: newUser.name, email: newUser.email },
      message: 'Account created successfully!'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Login User
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Please enter all fields.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'User does not exist. Please register first.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
      message: 'Logged in successfully!'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- DATA ROUTES ---

// Questions
app.get('/api/questions', async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const questions = await Question.find(filter);
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/questions', async (req, res) => {
  try {
    const newQuestion = new Question(req.body);
    const saved = await newQuestion.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Resources
app.get('/api/resources', async (req, res) => {
  try {
    const resources = await Resource.find();
    res.json(resources);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/resources', async (req, res) => {
  try {
    const newResource = new Resource(req.body);
    const saved = await newResource.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Interviews
app.get('/api/interviews', async (req, res) => {
  try {
    const interviews = await Interview.find();
    res.json(interviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/interviews', async (req, res) => {
  try {
    const newInterview = new Interview(req.body);
    const saved = await newInterview.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Progress
app.get('/api/progress', async (req, res) => {
  try {
    const progress = await UserProgress.find();
    res.json(progress);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/progress', async (req, res) => {
  try {
    const newProgress = new UserProgress(req.body);
    const saved = await newProgress.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// --- START SERVER ---
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});