import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
const headers = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

// ---- Read (with filters & optional pagination via {status, supplier, plan, page, limit}) ----
export const getAllRequisitions = async (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  return await axios.get(`${API_URL}/requisitions?${params}`, { headers: headers() });
};

// Optional single read (useful for detail modals)
export const getRequisitionById = async (id) => {
  return await axios.get(`${API_URL}/requisitions/${id}`, { headers: headers() });
};

// ---- CRUD (admin-gated on server) ----
export const createRequisition = async (data) => {
  return await axios.post(`${API_URL}/requisitions`, data, { headers: headers() });
};

export const updateRequisition = async (id, data) => {
  return await axios.put(`${API_URL}/requisitions/${id}`, data, { headers: headers() });
};

export const deleteRequisition = async (id) => {
  return await axios.delete(`${API_URL}/requisitions/${id}`, { headers: headers() });
};

// Bulk import (from generated/transient data if needed)
export const importGeneratedRequisitions = async (requisitions) => {
  return await axios.post(`${API_URL}/requisitions/import`, requisitions, { headers: headers() });
};

// ---- Approvals ----

// Approve a single requisition header (or a single line, if using line schema)
export const approveRequisition = async (id) => {
  return await axios.put(`${API_URL}/requisitions/${id}/approve`, {}, { headers: headers() });
};

// Bulk approve by filter (any subset of { date, base, supplier, plan, mealType })
export const bulkApproveRequisitions = async (filter = {}) => {
  return await axios.put(`${API_URL}/requisitions/bulk-approve`, filter, { headers: headers() });
};

// ---- Stats (for dashboards/filters) ----
export const getRequisitionStats = async () => {
  return await axios.get(`${API_URL}/requisitions/stats`, { headers: headers() });
};
