// src/pages/admin/AdminRequisitions.jsx
import React, { useEffect, useState } from 'react';
import Toolbar from '../../components/admin/Toolbar';
import ConfirmModal from '../../components/admin/ConfirmModal';
import {
  adminListRequisitions,
  adminBulkUpdateRequisitionStatus
} from '../../api/adminApi';
import { motion } from 'framer-motion';

export default function AdminRequisitions() {
  const [status, setStatus] = useState('all');
  const [base, setBase] = useState('');
  const [plan, setPlan] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(new Set());
  const [confirm, setConfirm] = useState({ open: false, nextStatus: null });

  const load = async () => {
    try {
      setLoading(true);
      const res = await adminListRequisitions({ status, base, plan });
      setItems(res.data || []);
      setSelected(new Set());
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [status, base, plan]);

  const toggle = (id) => {
    const c = new Set(selected);
    c.has(id) ? c.delete(id) : c.add(id);
    setSelected(c);
  };

  const bulk = async (nextStatus) => {
    try {
      await adminBulkUpdateRequisitionStatus(Array.from(selected), nextStatus);
      setConfirm({ open: false, nextStatus: null });
      load();
    } catch (e) { console.error(e); }
  };

  return (
    <div className="p-6">
      <Toolbar
        left={
          <>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="px-3 py-2 border rounded">
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="completed">Completed</option>
            </select>
            <input value={base} onChange={(e) => setBase(e.target.value)} placeholder="Filter by base" className="px-3 py-2 border rounded" />
            <input value={plan} onChange={(e) => setPlan(e.target.value)} placeholder="Filter by planId" className="px-3 py-2 border rounded" />
          </>
        }
        right={
          <div className="flex gap-2">
            <button
              disabled={selected.size === 0}
              onClick={() => setConfirm({ open: true, nextStatus: 'approved' })}
              className={`px-4 py-2 rounded ${selected.size ? 'bg-amber-500 text-white hover:bg-amber-600' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
            >
              Bulk Approve
            </button>
            <button
              disabled={selected.size === 0}
              onClick={() => setConfirm({ open: true, nextStatus: 'completed' })}
              className={`px-4 py-2 rounded ${selected.size ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
            >
              Mark Completed
            </button>
          </div>
        }
      />

      <div className="bg-white rounded-2xl shadow border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3"><input type="checkbox"
                  checked={selected.size > 0 && selected.size === items.length}
                  onChange={(e) => setSelected(e.target.checked ? new Set(items.map(i => i._id)) : new Set())}
                /></th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Base</th>
                <th className="p-3 text-left">Item</th>
                <th className="p-3 text-left">Unit</th>
                <th className="p-3 text-right">Qty</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Plan</th>
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan={8} className="p-4 text-center text-gray-400">Loading...</td></tr>}
              {!loading && items.length === 0 && <tr><td colSpan={8} className="p-4 text-center text-gray-400">No requisitions</td></tr>}

              {!loading && items.map((r) => (
                <motion.tr key={r._id}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .2 }}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="p-3">
                    <input type="checkbox" checked={selected.has(r._id)} onChange={() => toggle(r._id)} />
                  </td>
                  <td className="p-3">{r.date}</td>
                  <td className="p-3">{r.base}</td>
                  <td className="p-3">{r.item}</td>
                  <td className="p-3">{r.unit}</td>
                  <td className="p-3 text-right">{Number(r.quantity || 0).toFixed(2)}</td>
                  <td className="p-3">
                    <span className={
                      `px-2 py-1 rounded text-xs ${
                        r.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        r.status === 'approved' ? 'bg-blue-100 text-blue-700' :
                        'bg-green-100 text-green-700'}`
                    }>{r.status}</span>
                  </td>
                  <td className="p-3 text-xs">{r.plan || '—'}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmModal
        open={confirm.open}
        message={`Update ${selected.size} requisition(s) to "${confirm.nextStatus}"?`}
        onCancel={() => setConfirm({ open: false, nextStatus: null })}
        onConfirm={() => bulk(confirm.nextStatus)}
      />
    </div>
  );
}
