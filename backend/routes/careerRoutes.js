const express = require('express');
const router = express.Router();
const careerController = require('../controllers/careerController');
const auth = require('../middleware/auth');

// Career routes available to all
router.get('/', careerController.getAllCareers);
router.get('/search', careerController.searchCareers);
router.get('/:id', careerController.getCareerById);

// Admin routes (protected)
router.post('/', auth, careerController.createCareer);
router.put('/:id', auth, careerController.updateCareer);
router.delete('/:id', auth, careerController.deleteCareer);

module.exports = router;