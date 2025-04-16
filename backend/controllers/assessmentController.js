const { Assessment, AssessmentResult } = require('../models/Assessment');
const Career = require('../models/Career');
const User = require('../models/User');

exports.getAllAssessments = async (req, res) => {
  try {
    const assessments = await Assessment.find();
    res.json(assessments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getAssessmentById = async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.id);
    
    if (!assessment) {
      return res.status(404).json({ message: 'Assessment not found' });
    }
    
    res.json(assessment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.createAssessment = async (req, res) => {
  try {
    const { title, description, type, questions } = req.body;
    
    const assessment = await Assessment.create({
      title,
      description,
      type,
      questions
    });
    
    res.status(201).json(assessment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateAssessment = async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.id);
    
    if (!assessment) {
      return res.status(404).json({ message: 'Assessment not found' });
    }
    
    const updatedAssessment = await Assessment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    res.json(updatedAssessment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteAssessment = async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.id);
    
    if (!assessment) {
      return res.status(404).json({ message: 'Assessment not found' });
    }
    
    await assessment.remove();
    res.json({ message: 'Assessment removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.submitAssessment = async (req, res) => {
  try {
    const { answers } = req.body;
    const assessmentId = req.params.id;
    const userId = req.user.id;
    
    const assessment = await Assessment.findById(assessmentId);
    if (!assessment) {
      return res.status(404).json({ message: 'Assessment not found' });
    }
    
    // Calculate score based on answers
    let score = 0;
    answers.forEach(answer => {
      const question = assessment.questions.id(answer.question);
      if (question) {
        const option = question.options.find(opt => opt.value === answer.selectedOption);
        if (option) {
          score += option.value;
        }
      }
    });
    
    // Generate career recommendations based on assessment type and score
    let recommendedCareers = [];
    
    if (assessment.type === 'skills') {
      // Find careers that match user's skills from answers
      const userSkills = [];
      score = score / answers.length; // Normalize score
      
      // Extract skills based on answers
      if (score > 3) { // Assuming 5-point scale
        // High score indicates strong skills
        // Find careers matching those skills
        recommendedCareers = await Career.find({ 
          skills: { $in: userSkills } 
        }).limit(5);
      }
    } else if (assessment.type === 'interest') {
      // Find careers based on interests
      const interests = [];
      recommendedCareers = await Career.find({
        industries: { $in: interests }
      }).limit(5);
    }
    
    // Create assessment result
    const result = await AssessmentResult.create({
      user: userId,
      assessment: assessmentId,
      answers,
      score,
      recommendedCareers: recommendedCareers.map(career => career._id)
    });
    
    // Update user's completed assessments
    await User.findByIdAndUpdate(userId, {
      $push: { completedAssessments: assessmentId }
    });
    
    // Return result with populated careers
    const populatedResult = await AssessmentResult.findById(result._id)
      .populate('recommendedCareers');
    
    res.status(201).json(populatedResult);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getAssessmentResult = async (req, res) => {
  try {
    const result = await AssessmentResult.findById(req.params.id)
      .populate('assessment')
      .populate('recommendedCareers');
    
    if (!result) {
      return res.status(404).json({ message: 'Result not found' });
    }
    
    // Check if result belongs to user
    if (result.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getUserAssessmentResults = async (req, res) => {
  try {
    const results = await AssessmentResult.find({ user: req.user.id })
      .populate('assessment')
      .populate('recommendedCareers');
    
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
