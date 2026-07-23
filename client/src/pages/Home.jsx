import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import OSDashboard from '../components/OSDashboard';
import HeroLaptop from '../components/HeroLaptop';
import { Boxes } from '../components/BackgroundBoxes';
import CRTBackground from '../components/CRTBackground';

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
  const [visibleTechCount, setVisibleTechCount] = useState(0);
  const [cycleStartTime, setCycleStartTime] = useState(Date.now());

  const technologies = [
    { name: 'HTML5', icon: 'html5/html5-original' },
    { name: 'CSS3', icon: 'css3/css3-original' },
    { name: 'JavaScript', icon: 'javascript/javascript-original' },
    { name: 'React', icon: 'react/react-original' },
    { name: 'Node.js', icon: 'nodejs/nodejs-original' },
    { name: 'Express', icon: 'express/express-original' },
    { name: 'MongoDB', icon: 'mongodb/mongodb-original' },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // Start the animation immediately
    const startTime = Date.now();
    
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const techIndex = Math.floor(elapsed / 1000);
      
      if (techIndex < technologies.length) {
        setVisibleTechCount(techIndex + 1);
      } else if (elapsed >= 12000) {
        // Reset after 12 seconds from first display
        setCycleStartTime(Date.now());
        setVisibleTechCount(0);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [technologies.length]);

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
        backgroundColor: 'rgba(15, 23, 42, 0.4)',
        backdropFilter: 'blur(8px)',
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
                color: '#e2e8f0',
                textDecoration: 'none',
                padding: '8px 14px',
                borderRadius: '4px',
                fontSize: '14px',
                fontWeight: 'bold',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.color = '#ffffff';
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = '#e2e8f0';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <strong>{link.label}</strong>
            </a>
          ))}
        </div>
      </nav>

      {/* Hero Section — CRT shader background */}
      <section
        id="hero"
        className="hero-section"
        style={{
          backgroundColor: '#0a0a0f',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          paddingTop: '120px',
          paddingBottom: '60px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* CRT Canvas — covers entire hero, sits behind everything */}
        <CRTBackground />
        {/* Subtle overlay for text readability */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 1,
            background: 'linear-gradient(135deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.55) 100%)',
            pointerEvents: 'none',
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
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
                color: '#f1f5f9',
                fontSize: '5rem',
                fontWeight: '900',
                letterSpacing: '0.04em',
                opacity: 0.95,
                whiteSpace: 'nowrap',
                textShadow: '0 2px 20px rgba(0,0,0,0.5)',
              }}>
                Bereket Alemu
              </div>
              <div style={{
                color: '#f97316',
                fontSize: '2rem',
                fontWeight: '700',
                letterSpacing: '0.04em',
                opacity: 0.95,
                marginTop: '8px',
                textShadow: '0 2px 12px rgba(249, 115, 22, 0.3)',
              }}>
                Full Stack Developer
              </div>
              <div style={{
                color: '#cbd5e1',
                fontSize: '1.15rem',
                fontWeight: '400',
                fontFamily: '"Georgia", "Palatino Linotype", "Book Antiqua", serif',
                fontStyle: 'italic',
                lineHeight: '1.7',
                marginTop: '20px',
                maxWidth: '520px',
                opacity: 0.9,
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
                    color: '#f97316',
                    fontSize: '1.05rem',
                    fontWeight: '700',
                    fontFamily: '"Segoe UI", Arial, sans-serif',
                    textDecoration: 'none',
                    borderRadius: '8px',
                    border: '2px solid #f97316',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    letterSpacing: '0.04em',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(249, 115, 22, 0.12)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
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
                background: '#0f172a',
                borderRadius: '12px',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Animated background grid — Aceternity BackgroundBoxes */}
              <Boxes />
              {/* Radial mask so edges fade into the container background */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  zIndex: 1,
                  background: 'radial-gradient(ellipse at center, transparent 40%, #0f172a 80%)',
                  pointerEvents: 'none',
                  borderRadius: '12px',
                }}
              />
              {/* Laptop on top of the grid */}
              <div style={{ position: 'relative', zIndex: 2, width: '100%', height: '100%' }}>
                <HeroLaptop />
              </div>
            </div>
          </div>
        </div>

        {/* Technologies ticker at bottom */}
        <div style={{
          position: 'absolute',
          bottom: '0',
          left: '0',
          right: '0',
          zIndex: 3,
          backgroundColor: 'rgba(0, 0, 0, 0.35)',
          backdropFilter: 'blur(4px)',
          padding: '16px 40px',
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <div style={{
            color: '#94a3b8',
            fontSize: '1rem',
            fontWeight: '700',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            opacity: 0.85,
            whiteSpace: 'nowrap'
          }}>
            Technologies I Work With
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '18px'
          }}>
            {technologies.slice(0, visibleTechCount).map((tech, index) => (
              <div key={tech.name} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                animation: `fadeIn 0.5s ease-in ${index * 0.1}s both`
              }}>
                <img
                  src={`https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${tech.icon}.svg`}
                  alt={tech.name}
                  title={tech.name}
                  style={{
                    width: '38px',
                    height: '38px',
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))',
                    background: tech.name === 'Express' ? '#ffffff' : 'transparent',
                    borderRadius: tech.name === 'Express' ? '6px' : '0',
                    padding: tech.name === 'Express' ? '4px' : '0',
                  }}
                />
                <span style={{
                  color: '#e2e8f0',
                  fontSize: '1rem',
                  fontWeight: '600',
                }}>
                  {tech.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateX(-10px); }
            to { opacity: 1; transform: translateX(0); }
          }
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

      {/* About Section with BackgroundBoxes */}
      <section id="about" style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden', backgroundColor: '#0f172a' }}>
        {/* Animated Boxes background */}
        <Boxes />
        {/* Radial mask overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            backgroundColor: '#0f172a',
            zIndex: 1,
            WebkitMaskImage: 'radial-gradient(transparent, white)',
            maskImage: 'radial-gradient(transparent, white)',
            pointerEvents: 'none',
          }}
        />
        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <h2 className="section-title" style={{ color: '#e2e8f0' }}>About Me</h2>
          <div className="card" style={{
            maxWidth: '800px',
            margin: '0 auto',
            backgroundColor: 'rgba(15, 23, 42, 0.7)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(148, 163, 184, 0.15)',
          }}>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#cbd5e1' }}>
              {bio?.aboutMe || 'A passionate developer creating amazing web experiences.'}
            </p>
          </div>
        </div>
        
      </section>

      {/* Skills Section with BackgroundBoxes */}
      <section id="skills" style={{ position: 'relative', overflow: 'hidden', backgroundColor: '#0f172a' }}>
        {/* Animated Boxes background */}
        <Boxes />
        {/* Radial mask overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            backgroundColor: '#0f172a',
            zIndex: 1,
            WebkitMaskImage: 'radial-gradient(transparent, white)',
            maskImage: 'radial-gradient(transparent, white)',
            pointerEvents: 'none',
          }}
        />
        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <h2 className="section-title" style={{ color: '#e2e8f0' }}>Skills</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {['Frontend', 'Backend', 'Full Stack', 'Tools', 'Other'].map(category => {
              const categorySkills = skills.filter(s => s.category === category);
              if (categorySkills.length === 0) return null;
              
              return (
                <div key={category} className="card" style={{
                  backgroundColor: 'rgba(15, 23, 42, 0.7)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(148, 163, 184, 0.15)',
                }}>
                  <h3 style={{ marginBottom: '16px', color: '#93c5fd' }}>{category}</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {categorySkills.map(skill => (
                      <div key={skill._id}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span style={{ color: '#e2e8f0' }}>{skill.name}</span>
                          <span style={{ color: '#94a3b8' }}>{skill.proficiency}%</span>
                        </div>
                        <div style={{ 
                          height: '8px', 
                          backgroundColor: 'rgba(30, 41, 59, 0.8)', 
                          borderRadius: '4px',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            height: '100%',
                            width: `${skill.proficiency}%`,
                            background: 'linear-gradient(90deg, #93c5fd, #a5b4fc)',
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

      {/* Projects Section with BackgroundBoxes */}
      <section id="projects" style={{ position: 'relative', overflow: 'hidden', backgroundColor: '#0f172a' }}>
        {/* Animated Boxes background */}
        <Boxes />
        {/* Radial mask overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            backgroundColor: '#0f172a',
            zIndex: 1,
            WebkitMaskImage: 'radial-gradient(transparent, white)',
            maskImage: 'radial-gradient(transparent, white)',
            pointerEvents: 'none',
          }}
        />
        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <h2 className="section-title" style={{ color: '#e2e8f0' }}>Work</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {projects.map(project => (
              <div key={project._id} className="card" style={{
                backgroundColor: 'rgba(15, 23, 42, 0.7)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(148, 163, 184, 0.15)',
              }}>
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
                <h3 style={{ marginBottom: '8px', color: '#e2e8f0' }}>{project.title}</h3>
                <p style={{ marginBottom: '16px', color: '#94a3b8' }}>{project.description}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
                  {project.technologies.map(tech => (
                    <span 
                      key={tech}
                      style={{
                        padding: '4px 8px',
                        backgroundColor: 'rgba(147, 197, 253, 0.1)',
                        color: '#93c5fd',
                        borderRadius: '4px',
                        fontSize: '12px',
                        border: '1px solid rgba(147, 197, 253, 0.2)',
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

      {/* Contact Section with BackgroundBoxes */}
      <section id="contact" style={{ position: 'relative', overflow: 'hidden', backgroundColor: '#0f172a' }}>
        {/* Animated Boxes background */}
        <Boxes />
        {/* Radial mask overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            backgroundColor: '#0f172a',
            zIndex: 1,
            WebkitMaskImage: 'radial-gradient(transparent, white)',
            maskImage: 'radial-gradient(transparent, white)',
            pointerEvents: 'none',
          }}
        />
        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <h2 className="section-title" style={{ color: '#e2e8f0' }}>Contact Me</h2>
          <div className="card" style={{
            maxWidth: '600px',
            margin: '0 auto',
            backgroundColor: 'rgba(15, 23, 42, 0.7)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(148, 163, 184, 0.15)',
          }}>
            <form onSubmit={handleContactSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label htmlFor="name" style={{ color: '#94a3b8' }}>Name</label>
                <input
                  id="name"
                  type="text"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                  required
                  style={{
                    backgroundColor: 'rgba(30, 41, 59, 0.8)',
                    color: '#e2e8f0',
                    border: '1px solid rgba(148, 163, 184, 0.2)',
                  }}
                />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label htmlFor="email" style={{ color: '#94a3b8' }}>Email</label>
                <input
                  id="email"
                  type="email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                  required
                  style={{
                    backgroundColor: 'rgba(30, 41, 59, 0.8)',
                    color: '#e2e8f0',
                    border: '1px solid rgba(148, 163, 184, 0.2)',
                  }}
                />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label htmlFor="subject" style={{ color: '#94a3b8' }}>Subject</label>
                <input
                  id="subject"
                  type="text"
                  value={contactForm.subject}
                  onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                  required
                  style={{
                    backgroundColor: 'rgba(30, 41, 59, 0.8)',
                    color: '#e2e8f0',
                    border: '1px solid rgba(148, 163, 184, 0.2)',
                  }}
                />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label htmlFor="message" style={{ color: '#94a3b8' }}>Message</label>
                <textarea
                  id="message"
                  rows="5"
                  value={contactForm.message}
                  onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                  required
                  style={{
                    backgroundColor: 'rgba(30, 41, 59, 0.8)',
                    color: '#e2e8f0',
                    border: '1px solid rgba(148, 163, 184, 0.2)',
                  }}
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
