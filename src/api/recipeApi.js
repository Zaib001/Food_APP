import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://food-backend-qsbp.onrender.com/api',
});

API.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getAllRecipes = () => API.get('/recipes');
export const getRecipeById = (id) => API.get(`/recipes/${id}`);
export const createRecipe = (data) => API.post('/recipes', data);
export const updateRecipe = (id, data) => API.put(`/recipes/${id}`, data);
export const deleteRecipe = (id) => API.delete(`/recipes/${id}`);
export const scaleRecipeApi = (id, clientCount) => API.post(`/recipes/${id}/scale`, { clientCount });
export const setRecipeLock = (id, isLocked, note = '') => API.patch(`/recipes/${id}/lock`, { isLocked, note });