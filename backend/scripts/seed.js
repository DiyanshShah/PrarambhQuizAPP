require('dotenv').config();
const mongoose = require('mongoose');
const Question = require('../models/Question');

const pythonQuestions = require('../data/python-questions.json');
const cQuestions = require('../data/c-questions.json');

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');

    // Clear existing questions
    await Question.deleteMany({});
    console.log('Cleared existing questions');

    // Insert Python questions
    const formattedPythonQuestions = pythonQuestions.questions.map(q => ({
      ...q,
      round: 1,
      language: 'python'
    }));
    await Question.insertMany(formattedPythonQuestions);
    console.log('Inserted Python questions');

    // Insert C questions
    const formattedCQuestions = cQuestions.questions.map(q => ({
      ...q,
      round: 1,
      language: 'c'
    }));
    await Question.insertMany(formattedCQuestions);
    console.log('Inserted C questions');

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase(); 