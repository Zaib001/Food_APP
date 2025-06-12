import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const headers = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

export const getInventory = async () => {
  return await axios.get(`${API_URL}/inventory`, { headers: headers() });
};

export const createInventory = async (data) => {
  return await axios.post(`${API_URL}/inventory`, data, { headers: headers() });
};

export const updateInventory = async (id, data) => {
  return await axios.put(`${API_URL}/inventory/${id}`, data, { headers: headers() });
};

export const deleteInventory = async (id) => {
  return await axios.delete(`${API_URL}/inventory/${id}`, { headers: headers() });
};

export const getGroupedInventory = async () => {
  return await axios.get(`${API_URL}/inventory/grouped`, { headers: headers() });
};

export const exportInventoryCSV = async () => {
  return await axios.get(`${API_URL}/inventory/export/csv`, {
    headers: headers(),
    responseType: 'blob',
  });
};

export const getLowStockAlerts = async (threshold = 5) => {
  return await axios.get(`${API_URL}/inventory/alerts/low-stock?threshold=${threshold}`, { headers: headers() });
};
