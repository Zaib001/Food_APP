// src/api/auth.js
import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // e.g. http://localhost:5000/api
  headers: {
    'Content-Type': 'application/json',
  },
});
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
console.log('API Base URL:', import.meta.env.VITE_API_URL);

// Auth APIs
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const fetchProfile = () => API.get('/auth/me');
