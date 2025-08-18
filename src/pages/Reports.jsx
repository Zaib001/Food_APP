// src/pages/Reports.jsx (Polished UI)
import React, { useEffect, useMemo, useState } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import { FaFileCsv, FaChartBar, FaFilter, FaSync, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';
import { BsPieChartFill } from 'react-icons/bs';
import { fetchReportSummary, exportReportsToCSV } from '../api/reportApi';
import { Chart as ChartJS, BarElement, ArcElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { motion, AnimatePresence } from 'framer-motion';

ChartJS.register(BarElement, ArcElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function Reports() {
  const [baseFilter, setBaseFilter] = useState('All');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [data, setData] = useState({ filtered: [], summaryByMonth: [], summaryByCategory: [] });
  const [uniqueBases, setUniqueBases] = useState(['All']);
  const [loading, setLoading] = useState(false);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await fetchReportSummary({ base: baseFilter, from: dateRange.from, to: dateRange.to });
      setData(res.data);
      const baseSet = new Set(res.data.filtered.map((r) => r.base).filter(Boolean));
      setUniqueBases(['All', ...baseSet]);
    } catch (err) {
      console.error('Failed to fetch reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseFilter, dateRange]);

  const { filtered, summaryByMonth, summaryByCategory } = data;

  // Quick KPIs
  const kpis = useMemo(() => {
    const sum = (arr, key) => (arr || []).reduce((s, x) => s + Number(x[key] || 0), 0);
    const totalMenus = sum(filtered, 'menus');
    const totalCost = sum(filtered, 'cost');
    const totalKcal = sum(filtered, 'kcal');
    const months = (summaryByMonth || []).length;
    const categories = (summaryByCategory || []).length;
    return { totalMenus, totalCost, totalKcal, months, categories };
  }, [filtered, summaryByMonth, summaryByCategory]);

  // Charts
  const barData = useMemo(() => ({
    labels: (summaryByMonth || []).map((d) => d.month),
    datasets: [
      {
        label: 'Menus',
        data: (summaryByMonth || []).map((d) => d.menus),
        backgroundColor: 'rgba(244, 63, 94, 0.85)', // rose-500
        borderRadius: 8,
        borderSkipped: false,
      },
      {
        label: 'Cost ($)',
        data: (summaryByMonth || []).map((d) => d.cost),
        backgroundColor: 'rgba(59, 130, 246, 0.85)', // blue-500
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  }), [summaryByMonth]);

  const barOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { usePointStyle: true } },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const label = ctx.dataset.label || '';
            const v = ctx.parsed.y;
            if (label.toLowerCase().includes('cost')) return `${label}: $${new Intl.NumberFormat().format(v)}`;
            return `${label}: ${new Intl.NumberFormat().format(v)}`;
          },
        },
      },
    },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { precision: 0 } },
    },
    animation: { duration: 800, easing: 'easeOutQuart' },
  }), []);

  const pieData = useMemo(() => ({
    labels: (summaryByCategory || []).map((c) => c.category),
    datasets: [
      {
        label: 'Cost by Category',
        data: (summaryByCategory || []).map((c) => c.cost),
        backgroundColor: ['#fb7185', '#60a5fa', '#f59e0b', '#a78bfa', '#34d399', '#f97316'],
        borderWidth: 0,
      },
    ],
  }), [summaryByCategory]);

  const pieOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    cutout: '60%',
    plugins: {
      legend: { position: 'bottom', labels: { usePointStyle: true } },
      tooltip: {
        callbacks: {
          label: (ctx) => `$${new Intl.NumberFormat().format(ctx.parsed)}`,
        },
      },
    },
    animation: { duration: 900, easing: 'easeOutCubic' },
  }), []);

  // UI helpers
  const section = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

  return (
    <div className="p-6 space-y-6 relative overflow-hidden">
      {/* Decorative background */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-gradient-to-tr from-rose-200 via-pink-200 to-fuchsia-200 blur-3xl opacity-40" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-gradient-to-br from-amber-100 via-rose-100 to-pink-100 blur-3xl opacity-50" />

      {/* Header / Actions */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-2xl border border-rose-100 shadow bg-white">
        <div className="absolute inset-0 bg-gradient-to-r from-rose-600 via-rose-500 to-pink-500 opacity-95" />
        <div className="absolute inset-0 backdrop-blur-[1px]" />
        <div className="relative p-6 text-white">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="grid place-items-center h-10 w-10 rounded-xl bg-white/20"><FaChartBar /></div>
              <div>
                <h1 className="text-2xl font-bold">Reports & Analytics</h1>
                <p className="text-white/80 text-sm">Filter by base and date, visualize menu and cost trends, and export data.</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <div className="rounded-xl bg-white/15 border border-white/20 p-3 text-center"><div className="text-[11px] text-white/80">Menus</div><div className="text-lg font-extrabold">{kpis.totalMenus}</div></div>
              <div className="rounded-xl bg-white/15 border border-white/20 p-3 text-center"><div className="text-[11px] text-white/80">Cost ($)</div><div className="text-lg font-extrabold">{new Intl.NumberFormat().format(kpis.totalCost)}</div></div>
              <div className="rounded-xl bg-white/15 border border-white/20 p-3 text-center"><div className="text-[11px] text-white/80">kcal</div><div className="text-lg font-extrabold">{new Intl.NumberFormat().format(kpis.totalKcal)}</div></div>
              <div className="rounded-xl bg-white/15 border border-white/20 p-3 text-center"><div className="text-[11px] text-white/80">Months</div><div className="text-lg font-extrabold">{kpis.months}</div></div>
              <div className="rounded-xl bg-white/15 border border-white/20 p-3 text-center"><div className="text-[11px] text-white/80">Categories</div><div className="text-lg font-extrabold">{kpis.categories}</div></div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap justify-end gap-3">
            <motion.button whileTap={{ scale: 0.98 }} onClick={fetchReports} className="inline-flex items-center gap-2 rounded-xl bg-white/20 border border-white/25 px-4 py-2 text-white text-sm hover:bg-white/25 focus:outline-none focus:ring-4 focus:ring-white/30"><FaSync className={loading ? 'animate-spin' : ''} /> Refresh</motion.button>
            <motion.button whileTap={{ scale: 0.98 }} onClick={() => exportReportsToCSV(filtered)} disabled={loading || filtered.length === 0} className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold shadow focus:outline-none focus:ring-4 ${loading || filtered.length === 0 ? 'bg-emerald-400/50 text-white cursor-not-allowed' : 'bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-200/60'}`}><FaFileCsv /> Export CSV</motion.button>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div variants={section} initial="hidden" animate="show">
        <div className="rounded-2xl border bg-white/80 backdrop-blur shadow-sm p-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-2 text-gray-700"><FaFilter /><span className="text-sm font-semibold">Filters</span></div>
            <div className="flex flex-wrap gap-3">
              <div className="relative">
                <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <select value={baseFilter} onChange={(e) => setBaseFilter(e.target.value)} className="pl-9 pr-3 py-2 rounded-xl border border-gray-200 text-sm focus:border-rose-400 focus:ring-4 focus:ring-rose-200/50 outline-none">
                  {uniqueBases.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
              <div className="relative">
                <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="date" className="pl-9 pr-3 py-2 rounded-xl border border-gray-200 text-sm focus:border-rose-400 focus:ring-4 focus:ring-rose-200/50 outline-none" value={dateRange.from} onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })} />
              </div>
              <div className="relative">
                <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="date" className="pl-9 pr-3 py-2 rounded-xl border border-gray-200 text-sm focus:border-rose-400 focus:ring-4 focus:ring-rose-200/50 outline-none" value={dateRange.to} onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })} />
              </div>
              <button onClick={() => { setBaseFilter('All'); setDateRange({ from: '', to: '' }); }} className="px-3 py-2 rounded-xl border text-sm hover:bg-gray-50">Reset</button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Charts */}
      <motion.div variants={section} initial="hidden" animate="show" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-2xl shadow border border-gray-100">
          <h2 className="text-md font-semibold mb-2 flex items-center gap-2 text-gray-700">
            <FaChartBar className="text-blue-500" /> Menu vs Cost (Monthly)
          </h2>
          <div className="h-72">
            <Bar data={barData} options={barOptions} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow border border-gray-100">
          <h2 className="text-md font-semibold mb-2 flex items-center gap-2 text-gray-700">
            <BsPieChartFill className="text-yellow-500" /> Cost Share by Category
          </h2>
          <div className="h-72">
            <Doughnut data={pieData} options={pieOptions} />
          </div>
        </div>
      </motion.div>

      {/* Table */}
      <motion.div variants={section} initial="hidden" animate="show" className="bg-white p-4 rounded-2xl shadow border border-gray-100 overflow-x-auto">
        <h2 className="text-md font-semibold mb-3 text-gray-700">Filtered Report Summary</h2>
        <div className="min-w-full">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="p-2 text-left">Date</th>
                <th className="p-2 text-left">Month</th>
                <th className="p-2 text-left">Base</th>
                <th className="p-2 text-left">Category</th>
                <th className="p-2 text-right">Menus</th>
                <th className="p-2 text-right">Ingredients</th>
                <th className="p-2 text-right">Cost ($)</th>
                <th className="p-2 text-right">KCAL</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence initial={false}>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-4 text-center text-gray-400">No results for current filters.</td>
                  </tr>
                ) : (
                  filtered.map((d, i) => (
                    <motion.tr
                      key={`${d.date}-${i}`}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className={`border-b ${i % 2 ? 'bg-white' : 'bg-gray-50'} hover:bg-rose-50`}
                    >
                      <td className="p-2">{d.date}</td>
                      <td className="p-2">{d.month}</td>
                      <td className="p-2">{d.base}</td>
                      <td className="p-2 capitalize">{d.category}</td>
                      <td className="p-2 text-right">{d.menus}</td>
                      <td className="p-2 text-right">{d.ingredients}</td>
                      <td className="p-2 text-right">${new Intl.NumberFormat().format(d.cost)}</td>
                      <td className="p-2 text-right">{new Intl.NumberFormat().format(d.kcal)}</td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}