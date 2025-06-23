import React, { useEffect, useState } from 'react';
import StatsCard from '../components/StatsCard';
import LineChart from '../components/LineChart';
import DonutChart from '../components/DonutChart';
import ActivityLog from '../components/ActivityLog';
import {
  FaCarrot,
  FaUtensils,
  FaClipboardList,
  FaDollarSign,
} from 'react-icons/fa';
import {
  fetchStats,
  fetchMonthlySummary,
  fetchCategoryShare,
  fetchActivityLog,
} from '../api/dashboard';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [summary, setSummary] = useState([]);
  const [categoryShare, setCategoryShare] = useState([]);
  const [activityLog, setActivityLog] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [statsRes, summaryRes, shareRes, activityRes] = await Promise.all([
          fetchStats(),
          fetchMonthlySummary(),
          fetchCategoryShare(),
          fetchActivityLog(),
        ]);
        setStats(statsRes.data);
        setSummary(summaryRes.data);
        setCategoryShare(shareRes.data);
        setActivityLog(activityRes.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load dashboard data');
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) return <div className="p-6">Loading dashboard...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard label="Total Ingredients" value={stats?.totalIngredients} icon={FaCarrot} />
        <StatsCard label="Active Menus" value={stats?.activeMenus} icon={FaUtensils} />
        <StatsCard label="Pending Requisitions" value={stats?.pendingRequisitions} icon={FaClipboardList} />
        <StatsCard label="Budget Usage" value={`${stats?.budgetUsage}%`} icon={FaDollarSign} />
      </div>

      {/* Charts Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Monthly System Activity</h2>
          <LineChart data={summary} />
        </div>

        <div className="bg-white shadow rounded-xl p-6">
          <DonutChart data={categoryShare} />
        </div>
      </div>

      {/* Activity Log */}
      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Recent Activity</h2>
        <ActivityLog entries={activityLog} />
      </div>
    </div>
  );
}
