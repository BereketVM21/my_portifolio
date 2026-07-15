const express = require('express');
const { body, validationResult } = require('express-validator');
const Experience = require('../models/Experience');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all experience (public)
router.get('/', async (req, res) => {
  try {
    const experience = await Experience.find().sort({ category: 1, order: 1, startDate: -1 });
    res.json(experience);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get by category (public)
router.get('/category/:category', async (req, res) => {
  try {
    const experience = await Experience.find({ category: req.params.category })
      .sort({ order: 1, startDate: -1 });
    res.json(experience);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single experience (public)
router.get('/:id', async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id);
    if (!experience) {
      return res.status(404).json({ message: 'Experience not found' });
    }
    res.json(experience);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create experience (admin only)
router.post('/', auth, [
  body('title').notEmpty().withMessage('Title is required'),
  body('company').notEmpty().withMessage('Company is required'),
  body('startDate').notEmpty().withMessage('Start date is required'),
  body('description').notEmpty().withMessage('Description is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, company, location, type, startDate, endDate, current, description, category, order } = req.body;
    
    const experience = new Experience({
      title,
      company,
      location,
      type,
      startDate,
      endDate: current ? null : endDate,
      current: current || false,
      description,
      category: category || 'Experience',
      order: order || 0
    });

    await experience.save();
    res.status(201).json(experience);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update experience (admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, company, location, type, startDate, endDate, current, description, category, order } = req.body;
    
    const experience = await Experience.findById(req.params.id);
    if (!experience) {
      return res.status(404).json({ message: 'Experience not found' });
    }

    experience.title = title || experience.title;
    experience.company = company || experience.company;
    experience.location = location || experience.location;
    experience.type = type || experience.type;
    experience.startDate = startDate || experience.startDate;
    if (current !== undefined) {
      experience.current = current;
      experience.endDate = current ? null : endDate;
    }
    experience.description = description || experience.description;
    experience.category = category || experience.category;
    if (order !== undefined) experience.order = order;

    await experience.save();
    res.json(experience);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete experience (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id);
    if (!experience) {
      return res.status(404).json({ message: 'Experience not found' });
    }

    await experience.deleteOne();
    res.json({ message: 'Experience deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
