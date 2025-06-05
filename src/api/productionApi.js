import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const headers = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

export const getProductions = async (filters = {}) => {
  const query = new URLSearchParams(filters).toString();
  return axios.get(`${API_URL}/production?${query}`, { headers: headers() });
};

export const createProduction = async (data) => {
  return axios.post(`${API_URL}/production`, data, { headers: headers() });
};

export const updateProduction = async (id, data) => {
  return axios.put(`${API_URL}/production/${id}`, data, { headers: headers() });
};

export const deleteProduction = async (id) => {
  return axios.delete(`${API_URL}/production/${id}`, { headers: headers() });
};
