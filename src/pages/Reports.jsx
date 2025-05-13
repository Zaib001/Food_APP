import React, { useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { FaFileCsv, FaChartBar, FaFilter } from 'react-icons/fa';
import { BsPieChartFill } from 'react-icons/bs';
import { exportReportsToCSV } from '../utils/exportMenus';
import { Chart as ChartJS, BarElement, ArcElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
ChartJS.register(BarElement, ArcElement, CategoryScale, LinearScale, Tooltip, Legend);

// Simulated Report Data
const allReports = [
    { date: '2024-01-10', month: 'January', base: 'Base A', category: 'protein', menus: 40, ingredients: 180, cost: 860, kcal: 5200 },
    { date: '2024-01-15', month: 'January', base: 'Base B', category: 'side', menus: 40, ingredients: 150, cost: 700, kcal: 4300 },
    { date: '2024-02-10', month: 'February', base: 'Base A', category: 'protein', menus: 50, ingredients: 190, cost: 920, kcal: 5600 },
    { date: '2024-02-20', month: 'February', base: 'Base B', category: 'bread', menus: 42, ingredients: 130, cost: 650, kcal: 4100 },
    { date: '2024-03-10', month: 'March', base: 'Base A', category: 'beverage', menus: 45, ingredients: 160, cost: 800, kcal: 4700 },
];

const uniqueBases = ['All', ...new Set(allReports.map(r => r.base))];

export default function Reports() {
    const [baseFilter, setBaseFilter] = useState('All');
    const [dateRange, setDateRange] = useState({ from: '', to: '' });

    const filtered = allReports.filter((r) => {
        const isBaseMatch = baseFilter === 'All' || r.base === baseFilter;
        const isDateMatch =
            (!dateRange.from || new Date(r.date) >= new Date(dateRange.from)) &&
            (!dateRange.to || new Date(r.date) <= new Date(dateRange.to));
        return isBaseMatch && isDateMatch;
    });

    const summaryByMonth = Object.values(
        filtered.reduce((acc, curr) => {
            acc[curr.month] = acc[curr.month] || { ...curr, ingredients: 0, cost: 0, kcal: 0, menus: 0 };
            acc[curr.month].ingredients += curr.ingredients;
            acc[curr.month].cost += curr.cost;
            acc[curr.month].kcal += curr.kcal;
            acc[curr.month].menus += curr.menus;
            return acc;
        }, {})
    );

    const summaryByCategory = Object.values(
        filtered.reduce((acc, curr) => {
            acc[curr.category] = acc[curr.category] || { category: curr.category, cost: 0, kcal: 0 };
            acc[curr.category].cost += curr.cost;
            acc[curr.category].kcal += curr.kcal;
            return acc;
        }, {})
    );

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
