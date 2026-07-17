const express = require('express');
const multer = require('multer');
const path = require('path');
const { body, validationResult } = require('express-validator');
const Bio = require('../models/Bio');
const auth = require('../middleware/auth');

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }
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
router.put('/', auth, (req, res, next) => {
  upload.single('avatar')(req, res, (err) => {
    if (err) {
      console.error('Multer error:', err);
    }
    next();
  });
}, async (req, res) => {
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
      bio.avatarUrl = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
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
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
