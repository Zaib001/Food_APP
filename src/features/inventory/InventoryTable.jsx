import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function InventoryTable({ data = [], onEdit, onDelete }) {
  const getStatus = (qty) => {
    if (qty <= 0) return { label: 'Out of Stock', color: 'bg-red-100 text-red-700' };
    if (qty < 5) return { label: 'Low Stock', color: 'bg-yellow-100 text-yellow-700' };
    return { label: 'In Stock', color: 'bg-green-100 text-green-700' };
  };

  return (
    <motion.div
      className="bg-white p-4 rounded-xl shadow"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Inventory Overview</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border border-gray-200">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-2 text-left">Ingredient</th>
              <th className="p-2 text-left">Supplier</th>
              <th className="p-2 text-left">Qty</th>
              <th className="p-2 text-left">Unit</th>
              <th className="p-2 text-left">Date</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center p-4 text-gray-500">
                  No inventory records found.
                </td>
              </tr>
            ) : (
              data.map((item, index) => {
                const status = getStatus(Number(item.quantity));
                return (
                  <tr
                    key={index}
                    className="border-b hover:bg-gray-50 transition-all duration-200"
                  >
                    <td className="p-2">{item.ingredientName || item.ingredientId}</td>
                    <td className="p-2">{item.supplier}</td>
                    <td className="p-2 font-medium">{item.quantity}</td>
                    <td className="p-2">{item.unit}</td>
                    <td className="p-2">{item.date}</td>
                    <td className="p-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${status.color}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="p-2 text-center">
                      <button onClick={() => onEdit(index)} className="text-blue-600 hover:text-blue-800 mr-2">
                        <FaEdit />
                      </button>
                      <button onClick={() => onDelete(index)} className="text-red-600 hover:text-red-800">
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
