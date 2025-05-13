import React from 'react';
import { motion } from 'framer-motion';

export default function StatsCard({ label, value, icon: Icon }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white/80 backdrop-blur-md border border-gray-200 rounded-xl p-6 shadow hover:shadow-lg transition-all"
    >
      <div className="flex items-center justify-between">
        {/* Label & Value */}
        <div>
          <p className="text-sm text-gray-500 font-medium mb-1">{label}</p>
          <h3 className="text-3xl font-bold text-gray-800">{value}</h3>
        </div>

        {/* Icon Circle */}
        <div className="w-12 h-12 flex items-center justify-center bg-red-100 text-red-600 rounded-full shadow-inner">
          {Icon && <Icon className="text-xl" />}
        </div>
      </div>
    </motion.div>
  );
}
