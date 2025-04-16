const Career = require('../models/Career');

exports.getAllCareers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const careers = await Career.find()
      .skip(skip)
      .limit(limit)
      .sort({ title: 1 });
    
    const total = await Career.countDocuments();
    
    res.json({
      careers,
      page,
      pages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.searchCareers = async (req, res) => {
  try {
    const { query, skills, industries } = req.query;
    const searchQuery = {};
    
    // Text search
    if (query) {
      searchQuery.$text = { $search: query };
    }
    
    // Filter by skills
    if (skills) {
      searchQuery.skills = { $in: Array.isArray(skills) ? skills : [skills] };
    }
    
    // Filter by industries
    if (industries) {
      searchQuery.industries = { $in: Array.isArray(industries) ? industries : [industries] };
    }
    
    const careers = await Career.find(searchQuery);
    res.json(careers);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getCareerById = async (req, res) => {
  try {
    const career = await Career.findById(req.params.id).populate('relatedCareers');
    
    if (!career) {
      return res.status(404).json({ message: 'Career not found' });
    }
    
    res.json(career);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.createCareer = async (req, res) => {
  try {
    const { title, description, skills, education, salary, jobOutlook, industries } = req.body;
    
    const career = await Career.create({
      title,
      description,
      skills,
      education,
      salary,
      jobOutlook,
      industries
    });
    
    res.status(201).json(career);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateCareer = async (req, res) => {
  try {
    const career = await Career.findById(req.params.id);
    
    if (!career) {
      return res.status(404).json({ message: 'Career not found' });
    }
    
    const updatedCareer = await Career.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    res.json(updatedCareer);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteCareer = async (req, res) => {
  try {
    const career = await Career.findById(req.params.id);
    
    if (!career) {
      return res.status(404).json({ message: 'Career not found' });
    }
    
    await career.remove();
    res.json({ message: 'Career removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};