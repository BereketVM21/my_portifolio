import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    brightness: 100,
    wallpaper: 'navy',
    darkMode: true,
    fontSize: 16
  });
  const [availableWallpapers, setAvailableWallpapers] = useState([]);

  useEffect(() => {
    // Load from localStorage first
    const savedSettings = localStorage.getItem('themeSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }

    // Fetch default settings from server
    fetchServerSettings();
  }, []);

  // Apply brightness, font size, and wallpaper to the document
  useEffect(() => {
    // Scale brightness so 0% = 30% (visible) and 100% = 250% (much brighter than current)
    const adjustedBrightness = 30 + (settings.brightness * 2.2);
    document.documentElement.style.filter = `brightness(${adjustedBrightness}%)`;
    document.documentElement.style.fontSize = `${settings.fontSize}px`;
    
    // Apply wallpaper
    const wallpaperColor = getWallpaperColor(settings.wallpaper);
    if (settings.darkMode) {
       document.body.classList.remove('light-mode');
       document.body.style.backgroundColor = wallpaperColor;
    } else {
       document.body.classList.add('light-mode');
       document.body.style.backgroundColor = '#9d9c9c';
    }
  }, [settings.brightness, settings.fontSize, settings.wallpaper, settings.darkMode, availableWallpapers]);

  const fetchServerSettings = async () => {
    try {
      const response = await axios.get('/api/settings');
      if (response.data) {
        setAvailableWallpapers(response.data.availableWallpapers || []);
        
        // Only use server defaults if no local settings exist
        if (!localStorage.getItem('themeSettings')) {
          setSettings({
            brightness: response.data.defaultBrightness || 100,
            wallpaper: response.data.defaultWallpaper || 'navy',
            darkMode: response.data.defaultDarkMode !== false,
            fontSize: response.data.defaultFontSize || 16
          });
        }
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    }
  };

  const updateSettings = (newSettings) => {
    const updated = { ...settings, ...newSettings };
    // Ensure brightness is within 0-100 range
    if (updated.brightness !== undefined) {
      updated.brightness = Math.max(0, Math.min(100, updated.brightness));
    }
    setSettings(updated);
    localStorage.setItem('themeSettings', JSON.stringify(updated));
  };

  const resetSettings = () => {
    localStorage.removeItem('themeSettings');
    fetchServerSettings();
  };

  const getWallpaperColor = (wallpaper) => {
    const found = availableWallpapers.find(w => w.value === wallpaper);
    return found ? found.preview : '#001f3f';
  };

  return (
    <ThemeContext.Provider value={{
      settings,
      updateSettings,
      resetSettings,
      availableWallpapers,
      getWallpaperColor
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
