import React from 'react';
import { motion } from 'framer-motion';
import { FaEdit, FaTrash } from 'react-icons/fa';

export default function IngredientTable({ ingredients, onEdit, onDelete }) {
  return (
    <motion.div
      className="bg-white shadow-lg rounded-xl p-6 border border-gray-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-xl font-bold mb-6 text-gray-800">Ingredient List</h2>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border border-gray-200">
          <thead className="bg-gray-100 text-gray-700 font-semibold">
            <tr>
              <th className="p-3 border-b border-gray-200">Name</th>
              <th className="p-3 border-b border-gray-200">Unit</th>
              <th className="p-3 border-b border-gray-200">Price</th>
              <th className="p-3 border-b border-gray-200">KCAL</th>
              <th className="p-3 border-b border-gray-200">Yield (%)</th>
              <th className="p-3 border-b border-gray-200 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {ingredients.map((ing, index) => (
              <tr
                key={index}
                className={`transition-all duration-200 ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                } hover:bg-red-50`}
              >
                <td className="p-3 border-b border-gray-200">{ing.name}</td>
                <td className="p-3 border-b border-gray-200">{ing.unit}</td>
                <td className="p-3 border-b border-gray-200">${ing.price}</td>
                <td className="p-3 border-b border-gray-200">{ing.kcal}</td>
                <td className="p-3 border-b border-gray-200">{ing.yield}%</td>
                <td className="p-3 border-b border-gray-200 text-center">
                  <button
                    onClick={() => onEdit(index)}
                    className="text-blue-600 hover:text-blue-800 mr-3 transition"
                    title="Edit"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => onDelete(index)}
                    className="text-red-600 hover:text-red-800 transition"
                    title="Delete"
                  >
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
