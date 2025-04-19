require('dotenv').config();
const mongoose = require('mongoose');
const TestState = require('../models/TestState');

async function seedTestState() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');

    // Check if test state already exists
    const existingTestState = await TestState.findOne();
    if (existingTestState) {
      console.log('Test state already exists');
      process.exit(0);
    }

    // Create new test state
    const testState = new TestState({
      isTestActive: false,
      currentRound: 1,
      questionTimeLimit: 60
    });

    await testState.save();
    console.log('Test state created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding test state:', error);
    process.exit(1);
  }
}

seedTestState(); 