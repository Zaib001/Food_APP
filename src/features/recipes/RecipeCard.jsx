import React from 'react';
import { FaEdit, FaTrash, FaFireAlt, FaDollarSign, FaClipboardList } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function RecipeCard({ recipe, ingredientsMap, onEdit, onDelete }) {
  const getIngredientName = (id) => ingredientsMap[id]?.name || 'Unknown';
  const getUnit = (id) => ingredientsMap[id]?.unit || '';
  const getPrice = (id) => Number(ingredientsMap[id]?.price || 0);
  const getKcal = (id) => Number(ingredientsMap[id]?.kcal || 0);
  const getYield = (id) => Number(ingredientsMap[id]?.yield || 100);

  const totalCost = recipe.ingredients.reduce((sum, item) => {
    const adjustedQty = item.quantity / (getYield(item.ingredientId) / 100);
    return sum + adjustedQty * getPrice(item.ingredientId);
  }, 0);

  const totalKcal = recipe.ingredients.reduce((sum, item) => {
    return sum + (item.quantity * getKcal(item.ingredientId)) / 1000;
  }, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white border border-gray-200 shadow-lg rounded-xl p-5 hover:shadow-xl transition duration-300"
    >
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <FaClipboardList className="text-red-500" /> {recipe.name}
        </h3>
        <div className="flex gap-2 text-gray-600">
          <button
            onClick={onEdit}
            className="hover:text-blue-600 transition"
            title="Edit Recipe"
          >
            <FaEdit />
          </button>
          <button
            onClick={onDelete}
            className="hover:text-red-600 transition"
            title="Delete Recipe"
          >
            <FaTrash />
          </button>
        </div>
      </div>

      <ul className="mb-4 text-sm text-gray-700 space-y-1">
        {recipe.ingredients.map((item, idx) => (
          <li key={idx}>
            • {getIngredientName(item.ingredientId)} — <span className="font-medium">{item.quantity}</span> {getUnit(item.ingredientId)}
          </li>
        ))}
      </ul>

      <div className="flex justify-between text-sm font-medium text-gray-600 border-t pt-3">
        <span className="flex items-center gap-1">
          <FaFireAlt className="text-orange-500" />
          KCAL: <strong>{totalKcal.toFixed(2)}</strong>
        </span>
        <span className="flex items-center gap-1">
          <FaDollarSign className="text-green-600" />
          Cost: <strong>${totalCost.toFixed(2)}</strong>
        </span>
      </div>
    </motion.div>
  );
}
