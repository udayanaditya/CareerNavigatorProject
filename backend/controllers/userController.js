const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Create new user
    const user = await User.create({
      name,
      email,
      password
    });
    
    // Generate token
    const token = generateToken(user._id);
    
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // Generate token
    const token = generateToken(user._id);
    
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, skills, interests } = req.body;
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update fields
    if (name) user.name = name;
    if (skills) user.skills = skills;
    if (interests) user.interests = interests;
    
    await user.save();
    
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      skills: user.skills,
      interests: user.interests
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getSavedCareers = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('savedCareers');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user.savedCareers);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.saveCareer = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const careerId = req.params.careerId;
    
    // Check if career is already saved
    if (user.savedCareers.includes(careerId)) {
      return res.status(400).json({ message: 'Career already saved' });
    }
    
    // Add to saved careers
    user.savedCareers.push(careerId);
    await user.save();
    
    res.json({ message: 'Career saved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.removeSavedCareer = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const careerId = req.params.careerId;
    
    // Remove from saved careers
    user.savedCareers = user.savedCareers.filter(
      id => id.toString() !== careerId
    );
    await user.save();
    
    res.json({ message: 'Career removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};