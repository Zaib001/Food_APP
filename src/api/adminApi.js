// src/api/adminApi.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
const headers = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

/* ========== USERS (paged + search) ========== */
// GET /api/admin/users?search=&page=1&limit=20
export const adminListUsers = async ({ search = '', page = 1, limit = 20 } = {}) => {
  const params = new URLSearchParams({ search, page: String(page), limit: String(limit) }).toString();
  return axios.get(`${API_URL}/admin/users?${params}`, { headers: headers() });
};

// POST /api/admin/users
export const adminCreateUser = async (payload) => {
  // { name, email, password, role? }
  return axios.post(`${API_URL}/admin/users`, payload, { headers: headers() });
};

// PUT /api/admin/users/:id
export const adminUpdateUser = async (id, payload) => {
  return axios.put(`${API_URL}/admin/users/${id}`, payload, { headers: headers() });
};

// DELETE /api/admin/users/:id
export const adminDeleteUser = async (id) => {
  return axios.delete(`${API_URL}/admin/users/${id}`, { headers: headers() });
};

// PATCH /api/admin/users/:id/role
export const adminSetUserRole = async (id, role) => {
  return axios.patch(`${API_URL}/admin/users/${id}/role`, { role }, { headers: headers() });
};

/* ========== OPTIONAL SIMPLE VARIANTS ========== */
// GET /api/admin/users/all
export const adminGetAllUsersSimple = async () => {
  return axios.get(`${API_URL}/admin/users/all`, { headers: headers() });
};

// PUT /api/admin/users/simple/:id
export const adminUpdateUserSimple = async (id, payload) => {
  return axios.put(`${API_URL}/admin/users/simple/${id}`, payload, { headers: headers() });
};

// DELETE /api/admin/users/simple/:id
export const adminDeleteUserSimple = async (id) => {
  return axios.delete(`${API_URL}/admin/users/simple/${id}`, { headers: headers() });
};

/* ========== STATS ========== */
// GET /api/admin/stats
export const adminGetStats = async () => {
  return axios.get(`${API_URL}/admin/stats`, { headers: headers() });
};

/* ========== REQUISITIONS HELPERS ========== */
// GET /api/admin/requisitions?status=approved&base=&plan=
export const adminListRequisitions = async ({ status = 'all', base = '', plan = '' } = {}) => {
  const params = new URLSearchParams({});
  if (status) params.set('status', status);
  if (base) params.set('base', base);
  if (plan) params.set('plan', plan);
  return axios.get(`${API_URL}/admin/requisitions?${params.toString()}`, { headers: headers() });
};

// PATCH /api/admin/requisitions/status  { ids: [...], status: 'approved' }
export const adminBulkUpdateRequisitionStatus = async (ids, status) => {
  return axios.patch(
    `${API_URL}/admin/requisitions/status`,
    { ids, status },
    { headers: headers() }
  );
};
