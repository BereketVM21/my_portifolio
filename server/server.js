require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Import routes
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const skillRoutes = require('./routes/skills');
const experienceRoutes = require('./routes/experience');
const messageRoutes = require('./routes/messages');
const bioRoutes = require('./routes/bio');
const settingsRoutes = require('./routes/settings');
const proxyRoutes = require('./routes/proxy');

// Import models for seeding
const Admin = require('./models/Admin');
const Bio = require('./models/Bio');
const Settings = require('./models/Settings');
const Skill = require('./models/Skill');
const Project = require('./models/Project');
const Experience = require('./models/Experience');

const app = express();



// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Portfolio API is running successfully!' });
});

app.get('/api/seed', async (req, res) => {
  if (req.query.confirm !== 'true') {
    return res.status(400).json({ message: 'Please add ?confirm=true to the URL to seed the database.' });
  }
  try {
    // Clear existing data
    await Admin.deleteMany({});
    await Bio.deleteMany({});
    await Settings.deleteMany({});
    await Skill.deleteMany({});
    await Project.deleteMany({});
    await Experience.deleteMany({});

    // Create admin
    const admin = new Admin({
      username: 'admin',
      password: 'admin123' // Will be hashed automatically
    });
    await admin.save();

    // Create bio
    const bio = new Bio({
      name: 'John Doe',
      location: 'San Francisco, CA',
      heroTitle: 'Welcome to My Portfolio',
      heroSubtitle: 'Full Stack Developer',
      aboutMe: 'A passionate developer creating amazing web experiences with modern technologies.',
      socialLinks: {
        github: 'https://github.com/yourusername',
        linkedin: 'https://linkedin.com/in/yourusername',
        email: 'your.email@example.com'
      }
    });
    await bio.save();

    // Create settings
    const settings = new Settings({
      defaultBrightness: 100,
      defaultWallpaper: 'navy',
      defaultDarkMode: true,
      defaultFontSize: 16,
      availableWallpapers: [
        { name: 'Navy', value: 'navy', preview: '#001f3f' },
        { name: 'Dark Navy', value: 'dark-navy', preview: '#001830' },
        { name: 'Light Navy', value: 'light-navy', preview: '#003366' }
      ]
    });
    await settings.save();

    // Create sample skills
    const skills = [
      { name: 'React', category: 'Frontend', proficiency: 90, order: 1 },
      { name: 'JavaScript', category: 'Frontend', proficiency: 85, order: 2 },
      { name: 'HTML/CSS', category: 'Frontend', proficiency: 90, order: 3 },
      { name: 'Node.js', category: 'Backend', proficiency: 80, order: 1 },
      { name: 'Express', category: 'Backend', proficiency: 75, order: 2 },
      { name: 'MongoDB', category: 'Backend', proficiency: 70, order: 3 },
      { name: 'Git', category: 'Tools', proficiency: 85, order: 1 },
      { name: 'VS Code', category: 'Tools', proficiency: 90, order: 2 }
    ];
    await Skill.insertMany(skills);

    // Create sample experience
    const experiences = [
      {
        title: 'Senior Full Stack Developer',
        company: 'Tech Company Inc.',
        location: 'San Francisco, CA',
        type: 'Full-time',
        startDate: '2022-01-01',
        current: true,
        description: 'Leading development of web applications using React and Node.js.',
        category: 'Experience',
        order: 1
      },
      {
        title: 'Web Developer',
        company: 'Digital Agency',
        location: 'New York, NY',
        type: 'Full-time',
        startDate: '2020-06-01',
        endDate: '2021-12-31',
        current: false,
        description: 'Developed responsive websites and web applications for clients.',
        category: 'Experience',
        order: 2
      },
      {
        title: 'Bachelor of Computer Science',
        company: 'University of Technology',
        location: 'Boston, MA',
        type: 'Full-time',
        startDate: '2016-09-01',
        endDate: '2020-05-31',
        current: false,
        description: 'Graduated with honors. Focus on software engineering and web development.',
        category: 'Education',
        order: 1
      }
    ];
    await Experience.insertMany(experiences);

    res.json({ 
      message: 'Database seeded successfully!', 
      adminCredentials: {
        username: 'admin',
        password: 'admin123'
      }
    });
  } catch (error) {
    console.error('Error seeding database:', error);
    res.status(500).json({ message: 'Error seeding database', error: error.message });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/experience', experienceRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/bio', bioRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api', proxyRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
