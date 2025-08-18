// src/pages/admin/AdminStats.jsx (Polished UI)
import React, { useEffect, useState, useMemo } from 'react';
import { adminGetStats } from '../../api/adminApi';
import AdminCard from '../../components/admin/AdminCard';
import { FaUsers, FaBook, FaCarrot, FaCalendarAlt, FaClipboardList, FaCogs, FaTachometerAlt, FaSync } from 'react-icons/fa';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts';

export default function AdminStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const res = await adminGetStats();
      setStats(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const reqData = useMemo(() => [
    { name: 'Pending', value: stats?.requisitions?.pending || 0 },
    { name: 'Approved', value: stats?.requisitions?.approved || 0 },
    { name: 'Completed', value: stats?.requisitions?.completed || 0 },
  ], [stats]);

  const cards = useMemo(() => ([
    { icon: <FaUsers />, title: 'Users', value: stats?.users ?? 0, accent: 'from-sky-500 to-indigo-500' },
    { icon: <FaBook />, title: 'Recipes', value: stats?.recipes ?? 0, accent: 'from-emerald-500 to-teal-500' },
    { icon: <FaCarrot />, title: 'Ingredients', value: stats?.ingredients ?? 0, accent: 'from-amber-500 to-orange-500' },
    { icon: <FaCalendarAlt />, title: 'Menus', value: stats?.menus ?? 0, accent: 'from-fuchsia-500 to-purple-500' },
    { icon: <FaClipboardList />, title: 'Requisitions', value: stats?.requisitions?.total ?? 0, accent: 'from-rose-500 to-red-500' },
    { icon: <FaCogs />, title: 'Productions', value: stats?.productions ?? 0, accent: 'from-slate-500 to-gray-700' },
  ]), [stats]);

  const totals = useMemo(() => {
    const s = stats || {};
    const sum = (n) => (typeof n === 'number' ? n : 0);
    const totalEntities = sum(s.users) + sum(s.recipes) + sum(s.ingredients) + sum(s.menus) + sum(s.productions) + sum(s.plans) + sum(s?.requisitions?.total);
    return { totalEntities, plans: s.plans || 0 };
  }, [stats]);

  // Chart theme and animation helpers
  const section = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } };
  const tooltipStyle = { backgroundColor: 'white', border: '1px solid #eee', borderRadius: 8, fontSize: 12 };

  // Loading skeleton
  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="relative overflow-hidden rounded-2xl border border-rose-100 shadow bg-white">
          <div className="absolute inset-0 bg-gradient-to-r from-rose-600 via-rose-500 to-pink-500 opacity-95" />
          <div className="relative p-6">
            <div className="animate-pulse h-6 w-40 bg-white/30 rounded mb-3" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-16 rounded-xl bg-white/20" />
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-28 rounded-2xl bg-white animate-pulse border border-gray-100 shadow" />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-80 rounded-2xl bg-white animate-pulse border border-gray-100 shadow" />
          ))}
        </div>
      </div>
    );
  }

  if (!stats) return <div className="p-6 text-red-600">Failed to load stats</div>;

  return (
    <div className="p-6 space-y-6 relative overflow-hidden">
      {/* Decorative background */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-gradient-to-tr from-rose-200 via-pink-200 to-fuchsia-200 blur-3xl opacity-40" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-gradient-to-br from-amber-100 via-rose-100 to-pink-100 blur-3xl opacity-50" />

      {/* Header / KPI ribbon */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-2xl border border-rose-100 shadow bg-white">
        <div className="absolute inset-0 bg-gradient-to-r from-rose-600 via-rose-500 to-pink-500 opacity-95" />
        <div className="absolute inset-0 backdrop-blur-[1px]" />
        <div className="relative p-6 text-white">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="grid place-items-center h-10 w-10 rounded-xl bg-white/20"><FaTachometerAlt /></div>
              <div>
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <p className="text-white/80 text-sm">Key metrics across users, recipes, menus, inventory, and operations.</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="rounded-xl bg-white/15 border border-white/20 p-3 text-center"><div className="text-[11px] text-white/80">Entities</div><div className="text-lg font-extrabold">{totals.totalEntities}</div></div>
              <div className="rounded-xl bg-white/15 border border-white/20 p-3 text-center"><div className="text-[11px] text-white/80">Requisitions</div><div className="text-lg font-extrabold">{stats.requisitions?.total || 0}</div></div>
              <div className="rounded-xl bg-white/15 border border-white/20 p-3 text-center"><div className="text-[11px] text-white/80">Plans</div><div className="text-lg font-extrabold">{totals.plans}</div></div>
              <motion.button whileTap={{ scale: 0.98 }} onClick={load} className="rounded-xl bg-white/20 border border-white/25 px-4 py-2 inline-flex items-center gap-2 justify-center">
                <FaSync className="animate-spin-slow" /> Refresh
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Cards */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {cards.map((c, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
            <AdminCard icon={c.icon} title={c.title} value={c.value} accent={c.accent} />
          </motion.div>
        ))}
      </motion.div>

      {/* Charts */}
      <motion.div variants={section} initial="hidden" animate="show" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow border border-gray-100 p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-semibold text-gray-700">Requisitions by Status</div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={reqData} barSize={42}>
                <defs>
                  <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#fb7185" />
                    <stop offset="100%" stopColor="#f43f5e" />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="name" tickMargin={8} />
                <YAxis allowDecimals={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} fill="url(#barGrad)" isAnimationActive />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow border border-gray-100 p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-semibold text-gray-700">Total Entities Trend (Snapshot)</div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={[
                { name: 'Users', v: stats.users || 0 },
                { name: 'Recipes', v: stats.recipes || 0 },
                { name: 'Menus', v: stats.menus || 0 },
                { name: 'Plans', v: stats.plans || 0 },
                { name: 'Reqs', v: stats.requisitions?.total || 0 },
              ]}>
                <defs>
                  <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="name" tickMargin={8} />
                <YAxis allowDecimals={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line type="monotone" dataKey="v" dot strokeWidth={3} stroke="url(#lineGrad)" isAnimationActive />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Tailwind helper (optional): slow spin for refresh icon
// Add this to your global CSS if you like a smoother spin
// .animate-spin-slow { animation: spin 1.8s linear infinite; }
