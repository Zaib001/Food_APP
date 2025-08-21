import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'https://food-backend-qsbp.onrender.com/api';

const headers = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

// ----- Menus -----
export const getAllMenus = async () => {
  return await axios.get(`${API_URL}/menus`, { headers: headers() });
};

export const createMenu = async (menuData) => {
  return await axios.post(`${API_URL}/menus`, menuData, { headers: headers() });
};

export const deleteMenu = async (id) => {
  return await axios.delete(`${API_URL}/menus/${id}`, { headers: headers() });
};

// ----- Requisitions (from menus) -----

// Legacy (transient): returns aggregated JSON only
export const generateRequisitions = async (peopleCount = 100) => {
  return await axios.get(`${API_URL}/menus/requisitions`, {
    params: { peopleCount },
    headers: headers(),
  });
};

// New (persistent): upserts header-level requisitions per (date, base, mealType)
export const generateAndPersistRequisitions = async (peopleCount = 100) => {
  return await axios.post(
    `${API_URL}/menus/requisitions`,
    {},
    { params: { peopleCount }, headers: headers() }
  );
};
