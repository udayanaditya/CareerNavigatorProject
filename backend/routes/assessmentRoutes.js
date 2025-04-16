const express = require('express');
const router = express.Router();
const assessmentController = require('../controllers/assessmentController');
const auth = require('../middleware/auth');

// Assessment routes
router.get('/', assessmentController.getAllAssessments);
router.get('/:id', assessmentController.getAssessmentById);

// Assessment results
router.post('/:id/submit', auth, assessmentController.submitAssessment);
router.get('/results/:id', auth, assessmentController.getAssessmentResult);
router.get('/user/results', auth, assessmentController.getUserAssessmentResults);

// Admin routes
router.post('/', auth, assessmentController.createAssessment);
router.put('/:id', auth, assessmentController.updateAssessment);
router.delete('/:id', auth, assessmentController.deleteAssessment);

module.exports = router;