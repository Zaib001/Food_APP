import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { FaUserCircle } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import FoodLoader from '../components/ui/FoodLoader';

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [routeLoading, setRouteLoading] = useState(false);
  const location = useLocation();

  const pathTitle = location.pathname.split('/')[2] || 'dashboard';
  const title = pathTitle.charAt(0).toUpperCase() + pathTitle.slice(1);

  // Lightweight route-change loader (smooth, no scrollbars)
  useEffect(() => {
    setRouteLoading(true);
    const t = setTimeout(() => setRouteLoading(false), 480); // feel-good duration
    return () => clearTimeout(t);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <main className="ml-0 md:ml-64 transition-[margin] duration-300 min-h-screen">
        {/* Top bar */}
        <header className="flex justify-between items-center p-4 border-b bg-white sticky top-0 z-30 shadow-sm">
          <h2 className="text-xl font-bold capitalize">{title}</h2>
          <FaUserCircle className="text-2xl text-gray-700" />
        </header>

        {/* Subtle progress bar on route change */}
        <AnimatePresence>
          {routeLoading && (
            <motion.div
              key={location.key}
              className="fixed top-0 left-0 right-0 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
                className="h-1 bg-gradient-to-r from-rose-500 via-pink-500 to-fuchsia-500 shadow"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Page content with fade/slide transition */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div key={location.pathname} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Fullscreen fallback loader (can be triggered globally if needed) */}
      {/* Example usage elsewhere: <FoodLoader fullscreen label="Syncing data..." /> */}
    </div>
  );
}
