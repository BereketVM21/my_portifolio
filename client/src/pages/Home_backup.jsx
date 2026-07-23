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
            { label: 'Work', href: '#projects' },
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
          backgroundColor: '#91A3B0',
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                paddingTop: '120px',
                paddingBottom: '60px'
        }}
      >
        <div className="container">
          <div
            className="hero-grid"
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '48px'
            }}
          >
            <div className="hero-text" style={{ flex: '1 1 0', minWidth: 0, position: 'relative', display: 'flex', flexDirection: 'column', alignSelf: 'stretch' }}>
              <div style={{
                color: '#3D2B1F',
                fontSize: '5rem',
                fontWeight: '900',
                letterSpacing: '0.04em',
                opacity: 0.92,
                whiteSpace: 'nowrap',
              }}>
                Bereket Alemu
              </div>
              <div style={{
                color: '#800020',
                fontSize: '2rem',
                fontWeight: '700',
                letterSpacing: '0.04em',
                opacity: 0.92,
                marginTop: '8px',
              }}>
                Full Stack Developer
              </div>
              <div style={{
                color: '#2C1810',
                fontSize: '1.15rem',
                fontWeight: '400',
                fontFamily: '"Georgia", "Palatino Linotype", "Book Antiqua", serif',
                fontStyle: 'italic',
                lineHeight: '1.7',
                marginTop: '20px',
                maxWidth: '520px',
                opacity: 0.88,
                letterSpacing: '0.02em',
              }}>
                I build modern, responsive and scalable web applications with MERN stack and bring ideas to life on the web.
              </div>
              <div style={{ flex: '1 1 0' }}></div>
              <div style={{
                display: 'flex',
                gap: '16px',
                marginTop: '40px',
                alignSelf: 'flex-start'
              }}>
                <a
                  href="#contact"
                  style={{
                    display: 'inline-block',
                    padding: '14px 36px',
                    backgroundColor: '#C04000',
                    color: '#FFFFFF',
                    fontSize: '1.05rem',
                    fontWeight: '700',
                    fontFamily: '"Segoe UI", Arial, sans-serif',
                    textDecoration: 'none',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    boxShadow: '0 4px 14px rgba(192, 64, 0, 0.35)',
                    letterSpacing: '0.04em',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#E05020'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(192, 64, 0, 0.5)'; }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#C04000'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(192, 64, 0, 0.35)'; }}
                >
                  Contact Me
                </a>
                <a
                  href="#projects"
                  style={{
                    display: 'inline-block',
                    padding: '12px 34px',
                    backgroundColor: 'transparent',
                    color: '#C04000',
                    fontSize: '1.05rem',
                    fontWeight: '700',
                    fontFamily: '"Segoe UI", Arial, sans-serif',
                    textDecoration: 'none',
                    borderRadius: '8px',
                    border: '2px solid #C04000',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    letterSpacing: '0.04em',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(192, 64, 0, 0.08)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  View My Work
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
                cursor: 'pointer',
                background: '#91A3B0',
                borderRadius: '12px',
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
              text-align: left;
            }
          }
        `}</style>
      </section>

      {/* About Section with OS Desktop Overlay */}
      <section id="about" style={{ backgroundColor: '#BEBFC5', position: 'relative', minHeight: '100vh' }}>
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
      <section id="skills" style={{ backgroundColor: '#BEBFC5' }}>
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
      <section id="projects" style={{ backgroundColor: '#BEBFC5' }}>
        <div className="container">
          <h2 className="section-title">Work</h2>
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

      {/* Contact Section */}
      <section id="contact" style={{ backgroundColor: '#BEBFC5' }}>
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

    </div>
  );
};

export default Home;
