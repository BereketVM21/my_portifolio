const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  defaultBrightness: {
    type: Number,
    default: 100,
    min: 0,
    max: 100
  },
  defaultWallpaper: {
    type: String,
    default: 'navy'
  },
  defaultDarkMode: {
    type: Boolean,
    default: true
  },
  defaultFontSize: {
    type: Number,
    default: 16,
    min: 12,
    max: 24
  },
  availableWallpapers: [{
    name: String,
    value: String,
    preview: String
  }],
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

settingsSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Settings', settingsSchema);
