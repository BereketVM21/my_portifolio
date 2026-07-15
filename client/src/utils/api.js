import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

export const api = {
  // Auth
  login: (data) => axios.post(`${API_BASE}/auth/login`, data),
  getMe: () => axios.get(`${API_BASE}/auth/me`),
  changePassword: (data) => axios.put(`${API_BASE}/auth/password`, data),
  initializeAdmin: (data) => axios.post(`${API_BASE}/auth/initialize`, data),

  // Projects
  getProjects: () => axios.get(`${API_BASE}/projects`),
  getFeaturedProjects: () => axios.get(`${API_BASE}/projects/featured`),
  getProject: (id) => axios.get(`${API_BASE}/projects/${id}`),
  createProject: (data) => axios.post(`${API_BASE}/projects`, data),
  updateProject: (id, data) => axios.put(`${API_BASE}/projects/${id}`, data),
  deleteProject: (id) => axios.delete(`${API_BASE}/projects/${id}`),

  // Skills
  getSkills: () => axios.get(`${API_BASE}/skills`),
  getSkillsByCategory: (category) => axios.get(`${API_BASE}/skills/category/${category}`),
  getSkill: (id) => axios.get(`${API_BASE}/skills/${id}`),
  createSkill: (data) => axios.post(`${API_BASE}/skills`, data),
  updateSkill: (id, data) => axios.put(`${API_BASE}/skills/${id}`, data),
  deleteSkill: (id) => axios.delete(`${API_BASE}/skills/${id}`),

  // Experience
  getExperience: () => axios.get(`${API_BASE}/experience`),
  getExperienceByCategory: (category) => axios.get(`${API_BASE}/experience/category/${category}`),
  getExperienceItem: (id) => axios.get(`${API_BASE}/experience/${id}`),
  createExperience: (data) => axios.post(`${API_BASE}/experience`, data),
  updateExperience: (id, data) => axios.put(`${API_BASE}/experience/${id}`, data),
  deleteExperience: (id) => axios.delete(`${API_BASE}/experience/${id}`),

  // Messages
  createMessage: (data) => axios.post(`${API_BASE}/messages`, data),
  getMessages: () => axios.get(`${API_BASE}/messages`),
  getMessage: (id) => axios.get(`${API_BASE}/messages/${id}`),
  markMessageAsRead: (id) => axios.put(`${API_BASE}/messages/${id}/read`),
  deleteMessage: (id) => axios.delete(`${API_BASE}/messages/${id}`),

  // Bio
  getBio: () => axios.get(`${API_BASE}/bio`),
  updateBio: (data) => axios.put(`${API_BASE}/bio`, data),

  // Settings
  getSettings: () => axios.get(`${API_BASE}/settings`),
  updateSettings: (data) => axios.put(`${API_BASE}/settings`, data),

  // Search
  search: (query) => axios.get(`${API_BASE}/search?q=${encodeURIComponent(query)}`),
};
