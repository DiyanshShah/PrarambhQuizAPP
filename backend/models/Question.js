const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  round: {
    type: Number,
    required: true
  },
  language: {
    type: String,
    required: true,
    enum: ['python', 'c']
  },
  question: {
    type: String,
    required: true
  },
  options: {
    type: [String],
    required: true,
    validate: [arrayLimit, 'Options must have exactly 4 items']
  },
  correctAnswer: {
    type: String,
    required: true
  }
});

function arrayLimit(val) {
  return val.length === 4;
}

const Question = mongoose.model('Question', questionSchema);
module.exports = Question; 