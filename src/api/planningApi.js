// api/planningApi.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const headers = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

export const getAllPlans = async () => {
  return await axios.get(`${API_URL}/planning`, { headers: headers() });
};

export const createPlan = async (plan) => {
  return await axios.post(`${API_URL}/planning`, plan, { headers: headers() });
};

export const updatePlan = async (id, plan) => {
  return await axios.put(`${API_URL}/planning/${id}`, plan, { headers: headers() });
};

export const deletePlan = async (id) => {
  return await axios.delete(`${API_URL}/planning/${id}`, { headers: headers() });
};
