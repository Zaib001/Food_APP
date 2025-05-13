import React, { useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function ProductionTable({ data, onEdit, onDelete, recipesMap }) {
  const [sortField, setSortField] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  const sortedData = [...data].sort((a, b) => {
    const valA = a[sortField];
    const valB = b[sortField];
    if (sortOrder === 'asc') return valA > valB ? 1 : -1;
    else return valA < valB ? 1 : -1;
  });

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const getBadge = (qty) => {
    if (qty >= 100) return <span className="text-green-700 bg-green-100 px-2 py-0.5 rounded text-xs">High</span>;
    if (qty >= 50) return <span className="text-yellow-700 bg-yellow-100 px-2 py-0.5 rounded text-xs">Medium</span>;
    return <span className="text-red-700 bg-red-100 px-2 py-0.5 rounded text-xs">Low</span>;
  };

  return (
    <motion.div
      className="bg-white shadow-lg rounded-xl p-6 border border-gray-100 mt-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Production Logs</h2>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border border-gray-200">
          <thead className="bg-gray-100 text-gray-700 font-medium">
            <tr>
              <th className="p-3 cursor-pointer" onClick={() => toggleSort('date')}>Date</th>
              <th className="p-3">Recipe</th>
              <th className="p-3 cursor-pointer" onClick={() => toggleSort('quantity')}>Quantity</th>
              <th className="p-3">Base</th>
              <th className="p-3">Handled By</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((log, index) => (
              <tr
                key={index}
                className={`border-b hover:bg-gray-50 transition-all duration-200 ${index % 2 ? 'bg-white' : 'bg-gray-50'}`}
              >
                <td className="p-3">{log.date}</td>
                <td className="p-3">{recipesMap[log.recipeId]?.name || log.recipeId}</td>
                <td className="p-3">{log.quantity}</td>
                <td className="p-3">{log.base}</td>
                <td className="p-3">{log.handler}</td>
                <td className="p-3 text-center">{getBadge(Number(log.quantity))}</td>
                <td className="p-3 text-center space-x-2">
                  <button onClick={() => onEdit(index)} className="text-blue-600 hover:text-blue-800">
                    <FaEdit />
                  </button>
                  <button onClick={() => onDelete(index)} className="text-red-600 hover:text-red-800">
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
