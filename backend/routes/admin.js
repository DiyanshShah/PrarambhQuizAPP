const express = require('express');
const router = express.Router();
const TestState = require('../models/TestState');
const User = require('../models/User');

// Get test state
router.get('/test-state', async (req, res) => {
  try {
    const testState = await TestState.findOne();
    if (!testState) {
      return res.status(404).json({ error: 'Test state not found' });
    }
    res.json(testState);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all participants
router.get('/participants', async (req, res) => {
  try {
    const participants = await User.find({ isAdmin: false });
    res.json(participants);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Kick participant
router.post('/kick/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    user.isKicked = true;
    await user.save();
    res.json({ message: 'User kicked successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start test
router.post('/start-test', async (req, res) => {
  try {
    const testState = await TestState.findOne();
    if (!testState) {
      return res.status(404).json({ error: 'Test state not found' });
    }
    testState.isTestActive = true;
    await testState.save();
    res.json(testState);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// End test
router.post('/end-test', async (req, res) => {
  try {
    const testState = await TestState.findOne();
    if (!testState) {
      return res.status(404).json({ error: 'Test state not found' });
    }
    testState.isTestActive = false;
    await testState.save();
    res.json(testState);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 