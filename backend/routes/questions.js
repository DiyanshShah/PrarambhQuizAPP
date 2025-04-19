const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const auth = require('../middleware/auth');

// Get questions for a specific round and language
router.get('/:language/:round', auth, async (req, res) => {
  try {
    const { language, round } = req.params;
    const questions = await Question.find({ language, round })
      .select('-correctAnswer') // Don't send correct answer to client
      .limit(20);

    if (!questions.length) {
      return res.status(404).json({ error: 'No questions found' });
    }

    res.json(questions);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Submit answer and get result
router.post('/submit', auth, async (req, res) => {
  try {
    const { questionId, answer } = req.body;
    const question = await Question.findById(questionId);

    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    const isCorrect = question.correctAnswer === answer;
    res.json({ isCorrect });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update user's score and round completion
router.post('/complete-round', auth, async (req, res) => {
  try {
    const { round, language, score } = req.body;
    const user = req.user;

    // Add score
    user.scores.push({
      round,
      language,
      score
    });

    // Update round completion
    const roundIndex = user.roundsCompleted.findIndex(
      r => r.round === round && r.language === language
    );

    if (roundIndex === -1) {
      user.roundsCompleted.push({
        round,
        language,
        completed: true
      });
    } else {
      user.roundsCompleted[roundIndex].completed = true;
    }

    await user.save();
    res.json({ message: 'Round completed successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router; 