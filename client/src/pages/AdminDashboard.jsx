import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';

const AdminDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [brightnessPreview, setBrightnessPreview] = useState(100);
  const [currentBrightness, setCurrentBrightness] = useState(100);
  const [wallpaperPreview, setWallpaperPreview] = useState('navy');
  const [darkModePreview, setDarkModePreview] = useState(true);
  const [fontSizePreview, setFontSizePreview] = useState(16);
  const [fontSizeInput, setFontSizeInput] = useState(16);
  const [avatarFile, setAvatarFile] = useState(null);
  const [bioFormData, setBioFormData] = useState({
    name: '',
    location: '',
    heroTitle: '',
    heroSubtitle: '',
    aboutMe: '',
    resumeUrl: '',
    avatarUrl: '',
    socialLinks: {
      github: '',
      linkedin: '',
      twitter: '',
      email: ''
    }
  });
  const [data, setData] = useState({
    projects: [],
    skills: [],
    experience: [],
    messages: [],
    bio: null,
    settings: null
  });
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  useEffect(() => {
    if (data.settings) {
      setBrightnessPreview(data.settings.defaultBrightness);
      setCurrentBrightness(data.settings.defaultBrightness);
      setWallpaperPreview(data.settings.defaultWallpaper);
      setDarkModePreview(data.settings.defaultDarkMode);
      setFontSizePreview(data.settings.defaultFontSize);
      setFontSizeInput(data.settings.defaultFontSize);
    }
  }, [data.settings]);

  useEffect(() => {
    if (data.bio) {
      setBioFormData({
        name: data.bio.name || '',
        location: data.bio.location || '',
        heroTitle: data.bio.heroTitle || '',
        heroSubtitle: data.bio.heroSubtitle || '',
        aboutMe: data.bio.aboutMe || '',
        resumeUrl: data.bio.resumeUrl || '',
        avatarUrl: data.bio.avatarUrl || '',
        socialLinks: {
          github: data.bio.socialLinks?.github || '',
          linkedin: data.bio.socialLinks?.linkedin || '',
          twitter: data.bio.socialLinks?.twitter || '',
          email: data.bio.socialLinks?.email || ''
        }
      });
    }
  }, [data.bio]);

  // Apply brightness preview to document in real-time
  useEffect(() => {
    // Scale brightness so 0% = 30% (visible) and 100% = 250% (much brighter than current)
    const adjustedBrightness = 30 + (currentBrightness * 2.2);
    document.documentElement.style.filter = `brightness(${adjustedBrightness}%)`;
  }, [currentBrightness]);

  // Reset brightness when leaving settings tab
  useEffect(() => {
    if (activeTab !== 'settings' && data.settings) {
      setCurrentBrightness(data.settings.defaultBrightness);
      setWallpaperPreview(data.settings.defaultWallpaper);
      setDarkModePreview(data.settings.defaultDarkMode);
      setFontSizePreview(data.settings.defaultFontSize);
      setFontSizeInput(data.settings.defaultFontSize);
    }
  }, [activeTab, data.settings]);

  // Apply wallpaper preview to document in real-time
  useEffect(() => {
    if (data.settings && data.settings.availableWallpapers) {
      const wallpaper = data.settings.availableWallpapers.find(w => w.value === wallpaperPreview);
      const color = wallpaper ? wallpaper.preview : '#001f3f';
      document.body.style.backgroundColor = color;
    }
  }, [wallpaperPreview, data.settings]);

  // Apply dark mode preview to document in real-time
  useEffect(() => {
    if (darkModePreview) {
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
    }
  }, [darkModePreview]);

  // Apply font size preview to document in real-time
  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSizePreview}px`;
  }, [fontSizePreview]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [projectsRes, skillsRes, experienceRes, messagesRes, bioRes, settingsRes] = await Promise.all([
        api.getProjects(),
        api.getSkills(),
        api.getExperience(),
        api.getMessages(),
        api.getBio(),
        api.getSettings()
      ]);

      setData({
        projects: projectsRes.data,
        skills: skillsRes.data,
        experience: experienceRes.data,
        messages: messagesRes.data,
        bio: bioRes.data,
        settings: settingsRes.data
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      const endpoints = {
        projects: api.deleteProject,
        skills: api.deleteSkill,
        experience: api.deleteExperience,
        messages: api.deleteMessage
      };

      await endpoints[type](id);
      fetchData();
    } catch (error) {
      alert('Failed to delete item');
    }
  };

  const handleEdit = (type, item) => {
    setEditingItem({ type, item });
    setShowModal(true);
  };

  const handleSave = async (formData) => {
    try {
      const { type, item } = editingItem;
      const endpoints = {
        projects: item._id ? api.updateProject : api.createProject,
        skills: item._id ? api.updateSkill : api.createSkill,
        experience: item._id ? api.updateExperience : api.createExperience
      };

      const endpoint = endpoints[type];
      const args = item._id ? [item._id, formData] : [formData];

      // Handle file upload for projects
      if (type === 'projects' && formData.imageFile) {
        const uploadFormData = new FormData();
        Object.keys(formData).forEach(key => {
          if (key !== 'imageFile') {
            uploadFormData.append(key, formData[key]);
          }
        });
        uploadFormData.append('image', formData.imageFile);
        await endpoint(...args);
      } else {
        await endpoint(...args);
      }

      setShowModal(false);
      setEditingItem(null);
      fetchData();
    } catch (error) {
      alert('Failed to save item');
    }
  };

  const renderContent = () => {
    if (loading) return <div className="spinner"></div>;

    switch (activeTab) {
      case 'dashboard':
        return (
          <div>
            <h2 style={{ marginBottom: '24px' }}>Dashboard</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div className="card" style={{ backgroundColor: 'var(--navy-primary)' }}>
                <h3>{data.projects.length}</h3>
                <p className="text-muted">Projects</p>
              </div>
              <div className="card" style={{ backgroundColor: 'var(--navy-primary)' }}>
                <h3>{data.skills.length}</h3>
                <p className="text-muted">Skills</p>
              </div>
              <div className="card" style={{ backgroundColor: 'var(--navy-primary)' }}>
                <h3>{data.experience.length}</h3>
                <p className="text-muted">Experience</p>
              </div>
              <div className="card" style={{ backgroundColor: 'var(--navy-primary)' }}>
                <h3>{data.messages.filter(m => !m.read).length}</h3>
                <p className="text-muted">Unread Messages</p>
              </div>
            </div>
          </div>
        );

      case 'projects':
        return (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2>Projects</h2>
              <button 
                className="btn btn-primary"
                onClick={() => handleEdit('projects', {})}
              >
                Add Project
              </button>
            </div>
            <div style={{ display: 'grid', gap: '16px' }}>
              {data.projects.map(project => (
                <div key={project._id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3>{project.title}</h3>
                    <p className="text-muted">{project.description}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn btn-edit" onClick={() => handleEdit('projects', project)}>Edit</button>
                    <button className="btn btn-delete" onClick={() => handleDelete('projects', project._id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'skills':
        return (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2>Skills</h2>
              <button 
                className="btn btn-primary"
                onClick={() => handleEdit('skills', {})}
              >
                Add Skill
              </button>
            </div>
            <div style={{ display: 'grid', gap: '16px' }}>
              {data.skills.map(skill => (
                <div key={skill._id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3>{skill.name}</h3>
                    <p className="text-muted">{skill.category} - {skill.proficiency}%</p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn btn-edit" onClick={() => handleEdit('skills', skill)}>Edit</button>
                    <button className="btn btn-delete" onClick={() => handleDelete('skills', skill._id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'experience':
        return (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2>Experience & Education</h2>
              <button 
                className="btn btn-primary"
                onClick={() => handleEdit('experience', {})}
              >
                Add Experience
              </button>
            </div>
            <div style={{ display: 'grid', gap: '16px' }}>
              {data.experience.map(exp => (
                <div key={exp._id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3>{exp.title}</h3>
                    <p className="text-muted">{exp.company} - {exp.category}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn btn-edit" onClick={() => handleEdit('experience', exp)}>Edit</button>
                    <button className="btn btn-delete" onClick={() => handleDelete('experience', exp._id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'messages':
        return (
          <div>
            <h2 style={{ marginBottom: '24px' }}>Messages</h2>
            <div style={{ display: 'grid', gap: '16px' }}>
              {data.messages.map(message => (
                <div 
                  key={message._id} 
                  className={`card ${!message.read ? 'unread' : ''}`}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div>
                      <h3>{message.subject}</h3>
                      <p className="text-muted">{message.name} - {message.email}</p>
                      <p style={{ marginTop: '8px' }}>{message.message}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {!message.read && (
                        <button 
                          className="btn btn-secondary"
                          onClick={async () => {
                            await api.markMessageAsRead(message._id);
                            fetchData();
                          }}
                        >
                          Mark Read
                        </button>
                      )}
                      <button className="btn btn-delete" onClick={() => handleDelete('messages', message._id)}>Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'bio':
        return (
          <div>
            <h2 style={{ marginBottom: '24px' }}>Bio & Social Links</h2>
            {data.bio && (
              <div className="card" style={{ backgroundColor: 'var(--navy-primary)' }}>
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  try {
                    let submitData;
                    if (avatarFile) {
                      submitData = new FormData();
                      submitData.append('name', bioFormData.name);
                      submitData.append('location', bioFormData.location);
                      submitData.append('heroTitle', bioFormData.heroTitle);
                      submitData.append('heroSubtitle', bioFormData.heroSubtitle);
                      submitData.append('aboutMe', bioFormData.aboutMe);
                      submitData.append('resumeUrl', bioFormData.resumeUrl);
                      submitData.append('socialLinks', JSON.stringify(bioFormData.socialLinks));
                      submitData.append('avatar', avatarFile);
                    } else {
                      submitData = bioFormData;
                    }
                    await api.updateBio(submitData);
                    alert('Bio updated successfully');
                    setAvatarFile(null);
                    fetchData();
                  } catch (error) {
                    alert('Failed to update bio');
                  }
                }}>
                  <div style={{ marginBottom: '16px' }}>
                    <label>Profile Photo</label>
                    {bioFormData.avatarUrl && (
                      <div style={{ marginBottom: '8px' }}>
                        <img 
                          src={bioFormData.avatarUrl} 
                          alt="Avatar" 
                          style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--navy-light)' }} 
                        />
                      </div>
                    )}
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) setAvatarFile(file);
                      }}
                      style={{ padding: '8px 0', border: 'none', backgroundColor: 'transparent' }}
                    />
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <label>Name</label>
                    <input 
                      name="name" 
                      value={bioFormData.name}
                      onChange={(e) => setBioFormData({...bioFormData, name: e.target.value})}
                    />
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <label>Location</label>
                    <input 
                      name="location" 
                      value={bioFormData.location}
                      onChange={(e) => setBioFormData({...bioFormData, location: e.target.value})}
                    />
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <label>Hero Title</label>
                    <input 
                      name="heroTitle" 
                      value={bioFormData.heroTitle}
                      onChange={(e) => setBioFormData({...bioFormData, heroTitle: e.target.value})}
                    />
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <label>Hero Subtitle</label>
                    <input 
                      name="heroSubtitle" 
                      value={bioFormData.heroSubtitle}
                      onChange={(e) => setBioFormData({...bioFormData, heroSubtitle: e.target.value})}
                    />
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <label>About Me</label>
                    <textarea 
                      name="aboutMe" 
                      rows="4" 
                      value={bioFormData.aboutMe}
                      onChange={(e) => setBioFormData({...bioFormData, aboutMe: e.target.value})}
                    />
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <label>Resume URL</label>
                    <input 
                      name="resumeUrl" 
                      value={bioFormData.resumeUrl}
                      onChange={(e) => setBioFormData({...bioFormData, resumeUrl: e.target.value})}
                    />
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <label>GitHub URL</label>
                    <input 
                      name="socialLinks.github" 
                      value={bioFormData.socialLinks.github}
                      onChange={(e) => setBioFormData({...bioFormData, socialLinks: {...bioFormData.socialLinks, github: e.target.value}})}
                    />
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <label>LinkedIn URL</label>
                    <input 
                      name="socialLinks.linkedin" 
                      value={bioFormData.socialLinks.linkedin}
                      onChange={(e) => setBioFormData({...bioFormData, socialLinks: {...bioFormData.socialLinks, linkedin: e.target.value}})}
                    />
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <label>Twitter URL</label>
                    <input 
                      name="socialLinks.twitter" 
                      value={bioFormData.socialLinks.twitter}
                      onChange={(e) => setBioFormData({...bioFormData, socialLinks: {...bioFormData.socialLinks, twitter: e.target.value}})}
                    />
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <label>Email</label>
                    <input 
                      name="socialLinks.email" 
                      value={bioFormData.socialLinks.email}
                      onChange={(e) => setBioFormData({...bioFormData, socialLinks: {...bioFormData.socialLinks, email: e.target.value}})}
                    />
                  </div>
                  <button type="submit" className="btn btn-save">Save Bio</button>
                </form>
              </div>
            )}
          </div>
        );

      case 'settings':
        return (
          <div>
            <h2 style={{ marginBottom: '24px' }}>Settings</h2>
            {data.settings && (
              <div className="card" style={{ backgroundColor: 'var(--navy-primary)' }}>
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  await api.updateSettings({
                    defaultBrightness: brightnessPreview,
                    defaultWallpaper: wallpaperPreview,
                    defaultDarkMode: darkModePreview,
                    defaultFontSize: fontSizePreview
                  });
                  setFontSizeInput(fontSizePreview);
                  alert('Settings updated successfully');
                  fetchData();
                }}>
                  <div style={{ marginBottom: '16px' }}>
                    <label>Brightness:</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <input 
                        type="range" 
                        name="defaultBrightness"
                        min="0" 
                        max="100"
                        value={brightnessPreview}
                        onChange={(e) => {
                          const newValue = parseInt(e.target.value);
                          setBrightnessPreview(newValue);
                          setCurrentBrightness(newValue); // Apply immediately to screen
                          api.updateSettings({
                            defaultBrightness: newValue,
                            defaultWallpaper: wallpaperPreview,
                            defaultDarkMode: data.settings.defaultDarkMode,
                            defaultFontSize: data.settings.defaultFontSize
                          });
                        }}
                        style={{ flex: 1, cursor: 'pointer' }}
                      />
                      <span style={{ minWidth: '40px', textAlign: 'right' }}>{brightnessPreview}%</span>
                    </div>
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <label>Background Color</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                      {data.settings.availableWallpapers.map(w => (
                        <button
                          key={w.value}
                          type="button"
                          onClick={() => {
                            setWallpaperPreview(w.value);
                            api.updateSettings({
                              defaultBrightness: brightnessPreview,
                              defaultWallpaper: w.value,
                              defaultDarkMode: darkModePreview,
                              defaultFontSize: fontSizePreview
                            });
                          }}
                          style={{
                            padding: '12px',
                            backgroundColor: w.preview,
                            border: wallpaperPreview === w.value ? '3px solid var(--navy-light)' : '0.2px solid var(--border-color)',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            color: 'var(--text-primary)',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          {w.name}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <label>Default Dark Mode</label>
                    <select 
                      value={darkModePreview.toString()}
                      onChange={(e) => {
                        const newValue = e.target.value === 'true';
                        setDarkModePreview(newValue);
                        api.updateSettings({
                          defaultBrightness: brightnessPreview,
                          defaultWallpaper: wallpaperPreview,
                          defaultDarkMode: newValue,
                          defaultFontSize: fontSizePreview
                        });
                      }}
                    >
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <label>Font Size</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input 
                        type="number" 
                        name="defaultFontSize" 
                        min="12" 
                        max="24"
                        value={fontSizeInput}
                        onChange={(e) => {
                          const newValue = parseInt(e.target.value);
                          setFontSizeInput(newValue);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const newValue = parseInt(e.target.value);
                            setFontSizePreview(newValue);
                            setFontSizeInput(newValue);
                            api.updateSettings({
                              defaultBrightness: brightnessPreview,
                              defaultWallpaper: wallpaperPreview,
                              defaultDarkMode: darkModePreview,
                              defaultFontSize: newValue
                            });
                          }
                        }}
                        style={{ flex: 1 }}
                      />
                      <button 
                        type="button"
                        onClick={() => {
                          const newValue = Math.max(12, fontSizePreview - 1);
                          setFontSizePreview(newValue);
                          setFontSizeInput(newValue);
                          api.updateSettings({
                            defaultBrightness: brightnessPreview,
                            defaultWallpaper: wallpaperPreview,
                            defaultDarkMode: darkModePreview,
                            defaultFontSize: newValue
                          });
                        }}
                        className="btn btn-secondary"
                        style={{ minWidth: '40px', padding: '12px' }}
                      >
                        -
                      </button>
                      <button 
                        type="button"
                        onClick={() => {
                          const newValue = Math.min(24, fontSizePreview + 1);
                          setFontSizePreview(newValue);
                          setFontSizeInput(newValue);
                          api.updateSettings({
                            defaultBrightness: brightnessPreview,
                            defaultWallpaper: wallpaperPreview,
                            defaultDarkMode: darkModePreview,
                            defaultFontSize: newValue
                          });
                        }}
                        className="btn btn-secondary"
                        style={{ minWidth: '40px', padding: '12px' }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <button type="submit" className="btn btn-save btn-sm">Save Settings</button>
                    <button 
                      type="button" 
                      className="btn btn-restore btn-sm"
                      onClick={async () => {
                        if (window.confirm('Are you sure you want to restore settings to default values?')) {
                          await api.updateSettings({
                            defaultBrightness: 100,
                            defaultWallpaper: 'navy',
                            defaultDarkMode: true,
                            defaultFontSize: 16
                          });
                          setBrightnessPreview(100);
                          setCurrentBrightness(100);
                          setWallpaperPreview('navy');
                          setDarkModePreview(true);
                          setFontSizePreview(16);
                          setFontSizeInput(16);
                          alert('Settings restored to default successfully');
                          fetchData();
                        }
                      }}
                    >
                      ↻ Restore to Default
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        );

      default:
        return <div>Tab not found</div>;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{
        width: '250px',
        backgroundColor: 'var(--navy-dark)',
        borderRight: '1px solid var(--border-color)',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <h2 style={{ marginBottom: '32px' }}>Admin Panel</h2>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {['dashboard', 'projects', 'skills', 'experience', 'messages', 'bio', 'settings'].map(tab => (
            <button
              key={tab}
              className={`btn ${activeTab === tab ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab(tab)}
              style={{ textAlign: 'left', textTransform: 'capitalize' }}
            >
              {tab}
            </button>
          ))}
        </nav>

        <button 
          className="btn btn-logout" 
          onClick={handleLogout}
          style={{ marginTop: 'auto' }}
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
        {renderContent()}
      </main>

      {/* Modal */}
      {showModal && editingItem && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="card" style={{ width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ marginBottom: '16px' }}>
              {editingItem.item._id ? `Edit ${editingItem.type}` : `Add ${editingItem.type}`}
            </h3>
            
            <EditForm 
              type={editingItem.type} 
              item={editingItem.item} 
              onSave={handleSave}
              onCancel={() => {
                setShowModal(false);
                setEditingItem(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const EditForm = ({ type, item, onSave, onCancel }) => {
  const [formData, setFormData] = useState(item);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const renderForm = () => {
    switch (type) {
      case 'projects':
        return (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label>Title</label>
              <input 
                value={formData.title || ''} 
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
              />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label>Description</label>
              <textarea 
                rows="3"
                value={formData.description || ''} 
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                required
              />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label>Technologies (comma-separated)</label>
              <input 
                value={formData.technologies?.join(', ') || ''} 
                onChange={(e) => setFormData({...formData, technologies: e.target.value.split(',').map(t => t.trim())})}
              />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label>Live URL</label>
              <input 
                value={formData.liveUrl || ''} 
                onChange={(e) => setFormData({...formData, liveUrl: e.target.value})}
              />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label>GitHub URL</label>
              <input 
                value={formData.githubUrl || ''} 
                onChange={(e) => setFormData({...formData, githubUrl: e.target.value})}
              />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label>Featured</label>
              <input 
                type="checkbox"
                checked={formData.featured || false}
                onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                style={{ width: 'auto' }}
              />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label>Order</label>
              <input 
                type="number"
                value={formData.order || 0}
                onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)})}
              />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label>Image</label>
              <input 
                type="file"
                onChange={(e) => setFormData({...formData, imageFile: e.target.files[0]})}
                accept="image/*"
              />
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="submit" className="btn btn-save">Save</button>
              <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
            </div>
          </form>
        );

      case 'skills':
        return (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label>Name</label>
              <input 
                value={formData.name || ''} 
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label>Category</label>
              <select 
                value={formData.category || 'Other'}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="Full Stack">Full Stack</option>
                <option value="Tools">Tools</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label>Proficiency (0-100)</label>
              <input 
                type="number"
                min="0"
                max="100"
                value={formData.proficiency || 50}
                onChange={(e) => setFormData({...formData, proficiency: parseInt(e.target.value)})}
              />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label>Order</label>
              <input 
                type="number"
                value={formData.order || 0}
                onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)})}
              />
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="submit" className="btn btn-save">Save</button>
              <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
            </div>
          </form>
        );

      case 'experience':
        return (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label>Title</label>
              <input 
                value={formData.title || ''} 
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
              />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label>Company</label>
              <input 
                value={formData.company || ''} 
                onChange={(e) => setFormData({...formData, company: e.target.value})}
                required
              />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label>Location</label>
              <input 
                value={formData.location || ''} 
                onChange={(e) => setFormData({...formData, location: e.target.value})}
              />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label>Type</label>
              <select 
                value={formData.type || 'Full-time'}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Freelance">Freelance</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label>Start Date</label>
              <input 
                type="date"
                value={formData.startDate ? formData.startDate.split('T')[0] : ''}
                onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                required
              />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label>Current Position</label>
              <input 
                type="checkbox"
                checked={formData.current || false}
                onChange={(e) => setFormData({...formData, current: e.target.checked})}
                style={{ width: 'auto' }}
              />
            </div>
            {!formData.current && (
              <div style={{ marginBottom: '16px' }}>
                <label>End Date</label>
                <input 
                  type="date"
                  value={formData.endDate ? formData.endDate.split('T')[0] : ''}
                  onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                />
              </div>
            )}
            <div style={{ marginBottom: '16px' }}>
              <label>Description</label>
              <textarea 
                rows="3"
                value={formData.description || ''} 
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                required
              />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label>Category</label>
              <select 
                value={formData.category || 'Experience'}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                <option value="Experience">Experience</option>
                <option value="Education">Education</option>
              </select>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label>Order</label>
              <input 
                type="number"
                value={formData.order || 0}
                onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)})}
              />
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="submit" className="btn btn-save">Save</button>
              <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
            </div>
          </form>
        );

      default:
        return <div>Form not found</div>;
    }
  };

  return renderForm();
};

export default AdminDashboard;
