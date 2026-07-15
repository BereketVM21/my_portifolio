const express = require('express');
const { body, validationResult } = require('express-validator');
const Settings = require('../models/Settings');
const auth = require('../middleware/auth');

const router = express.Router();

// Get settings (public)
router.get('/', async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      // Create default settings if none exists
      settings = new Settings({
        availableWallpapers: [
          { name: 'Navy', value: 'navy', preview: '#001f3f' },
          { name: 'Dark Navy', value: 'dark-navy', preview: '#001830' },
          { name: 'Light Navy', value: 'light-navy', preview: '#003366' }
        ]
      });
      await settings.save();
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update settings (admin only)
router.put('/', auth, async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings({
        availableWallpapers: [
          { name: 'Navy', value: 'navy', preview: '#001f3f' },
          { name: 'Dark Navy', value: 'dark-navy', preview: '#001830' },
          { name: 'Light Navy', value: 'light-navy', preview: '#003366' }
        ]
      });
    }

    const { defaultBrightness, defaultWallpaper, defaultDarkMode, defaultFontSize, availableWallpapers } = req.body;

    if (defaultBrightness !== undefined) {
      const brightness = parseInt(defaultBrightness);
      settings.defaultBrightness = Math.max(0, Math.min(100, brightness));
    }
    if (defaultWallpaper !== undefined) settings.defaultWallpaper = defaultWallpaper;
    if (defaultDarkMode !== undefined) settings.defaultDarkMode = defaultDarkMode;
    if (defaultFontSize !== undefined) settings.defaultFontSize = defaultFontSize;
    if (availableWallpapers !== undefined) settings.availableWallpapers = availableWallpapers;

    await settings.save();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
