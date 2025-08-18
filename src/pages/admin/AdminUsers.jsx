// src/pages/admin/AdminUsers.jsx (Polished UI)
import React, { useEffect, useMemo, useState } from 'react';
import Toolbar from '../../components/admin/Toolbar';
import Modal from '../../components/admin/Modal';
import ConfirmModal from '../../components/admin/ConfirmModal';
import {
  adminListUsers,
  adminCreateUser,
  adminUpdateUser,
  adminDeleteUser,
  adminSetUserRole,
} from '../../api/adminApi';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUserShield, FaSearch, FaPlus, FaUsers, FaUserTie } from 'react-icons/fa';

const emptyForm = { name: '', email: '', password: '', role: 'user' };

export default function AdminUsers() {
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [data, setData] = useState({ items: [], total: 0, pages: 0 });
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [confirm, setConfirm] = useState({ open: false, id: null });

  const load = async () => {
    try {
      setLoading(true);
      const res = await adminListUsers({ search: q, page, limit });
      setData(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, page, limit]);

  const onCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const onEdit = (u) => {
    setEditingId(u.id || u._id);
    setForm({ name: u.name, email: u.email, password: '', role: u.role });
    setModalOpen(true);
  };

  const onSave = async () => {
    try {
      if (editingId) {
        await adminUpdateUser(editingId, { ...form, password: form.password || undefined });
      } else {
        await adminCreateUser(form);
      }
      setModalOpen(false);
      load();
    } catch (e) {
      console.error(e);
    }
  };

  const onDelete = async (id) => {
    try {
      await adminDeleteUser(id);
      setConfirm({ open: false, id: null });
      load();
    } catch (e) {
      console.error(e);
    }
  };

  const onRoleChange = async (id, role) => {
    try {
      await adminSetUserRole(id, role);
      load();
    } catch (e) {
      console.error(e);
    }
  };

  const pages = useMemo(() => Array.from({ length: data.pages || 0 }, (_, i) => i + 1), [data.pages]);
  const pageAdminCount = useMemo(() => (data.items || []).filter((u) => u.role === 'admin').length, [data.items]);

  // UI helpers
  const section = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } };
  const pill = 'rounded-xl bg-white/15 border border-white/20 p-3 text-center';

  return (
    <div className="p-6 relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-gradient-to-tr from-rose-200 via-pink-200 to-fuchsia-200 blur-3xl opacity-50" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-60 w-60 rounded-full bg-gradient-to-br from-amber-100 to-rose-100 blur-3xl opacity-60" />

      {/* Header Card */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-2xl border border-rose-100 shadow bg-white">
        <div className="absolute inset-0 bg-gradient-to-r from-rose-600 via-rose-500 to-pink-500 opacity-95" />
        <div className="absolute inset-0 backdrop-blur-[1px]" />
        <div className="relative p-6 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="grid place-items-center h-10 w-10 rounded-xl bg-white/20">
                <FaUserShield />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Admin – Users</h1>
                <p className="text-white/80 text-sm">Manage accounts, roles, and access. Search, edit, and paginate with ease.</p>
              </div>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-4 gap-3">
              <div className={pill}><div className="text-[11px] text-white/80">Total</div><div className="text-lg font-extrabold flex items-center gap-2"><FaUsers /> {data.total}</div></div>
              <div className={pill}><div className="text-[11px] text-white/80">This Page</div><div className="text-lg font-extrabold">{data.items?.length || 0}</div></div>
              <div className={pill}><div className="text-[11px] text-white/80">Admins (page)</div><div className="text-lg font-extrabold flex items-center gap-2"><FaUserTie /> {pageAdminCount}</div></div>
              <div className={pill}><div className="text-[11px] text-white/80">Pages</div><div className="text-lg font-extrabold">{data.pages || 0}</div></div>
            </div>
          </div>

          <div className="mt-4">
            {/* Keep Toolbar API, but upgrade inner controls */}
            <Toolbar
              left={
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/80" />
                  <input
                    value={q}
                    onChange={(e) => {
                      setQ(e.target.value);
                      setPage(1);
                    }}
                    placeholder="Search users..."
                    className="pl-10 pr-3 py-2 rounded-xl bg-white/15 border border-white/25 text-white placeholder-white/70 w-64 focus:outline-none focus:ring-4 focus:ring-white/30"
                  />
                </div>
              }
              right={
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={onCreate}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 border border-white/25 text-white rounded-xl hover:bg-white/20 focus:outline-none focus:ring-4 focus:ring-white/30"
                >
                  <FaPlus /> New User
                </motion.button>
              }
            />
          </div>
        </div>
      </motion.div>

      {/* Table */}
      <motion.div variants={section} initial="hidden" animate="show" className="mt-6 bg-white rounded-2xl shadow border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Role</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence initial={false}>
                {loading && (
                  <tr>
                    <td colSpan={4} className="p-4">
                      <div className="animate-pulse h-10 bg-gray-100 rounded" />
                    </td>
                  </tr>
                )}

                {!loading && data.items?.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-gray-400">No users</td>
                  </tr>
                )}

                {!loading && data.items?.map((u, i) => (
                  <motion.tr
                    key={u._id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className={`border-t ${i % 2 ? 'bg-white' : 'bg-gray-50'} hover:bg-rose-50`}
                  >
                    <td className="p-3 whitespace-nowrap">{u.name}</td>
                    <td className="p-3 whitespace-nowrap">{u.email}</td>
                    <td className="p-3 whitespace-nowrap">
                      <select
                        value={u.role}
                        onChange={(e) => onRoleChange(u._id, e.target.value)}
                        className="px-2 py-1 border rounded-lg focus:border-rose-400 focus:ring-4 focus:ring-rose-200/50 outline-none"
                      >
                        <option value="user">user</option>
                        <option value="admin">admin</option>
                      </select>
                    </td>
                    <td className="p-3 text-right space-x-2 whitespace-nowrap">
                      <button onClick={() => onEdit(u)} className="px-3 py-1 rounded-lg border hover:bg-gray-50">Edit</button>
                      <button onClick={() => setConfirm({ open: true, id: u._id })} className="px-3 py-1 rounded-lg border text-rose-600 hover:bg-rose-50">Delete</button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-3 flex flex-col sm:flex-row gap-2 sm:gap-4 sm:items-center justify-between">
          <div className="text-xs text-gray-500">Page <strong>{page}</strong> of <strong>{data.pages || 0}</strong></div>
          <div className="flex flex-wrap gap-2">
            {pages.map((p) => (
              <motion.button
                key={p}
                whileTap={{ scale: 0.98 }}
                onClick={() => setPage(p)}
                className={`px-3 py-1.5 rounded-xl text-sm ${p === page ? 'bg-rose-600 text-white shadow' : 'border hover:bg-gray-50'}`}
              >
                {p}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Create/Edit Modal */}
      <Modal
        open={modalOpen}
        title={editingId ? 'Edit User' : 'Create User'}
        onClose={() => setModalOpen(false)}
        footer={
          <div className="flex gap-2">
            <button onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-xl border hover:bg-gray-50">Cancel</button>
            <button onClick={onSave} className="px-4 py-2 rounded-xl bg-rose-600 text-white hover:bg-rose-700 shadow">{editingId ? 'Save Changes' : 'Create User'}</button>
          </div>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-gray-600">Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 border rounded-xl focus:border-rose-400 focus:ring-4 focus:ring-rose-200/50 outline-none"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">Email</label>
            <input
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-3 py-2 border rounded-xl focus:border-rose-400 focus:ring-4 focus:ring-rose-200/50 outline-none"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">Role</label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="w-full px-3 py-2 border rounded-xl focus:border-rose-400 focus:ring-4 focus:ring-rose-200/50 outline-none"
            >
              <option value="user">user</option>
              <option value="admin">admin</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-600">{editingId ? 'New Password (optional)' : 'Password'}</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full px-3 py-2 border rounded-xl focus:border-rose-400 focus:ring-4 focus:ring-rose-200/50 outline-none"
            />
          </div>
        </div>
      </Modal>

      {/* Delete confirm */}
      <ConfirmModal
        open={confirm.open}
        message="This action cannot be undone. Delete this user?"
        onCancel={() => setConfirm({ open: false, id: null })}
        onConfirm={() => onDelete(confirm.id)}
      />
    </div>
  );
}
