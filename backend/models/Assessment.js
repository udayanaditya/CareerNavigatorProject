const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  options: [{
    text: String,
    value: Number
  }]
});

const assessmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['personality', 'skills', 'interest', 'aptitude'],
    required: true
  },
  questions: [questionSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const resultSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assessment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assessment',
    required: true
  },
  answers: [{
    question: mongoose.Schema.Types.ObjectId,
    selectedOption: Number
  }],
  score: Number,
  recommendedCareers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Career'
  }],
  completedAt: {
    type: Date,
    default: Date.now
  }
});

const Assessment = mongoose.model('Assessment', assessmentSchema);
const AssessmentResult = mongoose.model('AssessmentResult', resultSchema);

module.exports = { Assessment, AssessmentResult };