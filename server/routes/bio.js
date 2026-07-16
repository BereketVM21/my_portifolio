const express = require('express');
const multer = require('multer');
const path = require('path');
const { body, validationResult } = require('express-validator');
const Bio = require('../models/Bio');
const auth = require('../middleware/auth');

const router = express.Router();

// Configure multer for profile photo uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed'));
  }
});

// Get bio (public)
router.get('/', async (req, res) => {
  try {
    let bio = await Bio.findOne();
    if (!bio) {
      // Create default bio if none exists
      bio = new Bio();
      await bio.save();
    }
    res.json(bio);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update bio (admin only)
router.put('/', auth, upload.single('avatar'), async (req, res) => {
  try {
    let bio = await Bio.findOne();
    if (!bio) {
      bio = new Bio();
    }

    const { name, location, heroTitle, heroSubtitle, aboutMe, resumeUrl, socialLinks } = req.body;

    if (name !== undefined) bio.name = name;
    if (location !== undefined) bio.location = location;
    if (heroTitle !== undefined) bio.heroTitle = heroTitle;
    if (heroSubtitle !== undefined) bio.heroSubtitle = heroSubtitle;
    if (aboutMe !== undefined) bio.aboutMe = aboutMe;
    if (resumeUrl !== undefined) bio.resumeUrl = resumeUrl;

    if (req.file) {
      bio.avatarUrl = `/uploads/${req.file.filename}`;
    } else if (req.body.avatarUrl !== undefined) {
      bio.avatarUrl = req.body.avatarUrl;
    }

    if (socialLinks !== undefined) {
      let parsedSocialLinks = socialLinks;
      if (typeof socialLinks === 'string') {
        try {
          parsedSocialLinks = JSON.parse(socialLinks);
        } catch (e) {
          parsedSocialLinks = {};
        }
      }
      if (parsedSocialLinks.github !== undefined) bio.socialLinks.github = parsedSocialLinks.github;
      if (parsedSocialLinks.linkedin !== undefined) bio.socialLinks.linkedin = parsedSocialLinks.linkedin;
      if (parsedSocialLinks.twitter !== undefined) bio.socialLinks.twitter = parsedSocialLinks.twitter;
      if (parsedSocialLinks.email !== undefined) bio.socialLinks.email = parsedSocialLinks.email;
    }

    await bio.save();
    res.json(bio);
  } catch (error) {
    console.error('Update bio error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
