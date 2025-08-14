import React, { useState } from 'react';
import {
  FaEdit,
  FaTrash,
  FaFireAlt,
  FaDollarSign,
  FaClipboardList,
  FaBalanceScale,
  FaTags,
  FaLock
} from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function RecipeCard({
  recipe,
  ingredientsMap,
  onEdit,
  onDelete,
  onQuickScale, // (clientCount) => void
  onApplyScale, // (clientCount) => void (saves)
  onView // open modal with single recipe details
}) {
  const [clientCount, setClientCount] = useState(recipe.portions || 10);

  const getIngredientName = (id) => ingredientsMap[id]?.name || 'Unknown';
  const getUnit = (id) => ingredientsMap[id]?.originalUnit || '';

  const totalCost = recipe.ingredients.reduce((sum, item) => {
    const ing = ingredientsMap[item.ingredientId];
    if (!ing) return sum;
    const yieldPercent = parseFloat(ing.yield) || 100;
    const adjustedQty = (parseFloat(item.quantity) || 0) / (yieldPercent / 100);
    return sum + (adjustedQty * (parseFloat(ing.pricePerKg) || 0));
  }, 0);

  const totalKcal = recipe.ingredients.reduce((sum, item) => {
    const ing = ingredientsMap[item.ingredientId];
    return sum + (((parseFloat(item.quantity) || 0) * (parseFloat(ing?.kcal) || 0)) / 1000);
  }, 0);

  const costPerPortion = recipe.portions ? totalCost / recipe.portions : 0;
  const kcalPerPortion = recipe.portions ? totalKcal / recipe.portions : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`bg-white border rounded-xl p-5 hover:shadow-md transition ${recipe.isLocked ? 'border-blue-200 bg-blue-50' : 'border-gray-200'}`}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <FaClipboardList className="text-red-500" />
            {recipe.name}
          </h3>
          {recipe.isLocked && (
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full flex items-center gap-1">
              <FaLock size={12} /> Locked
            </span>
          )}
        </div>

        <div className="flex gap-3 text-gray-600">
          <button onClick={onView} className="hover:text-gray-900 transition" title="View">
            View
          </button>
          <button
            onClick={onEdit}
            disabled={recipe.isLocked}
            className={`hover:text-blue-600 transition ${recipe.isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
            title={recipe.isLocked ? 'Recipe is locked' : 'Edit'}
          >
            <FaEdit />
          </button>
          <button
            onClick={onDelete}
            className="hover:text-red-600 transition"
            title="Delete"
          >
            <FaTrash />
          </button>
        </div>
      </div>

      {/* Metadata */}
      <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
        <div className="flex items-center gap-1">
          <FaTags className="text-purple-500" />
          Type: <strong>{recipe.type}</strong>
        </div>
        <div className="flex items-center gap-1">
          <FaBalanceScale className="text-yellow-600" />
          Portions: <strong>{recipe.portions}</strong>
        </div>
        <div className="flex items-center gap-1">
          <FaBalanceScale className="text-gray-500" />
          Weight: <strong>{Number(recipe.yieldWeight || 0).toFixed(2)} g</strong>
        </div>
      </div>

      {/* Image (always show if exists) */}
      {recipe.imageUrl && (
        <div className="flex justify-center mb-3">
          <img
            src={`${import.meta.env.VITE_API_IMG_URL || ''}${recipe.imageUrl}`}
            alt="Dish"
            className="h-40 w-full object-cover rounded"
          />
        </div>
      )}

      {/* Ingredients */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-1">Ingredients:</h4>
        <ul className="text-sm text-gray-700 space-y-1 max-h-40 overflow-y-auto">
          {recipe.ingredients.map((item, idx) => (
            <li key={idx} className="flex justify-between">
              <span>• {getIngredientName(item.ingredientId)}</span>
              <span>{Number(item.quantity).toFixed(2)} {getUnit(item.ingredientId)}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Nutrition & Cost */}
      <div className="grid grid-cols-2 gap-4 text-sm font-medium text-gray-600 border-t pt-3">
        <div className="flex flex-col gap-1">
          <span className="flex items-center gap-1">
            <FaFireAlt className="text-orange-500" />
            KCAL: <strong>{totalKcal.toFixed(2)}</strong>
          </span>
          <span className="flex items-center gap-1">
            <FaFireAlt className="text-orange-500" />
            Per Portion: <strong>{kcalPerPortion.toFixed(2)}</strong>
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="flex items-center gap-1">
            <FaDollarSign className="text-green-600" />
            Cost: <strong>${totalCost.toFixed(2)}</strong>
          </span>
          <span className="flex items-center gap-1">
            <FaDollarSign className="text-green-600" />
            Per Portion: <strong>${costPerPortion.toFixed(2)}</strong>
          </span>
        </div>
      </div>

      {/* Quick Scale */}
      <div className="mt-4 grid grid-cols-3 gap-2">
        <input
          type="number"
          className="px-3 py-2 border rounded col-span-2"
          value={clientCount}
          onChange={(e) => setClientCount(Number(e.target.value))}
          placeholder="Clients (e.g., 55)"
        />
        <button
          onClick={() => onQuickScale?.(clientCount)}
          className="bg-gray-100 border rounded hover:bg-gray-200 text-sm"
          title="Preview scaled (no save)"
        >
          Preview
        </button>
        <button
          onClick={() => onApplyScale?.(clientCount)}
          className="bg-blue-600 text-white rounded py-2 col-span-2 hover:bg-blue-700 text-sm"
          title="Apply scale & save"
          disabled={recipe.isLocked}
        >
          Apply & Save
        </button>
      </div>
    </motion.div>
  );
}
