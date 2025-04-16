const mongoose = require('mongoose');

const careerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  skills: [String],
  education: {
    type: String,
    required: true
  },
  salary: {
    min: Number,
    max: Number,
    currency: {
      type: String,
      default: 'USD'
    }
  },
  jobOutlook: {
    growth: Number,
    outlook: String
  },
  relatedCareers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Career'
  }],
  industries: [String],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add text search index
careerSchema.index({ 
  title: 'text', 
  description: 'text', 
  skills: 'text', 
  industries: 'text' 
});

const Career = mongoose.model('Career', careerSchema);

module.exports = Career;