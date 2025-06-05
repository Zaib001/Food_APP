import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { FaUserCircle } from 'react-icons/fa';

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const pathTitle = location.pathname.split('/')[2] || 'dashboard';
  const title = pathTitle.charAt(0).toUpperCase() + pathTitle.slice(1);

  return (
    <div className="flex">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <main className="flex-1 ml-0 min-h-screen bg-gray-50">
        <header className="flex justify-between items-center p-4 border-b bg-white sticky top-0 z-30 shadow-sm">
          <h2 className="text-xl font-bold capitalize">{title}</h2>
          <FaUserCircle className="text-2xl text-gray-700" />
        </header>

        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
