import React, { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { FaFileCsv, FaChartBar, FaFilter } from 'react-icons/fa';
import { BsPieChartFill } from 'react-icons/bs';
import { fetchReportSummary, exportReportsToCSV } from '../api/reportApi';
import { Chart as ChartJS, BarElement, ArcElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

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
      const res = await fetchReportSummary({
        base: baseFilter,
        from: dateRange.from,
        to: dateRange.to,
      });
      setData(res.data);

      // Extract bases from filtered result to update dropdown
      const baseSet = new Set(res.data.filtered.map(r => r.base));
      setUniqueBases(['All', ...baseSet]);
    } catch (err) {
      console.error('Failed to fetch reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [baseFilter, dateRange]);

  const { filtered, summaryByMonth, summaryByCategory } = data;

  const barData = {
    labels: summaryByMonth.map(d => d.month),
    datasets: [
      {
        label: 'Menus',
        data: summaryByMonth.map(d => d.menus),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
      {
        label: 'Cost ($)',
        data: summaryByMonth.map(d => d.cost),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      },
    ],
  };

  const pieData = {
    labels: summaryByCategory.map(c => c.category),
    datasets: [
      {
        label: 'Cost by Category',
        data: summaryByCategory.map(c => c.cost),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#8e44ad'],
      },
    ],
  };

  return (
    <div className="p-6">
      <div className="flex justify-end items-center mb-6">
        <button
          onClick={() => exportReportsToCSV(filtered)}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm"
          disabled={loading || filtered.length === 0}
        >
          <FaFileCsv /> Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow mb-6">
        <h2 className="text-md font-semibold flex items-center gap-2 mb-3">
          <FaFilter /> Filters
        </h2>
        <div className="flex gap-4 flex-wrap">
          <select
            value={baseFilter}
            onChange={(e) => setBaseFilter(e.target.value)}
            className="border px-3 py-2 rounded text-sm"
          >
            {uniqueBases.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>

          <input
            type="date"
            className="border px-3 py-2 rounded text-sm"
            placeholder="From"
            value={dateRange.from}
            onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
          />
          <input
            type="date"
            className="border px-3 py-2 rounded text-sm"
            placeholder="To"
            value={dateRange.to}
            onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
          />
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="text-md font-semibold mb-2 flex items-center gap-2">
            <FaChartBar className="text-blue-500" /> Menu vs Cost (Monthly)
          </h2>
          <Bar data={barData} options={{ responsive: true }} />
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="text-md font-semibold mb-2 flex items-center gap-2">
            <BsPieChartFill className="text-yellow-500" /> Cost Share by Category
          </h2>
          <Pie data={pieData} options={{ responsive: true }} />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white p-4 rounded-xl shadow overflow-x-auto">
        <h2 className="text-md font-semibold mb-3 text-gray-700">Filtered Report Summary</h2>
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">Date</th>
              <th className="p-2">Month</th>
              <th className="p-2">Base</th>
              <th className="p-2">Category</th>
              <th className="p-2">Menus</th>
              <th className="p-2">Ingredients</th>
              <th className="p-2">Cost ($)</th>
              <th className="p-2">KCAL</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((d, i) => (
              <tr key={i} className="border-b text-center hover:bg-gray-50">
                <td className="p-2">{d.date}</td>
                <td className="p-2">{d.month}</td>
                <td className="p-2">{d.base}</td>
                <td className="p-2 capitalize">{d.category}</td>
                <td className="p-2">{d.menus}</td>
                <td className="p-2">{d.ingredients}</td>
                <td className="p-2">${d.cost}</td>
                <td className="p-2">{d.kcal}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
