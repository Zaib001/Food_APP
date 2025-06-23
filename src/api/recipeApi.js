import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' }
});

API.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getAllRecipes = () => API.get('/recipes');
export const createRecipe = (data) => API.post('/recipes', data);
export const updateRecipe = (id, data) => API.put(`/recipes/${id}`, data);
export const deleteRecipe = (id) => API.delete(`/recipes/${id}`);
