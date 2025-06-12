import React from 'react';
import {
  FaEdit,
  FaTrash,
  FaFireAlt,
  FaDollarSign,
  FaClipboardList,
  FaBalanceScale,
  FaUtensils,
  FaTags,
} from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function RecipeCard({ recipe, ingredientsMap, onEdit, onDelete }) {
  const getIngredientName = (id) => ingredientsMap[id]?.name || 'Unknown';
  const getUnit = (id) => ingredientsMap[id]?.unit || '';
  const getPrice = (id) => parseFloat(ingredientsMap[id]?.pricePerKg) || 0;
  const getKcal = (id) => parseFloat(ingredientsMap[id]?.kcal) || 0;
  const getYield = (id) => parseFloat(ingredientsMap[id]?.yield) || 100;



  const totalCost = recipe.ingredients.reduce((sum, item) => {
    const adjustedQty = item.quantity / (getYield(item.ingredientId) / 100);
    return sum + adjustedQty * getPrice(item.ingredientId);
  }, 0);

  const totalKcal = recipe.ingredients.reduce((sum, item) => {
    return sum + (item.quantity * getKcal(item.ingredientId)) / 1000;
  }, 0);

  const costPerPortion = recipe.portions ? totalCost / recipe.portions : 0;
  const kcalPerPortion = recipe.portions ? totalKcal / recipe.portions : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white border border-gray-200 shadow-lg rounded-xl p-5 hover:shadow-xl transition duration-300"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <FaClipboardList className="text-red-500" />
          {recipe.name}
        </h3>
        <div className="flex gap-2 text-gray-600">
          <button onClick={onEdit} className="hover:text-blue-600 transition" title="Edit">
            <FaEdit />
          </button>
          <button onClick={onDelete} className="hover:text-red-600 transition" title="Delete">
            <FaTrash />
          </button>
        </div>
      </div>

      {/* Metadata */}
      <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
        {recipe.type && (
          <div className="flex items-center gap-1">
            <FaTags className="text-purple-500" />
            Type: <strong>{recipe.type}</strong>
          </div>
        )}
        {recipe.category && (
          <div className="flex items-center gap-1">
            <FaUtensils className="text-teal-600" />
            Category: <strong>{recipe.category}</strong>
          </div>
        )}
        {recipe.portions && (
          <div className="flex items-center gap-1">
            <FaBalanceScale className="text-yellow-600" />
            Portions: <strong>{recipe.portions}</strong>
          </div>
        )}
        {recipe.yieldWeight && (
          <div className="flex items-center gap-1">
            <FaBalanceScale className="text-gray-500" />
            Yield: <strong>{recipe.yieldWeight} kg</strong>
          </div>
        )}
      </div>

      {/* Ingredients */}
      <ul className="mb-4 text-sm text-gray-700 space-y-1">
        {recipe.ingredients.map((item, idx) => (
          <li key={idx}>
            • {getIngredientName(item.ingredientId)} —{' '}
            <span className="font-medium">{item.quantity}</span> {getUnit(item.ingredientId)}
          </li>
        ))}
      </ul>

      {/* Recipe Summary */}
      <div className="grid grid-cols-2 gap-4 text-sm font-medium text-gray-600 border-t pt-3">
        <div className="flex flex-col gap-1">
          <span className="flex items-center gap-1">
            <FaFireAlt className="text-orange-500" />
            Total KCAL: <strong>{totalKcal.toFixed(2)}</strong>
          </span>
          <span className="flex items-center gap-1">
            <FaFireAlt className="text-orange-500" />
            Per Portion: <strong>{kcalPerPortion.toFixed(2)}</strong>
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="flex items-center gap-1">
            <FaDollarSign className="text-green-600" />
            Total Cost: <strong>${totalCost.toFixed(2)}</strong>
          </span>
          <span className="flex items-center gap-1">
            <FaDollarSign className="text-green-600" />
            Per Portion: <strong>${costPerPortion.toFixed(2)}</strong>
          </span>
        </div>
      </div>
    </motion.div>
  );
}
