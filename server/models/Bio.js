const mongoose = require('mongoose');

const bioSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'John Doe'
  },
  location: {
    type: String,
    default: 'San Francisco, CA'
  },
  heroTitle: {
    type: String,
    default: 'Welcome to My Portfolio'
  },
  heroSubtitle: {
    type: String,
    default: 'Full Stack Developer'
  },
  aboutMe: {
    type: String,
    default: 'A passionate developer creating amazing web experiences.'
  },
  resumeUrl: {
    type: String,
    default: ''
  },
  avatarUrl: {
    type: String,
    default: '/uploads/profile.jpg'
  },
  socialLinks: {
    github: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    twitter: { type: String, default: '' },
    email: { type: String, default: '' }
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

bioSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Bio', bioSchema);
