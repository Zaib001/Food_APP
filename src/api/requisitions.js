import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'https://food-backend-qsbp.onrender.com/api';
const headers = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

export const getAllRequisitions = async (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  return await axios.get(`${API_URL}/requisitions?${params}`, { headers: headers() });
};

export const createRequisition = async (data) => {
  return await axios.post(`${API_URL}/requisitions`, data, { headers: headers() });
};

export const updateRequisition = async (id, data) => {
  return await axios.put(`${API_URL}/requisitions/${id}`, data, { headers: headers() });
};

export const deleteRequisition = async (id) => {
  return await axios.delete(`${API_URL}/requisitions/${id}`, { headers: headers() });
};

export const importGeneratedRequisitions = async (requisitions) => {
  return await axios.post(`${API_URL}/requisitions/import`, requisitions, { headers: headers() });
};
