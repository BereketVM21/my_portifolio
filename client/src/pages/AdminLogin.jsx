import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(formData.username, formData.password);
      navigate('/admin/dashboard');
    } catch (err) {
      setError('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleInitialize = async () => {
    if (!formData.username || !formData.password) {
      setError('Please enter username and password');
      return;
    }

    try {
      await api.initializeAdmin({ username: formData.username, password: formData.password });
      setError('');
      alert('Admin initialized successfully. Please login.');
    } catch (err) {
      setError('Failed to initialize admin');
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: 'var(--navy-primary)'
    }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px', backgroundColor: 'var(--navy-primary)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '24px' }}>Admin Login</h2>
        
        {error && <div className="error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              required
            />
          </div>
          
          <div style={{ marginBottom: '24px' }}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="btn btn-save" 
            style={{ width: '100%', marginBottom: '12px' }}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <button 
          onClick={handleInitialize}
          className="btn btn-secondary"
          style={{ width: '100%', fontSize: '12px' }}
        >
          Initialize Admin (First Time Setup)
        </button>
      </div>
    </div>
  );
};

export default AdminLogin;
