const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

// Auth routes
router.post('/register', userController.register);
router.post('/login', userController.login);

// User profile routes
router.get('/profile', auth, userController.getProfile);
router.put('/profile', auth, userController.updateProfile);

// Saved careers
router.get('/saved-careers', auth, userController.getSavedCareers);
router.post('/save-career/:careerId', auth, userController.saveCareer);
router.delete('/saved-career/:careerId', auth, userController.removeSavedCareer);

module.exports = router;
