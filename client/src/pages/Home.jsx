import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import OSDashboard from '../components/OSDashboard';
import HeroLaptop from '../components/HeroLaptop';

const Home = () => {
  const [bio, setBio] = useState(null);
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [experience, setExperience] = useState([]);
  const [loading, setLoading] = useState(true);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState(null);
  const [osOpen, setOsOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [bioRes, skillsRes, projectsRes, experienceRes] = await Promise.all([
        api.getBio(),
        api.getSkills(),
        api.getProjects(),
        api.getExperience()
      ]);

      setBio(bioRes.data);
      setSkills(skillsRes.data);
      setProjects(projectsRes.data);
      setExperience(experienceRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setFormStatus(null);

    try {
      await api.createMessage(contactForm);
      setFormStatus({ type: 'success', message: 'Message sent successfully!' });
      setContactForm({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setFormStatus({ type: 'error', message: 'Failed to send message. Please try again.' });
    }
  };

  if (loading) {
    return <div className="spinner"></div>;
  }

  return (
    <div className="home">
      {/* Windows 11 Desktop Overlay */}
      <OSDashboard bio={bio} skills={skills} projects={projects} isFullscreen={osOpen} setIsFullscreen={setOsOpen} />

      {/* Navbar */}
      <nav style={{
        position: 'fixed',
        top: 0,
        right: 0,
        left: 0,
        zIndex: 999,
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        padding: '16px 40px',
        backgroundColor: 'transparent'
      }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {[
            { label: 'Home', href: '#hero' },
            { label: 'About', href: '#about' },
            { label: 'Skills', href: '#skills' },
            { label: 'Projects', href: '#projects' },
            { label: 'Experience', href: '#experience' },
            { label: 'Education', href: '#education' },
            { label: 'Contact', href: '#contact' },
          ].map(link => (
            <a
              key={link.label}
              href={link.href}
              style={{
                color: '#3D0C02',
                textDecoration: 'none',
                padding: '8px 14px',
                borderRadius: '4px',
                fontSize: '14px',
                fontWeight: 'bold',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.color = '#3D0C02';
                e.currentTarget.style.backgroundColor = 'rgba(61, 12, 2, 0.1)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = '#3D0C02';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <strong>{link.label}</strong>
            </a>
          ))}
        </div>
      </nav>

      {/* Hero Section */}
      <section
        id="hero"
        className="hero-section"
        style={{
          backgroundColor: '#645452',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <div className="container">
          <div
            className="hero-grid"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '48px'
            }}
          >
            <div className="hero-text" style={{ flex: '1 1 0', minWidth: 0 }}>
              <h1 style={{ fontSize: '2.75rem', lineHeight: 1.15, marginBottom: '16px' }}>
                {bio?.heroTitle || 'Welcome to My Portfolio'}
              </h1>
              <p style={{ fontSize: '1.25rem', color: 'var(--navy-light)', marginBottom: '24px' }}>
                {bio?.heroSubtitle || 'Full Stack Developer'}
              </p>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <a href="#projects" className="btn btn-save" style={{ padding: '12px 24px' }}>
                  View Projects
                </a>
                <a href="#contact" className="btn btn-edit" style={{ padding: '12px 24px' }}>
                  Contact Me
                </a>
              </div>
            </div>

            <div
              className="hero-model"
              onClick={() => setOsOpen(true)}
              title="Click to open Portfolio OS"
              style={{
                flex: '1 1 0',
                minWidth: 0,
                height: '480px',
                cursor: 'pointer'
              }}
            >
              <HeroLaptop />
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 900px) {
            .hero-grid {
              flex-direction: column;
            }
            .hero-model {
              width: 100%;
              height: 340px !important;
              order: 2;
            }
            .hero-text {
              order: 1;
              text-align: center;
            }
            .hero-text > div {
              justify-content: center;
            }
          }
        `}</style>
      </section>

      {/* About Section with OS Desktop Overlay */}
      <section id="about" style={{ backgroundColor: '#9d9c9c', position: 'relative', minHeight: '100vh' }}>
        <div className="container">
          <h2 className="section-title">About Me</h2>
          <div className="card" style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: 'var(--navy-primary)' }}>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
              {bio?.aboutMe || 'A passionate developer creating amazing web experiences.'}
            </p>
          </div>
        </div>
        
      </section>

      {/* Skills Section */}
      <section id="skills" style={{ backgroundColor: '#9d9c9c' }}>
        <div className="container">
          <h2 className="section-title">Skills</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {['Frontend', 'Backend', 'Full Stack', 'Tools', 'Other'].map(category => {
              const categorySkills = skills.filter(s => s.category === category);
              if (categorySkills.length === 0) return null;
              
              return (
                <div key={category} className="card" style={{ backgroundColor: 'var(--navy-primary)' }}>
                  <h3 style={{ marginBottom: '16px', color: 'var(--navy-light)' }}>{category}</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {categorySkills.map(skill => (
                      <div key={skill._id}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span>{skill.name}</span>
                          <span className="text-muted">{skill.proficiency}%</span>
                        </div>
                        <div style={{ 
                          height: '8px', 
                          backgroundColor: 'var(--navy-primary)', 
                          borderRadius: '4px',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            height: '100%',
                            width: `${skill.proficiency}%`,
                            backgroundColor: 'var(--navy-light)',
                            transition: 'width 0.3s ease'
                          }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" style={{ backgroundColor: '#9d9c9c' }}>
        <div className="container">
          <h2 className="section-title">Projects</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {projects.map(project => (
              <div key={project._id} className="card" style={{ backgroundColor: 'var(--navy-primary)' }}>
                {project.imageUrl && (
                  <img 
                    src={project.imageUrl} 
                    alt={project.title}
                    style={{ 
                      width: '100%', 
                      height: '200px', 
                      objectFit: 'cover',
                      borderRadius: '4px',
                      marginBottom: '16px'
                    }}
                  />
                )}
                <h3 style={{ marginBottom: '8px' }}>{project.title}</h3>
                <p className="text-muted" style={{ marginBottom: '16px' }}>{project.description}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
                  {project.technologies.map(tech => (
                    <span 
                      key={tech}
                      style={{
                        padding: '4px 8px',
                        backgroundColor: 'var(--navy-primary)',
                        borderRadius: '4px',
                        fontSize: '12px'
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {project.liveUrl && (
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn btn-edit" style={{ flex: 1, textAlign: 'center' }}>
                      Live Demo
                    </a>
                  )}
                  {project.githubUrl && (
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="btn btn-edit" style={{ flex: 1, textAlign: 'center' }}>
                      GitHub
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" style={{ backgroundColor: '#9d9c9c' }}>
        <div className="container">
          <h2 className="section-title">Experience & Education</h2>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            {experience.filter(exp => exp.category === 'Experience').map(exp => (
              <div key={exp._id} className="card mb-4">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div>
                    <h3 style={{ marginBottom: '4px' }}>{exp.title}</h3>
                    <p className="text-muted">{exp.company} {exp.location && `• ${exp.location}`}</p>
                  </div>
                  <span className="text-muted" style={{ fontSize: '14px' }}>
                    {new Date(exp.startDate).toLocaleDateString()} - {exp.current ? 'Present' : new Date(exp.endDate).toLocaleDateString()}
                  </span>
                </div>
                <p style={{ marginTop: '12px' }}>{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section id="education" style={{ backgroundColor: '#9d9c9c' }}>
        <div className="container">
          <h2 className="section-title">Education</h2>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            {experience.filter(exp => exp.category === 'Education').map(exp => (
              <div key={exp._id} className="card mb-4">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div>
                    <h3 style={{ marginBottom: '4px' }}>{exp.title}</h3>
                    <p className="text-muted">{exp.company} {exp.location && `• ${exp.location}`}</p>
                  </div>
                  <span className="text-muted" style={{ fontSize: '14px' }}>
                    {new Date(exp.startDate).toLocaleDateString()} - {exp.current ? 'Present' : new Date(exp.endDate).toLocaleDateString()}
                  </span>
                </div>
                <p style={{ marginTop: '12px' }}>{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" style={{ backgroundColor: '#9d9c9c' }}>
        <div className="container">
          <h2 className="section-title">Contact Me</h2>
          <div className="card" style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: 'var(--navy-primary)' }}>
            <form onSubmit={handleContactSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label htmlFor="name">Name</label>
                <input
                  id="name"
                  type="text"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                  required
                />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                  required
                />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label htmlFor="subject">Subject</label>
                <input
                  id="subject"
                  type="text"
                  value={contactForm.subject}
                  onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                  required
                />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  rows="5"
                  value={contactForm.message}
                  onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                  required
                />
              </div>
              <button type="submit" className="btn btn-save" style={{ width: '100%' }}>
                Send Message
              </button>
              {formStatus && (
                <div className={formStatus.type === 'success' ? 'success' : 'error'}>
                  {formStatus.message}
                </div>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: 'var(--navy-dark)', padding: '40px 0', textAlign: 'center' }}>
        <div className="container">
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '24px' }}>
            {bio?.socialLinks?.github && (
              <a href={bio.socialLinks.github} target="_blank" rel="noopener noreferrer" className="btn btn-edit">
                GitHub
              </a>
            )}
            {bio?.socialLinks?.linkedin && (
              <a href={bio.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="btn btn-edit">
                LinkedIn
              </a>
            )}
            {bio?.socialLinks?.email && (
              <a href={`mailto:${bio.socialLinks.email}`} className="btn btn-edit">
                Email
              </a>
            )}
            {bio?.resumeUrl && (
              <a href={bio.resumeUrl} target="_blank" rel="noopener noreferrer" className="btn btn-edit">
                Resume
              </a>
            )}
          </div>
          <p className="text-muted">© {new Date().getFullYear()} Portfolio. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
