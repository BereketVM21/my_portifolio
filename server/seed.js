require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const Bio = require('./models/Bio');
const Settings = require('./models/Settings');
const Skill = require('./models/Skill');
const Project = require('./models/Project');
const Experience = require('./models/Experience');

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio');
    console.log('Connected to MongoDB');

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
    console.log('Admin created');

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
    console.log('Bio created');

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
    console.log('Settings created');

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
    console.log('Skills created');

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
    console.log('Experience created');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
