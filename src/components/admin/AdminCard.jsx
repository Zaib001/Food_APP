// src/components/admin/AdminCard.jsx
import React from 'react';
import { motion } from 'framer-motion';

export default function AdminCard({ icon, title, value, sub, accent = 'from-red-500 to-pink-500' }) {
  return (
    <motion.div
      initial={{ y: 16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: .3 }}
      className="rounded-2xl p-5 bg-white shadow border border-gray-100 hover:shadow-md transition"
    >
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${accent} text-white flex items-center justify-center mb-3`}>
        {icon}
      </div>
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-2xl font-semibold text-gray-800">{value}</div>
      {sub && <div className="text-xs text-gray-400 mt-1">{sub}</div>}
    </motion.div>
  );
}
