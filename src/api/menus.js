import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const headers = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

export const getAllMenus = async () => {
  return await axios.get(`${API_URL}/menus`, { headers: headers() });
};

export const createMenu = async (menuData) => {
  return await axios.post(`${API_URL}/menus`, menuData, { headers: headers() });
};

export const deleteMenu = async (id) => {
  return await axios.delete(`${API_URL}/menus/${id}`, { headers: headers() });
};

export const generateRequisitions = async (peopleCount = 100) => {
  return await axios.get(`${API_URL}/menus/requisitions`, {
    params: { peopleCount },
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
};
