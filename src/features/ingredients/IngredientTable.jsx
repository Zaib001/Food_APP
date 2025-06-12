import React from 'react';
import { motion } from 'framer-motion';
import { FaEdit, FaTrash } from 'react-icons/fa';

export default function IngredientTable({ ingredients = [], onEdit, onDelete }) {
  if (!Array.isArray(ingredients)) {
    return <div className="text-red-600 p-4">Invalid ingredient data.</div>;
  }

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
              <th className="p-3 border-b">Name</th>
              <th className="p-3 border-b">Purchase Qty</th>
              <th className="p-3 border-b">Purchase Unit</th>
              <th className="p-3 border-b">Original Unit</th>
              <th className="p-3 border-b">Price/Unit</th>
              <th className="p-3 border-b">Price/Kg</th>
              <th className="p-3 border-b">Yield</th>
              <th className="p-3 border-b">Standard Wt</th>
              <th className="p-3 border-b">KCAL</th>
              <th className="p-3 border-b">Category</th>
              <th className="p-3 border-b">Warehouse</th>
              <th className="p-3 border-b text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {ingredients.length === 0 ? (
              <tr>
                <td colSpan="12" className="p-4 text-center text-gray-500">
                  No ingredients available.
                </td>
              </tr>
            ) : (
              ingredients.map((ing, index) => (
                <tr
                  key={index}
                  className={`transition duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-red-50`}
                >
                  <td className="p-3 border-b">{ing.name}</td>
                  <td className="p-3 border-b">{ing.purchaseQuantity}</td>
                  <td className="p-3 border-b">{ing.purchaseUnit}</td>
                  <td className="p-3 border-b">{ing.originalUnit}</td>
                  <td className="p-3 border-b">${parseFloat(ing.originalPrice).toFixed(2)}</td>
                  <td className="p-3 border-b">${parseFloat(ing.pricePerKg).toFixed(2)}</td>
                  <td className="p-3 border-b">{ing.yield}%</td>
                  <td className="p-3 border-b">{ing.standardWeight || '-'}</td>
                  <td className="p-3 border-b">{ing.kcal}</td>
                  <td className="p-3 border-b capitalize">{ing.category || '-'}</td>
                  <td className="p-3 border-b">{ing.warehouse || '-'}</td>
                  <td className="p-3 border-b text-center">
                    <button
                      onClick={() => onEdit(index)}
                      className="text-blue-600 hover:text-blue-800 mr-3"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => onDelete(index)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
