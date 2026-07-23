import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import NoiseTexture from './components/NoiseTexture';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          {/*
           * Global noise texture overlay — matches the MagicUI NoiseTextureDemo exactly:
           *   position: fixed inset-0 (covers full viewport)
           *   mask: radial-gradient(420px circle at center, white, transparent)
           *   SVG feTurbulence Perlin fractal noise, desaturated to greyscale
           */}
          <NoiseTexture
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              zIndex: 0,
              WebkitMaskImage:
                'radial-gradient(420px circle at center, white, transparent)',
              maskImage:
                'radial-gradient(420px circle at center, white, transparent)',
            }}
            baseFrequency={0.65}
            numOctaves={3}
            opacity={0.15}
          />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
