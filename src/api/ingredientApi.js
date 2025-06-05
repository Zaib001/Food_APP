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

export const getAllIngredients = () => API.get('/ingredients');
export const createIngredient = (data) => API.post('/ingredients', data);
export const updateIngredient = (id, data) => API.put(`/ingredients/${id}`, data);
export const deleteIngredient = (id) => API.delete(`/ingredients/${id}`);
export const adjustStock = (id, type, quantity) =>
  API.patch(`/ingredients/${id}/stock`, { type, quantity });
