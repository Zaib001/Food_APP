import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://food-backend-qsbp.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Dashboard APIs
export const fetchStats = () => API.get('/dashboard/stats');
export const fetchMonthlySummary = () => API.get('/dashboard/monthly-summary');
export const fetchCategoryShare = () => API.get('/dashboard/category-share');
export const fetchActivityLog = () => API.get('/dashboard/activity');
