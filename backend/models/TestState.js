const mongoose = require('mongoose');

const testStateSchema = new mongoose.Schema({
  isTestActive: {
    type: Boolean,
    default: false
  },
  currentRound: {
    type: Number,
    default: 1
  },
  questionTimeLimit: {
    type: Number,
    default: 60
  }
});

module.exports = mongoose.model('TestState', testStateSchema); 