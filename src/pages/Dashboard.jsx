import React from 'react';
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

export default function Dashboard() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard label="Total Ingredients" value={23} icon={FaCarrot} />
        <StatsCard label="Active Menus" value={8} icon={FaUtensils} />
        <StatsCard label="Pending Requisitions" value={5} icon={FaClipboardList} />
        <StatsCard label="Budget Usage" value="76%" icon={FaDollarSign} />
      </div>

      {/* Charts Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Monthly System Activity</h2>
          <LineChart />
        </div>

        <div className="bg-white shadow rounded-xl p-6">
          <DonutChart />
        </div>
      </div>
    </div>
  );
}
