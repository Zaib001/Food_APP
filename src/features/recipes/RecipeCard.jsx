// src/features/recipes/RecipeCard.jsx
import React, { useState, useMemo } from 'react';
import {
  FaEdit,
  FaTrash,
  FaFireAlt,
  FaDollarSign,
  FaClipboardList,
  FaBalanceScale,
  FaTags,
  FaLock,
  FaUnlock,
  FaEye
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://food-backend-qsbp.onrender.com/api';
const headers = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` });

export default function RecipeCard({
  recipe,
  ingredientsMap = {},
  onEdit,
  onDelete,
  onQuickScale,   // (clientCount) => void (preview)
  onApplyScale,   // (clientCount) => void (save)
  onView,         // () => void
  onRefresh       // optional: reload list after lock/unlock
}) {
  const [clientCount, setClientCount] = useState(recipe.portions || 10);

  // role from localStorage (server still enforces)
  const currentUser = useMemo(() => {
    try { return JSON.parse(localStorage.getItem('user') || '{}'); } catch { return {}; }
  }, []);
  const isAdmin = currentUser?.role === 'admin';

  const getIngredientName = (id) => ingredientsMap[id]?.name || 'Unknown';
  const getUnit = (id) => ingredientsMap[id]?.originalUnit || '';

  const totalCost = recipe.ingredients.reduce((sum, item) => {
    const ing = ingredientsMap[item.ingredientId];
    if (!ing) return sum;
    const yieldPercent = parseFloat(ing.yield) || 100;
    const adjustedQty = (parseFloat(item.quantity) || 0) / (yieldPercent / 100);
    return sum + adjustedQty * (parseFloat(ing.pricePerKg) || 0);
  }, 0);

  const totalKcal = recipe.ingredients.reduce((sum, item) => {
    const ing = ingredientsMap[item.ingredientId];
    return sum + (((parseFloat(item.quantity) || 0) * (parseFloat(ing?.kcal) || 0)) / 1000);
  }, 0);

  const costPerPortion = recipe.portions ? totalCost / recipe.portions : 0;
  const kcalPerPortion = recipe.portions ? totalKcal / recipe.portions : 0;

  const handleToggleLock = async () => {
    try {
      const target = !recipe.isLocked;
      await axios.put(
        `${API_BASE}/recipes/${recipe._id}`,
        { isLocked: target },
        { headers: headers() }
      );
      toast.success(target ? 'Recipe locked' : 'Recipe unlocked');
      onRefresh?.();
    } catch (e) {
      const msg = e?.response?.data?.message || 'Lock toggle failed';
      toast.error(msg);
      console.error(e);
    }
  };

  // Animations
  const cardVariants = {
    hidden: { opacity: 0, y: 18 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.28 } },
    hover: { y: -4, transition: { duration: 0.18 } }
  };

  const headerActionClass =
    'inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm border transition';

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className={`group overflow-hidden rounded-2xl border shadow-sm bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 ${
        recipe.isLocked ? 'border-blue-200' : 'border-gray-100'
      }`}
    >
      {/* Hero / Image */}
      <div className="relative h-44 w-full overflow-hidden">
        <img
          src={`${import.meta.env.VITE_API_IMG_URL || ''}${recipe.imageUrl || ''}`}
          alt={recipe.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

        {/* Title & Tags over image */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-2 text-white text-base font-semibold drop-shadow">
              <FaClipboardList className="text-red-400" />
              {recipe.name}
            </span>
           
          </div>

          <div className="flex items-center">  
           {recipe.isLocked && (
              <span className="text-[10px] uppercase tracking-wide bg-blue-600/90 text-white px-2 py-1 rounded-full inline-flex items-center gap-1">
                <FaLock size={10} /> Locked
              </span>
            )}         
            {/* Lock/Unlock (admin only) */}
            {isAdmin && (
              <button
                onClick={handleToggleLock}
                title={recipe.isLocked ? 'Unlock (admin)' : 'Lock (admin)'}
                className={`rounded-full border px-2.5 py-1 text-white/90 hover:text-white backdrop-blur-md ${
                  recipe.isLocked ? 'bg-blue-500/30 border-white/30' : 'bg-gray-500/30 border-white/30'
                }`}
              >
                {recipe.isLocked ? <FaUnlock /> : <FaLock />}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-5">
        {/* Meta chips */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-100">
            <FaTags className="text-purple-500" /> {recipe.type}
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded-full bg-yellow-50 text-yellow-700 border border-yellow-100">
            <FaBalanceScale className="text-yellow-600" /> Portions: {recipe.portions}
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded-full bg-gray-50 text-gray-700 border border-gray-200">
            <FaBalanceScale className="text-gray-600" /> Weight: {Number(recipe.yieldWeight || 0).toFixed(2)} g
          </span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="rounded-xl border p-3 bg-gradient-to-br from-orange-50 to-white">
            <div className="text-[11px] text-orange-700/80 font-medium flex items-center gap-1">
              <FaFireAlt className="text-orange-500" /> Calories
            </div>
            <div className="mt-1.5 text-gray-800 font-semibold">{totalKcal.toFixed(2)} kcal</div>
            <div className="text-[12px] text-gray-500">Per Portion: {kcalPerPortion.toFixed(2)}</div>
          </div>

          <div className="rounded-xl border p-3 bg-gradient-to-br from-green-50 to-white">
            <div className="text-[11px] text-green-700/80 font-medium flex items-center gap-1">
              <FaDollarSign className="text-green-600" /> Cost
            </div>
            <div className="mt-1.5 text-gray-800 font-semibold">${totalCost.toFixed(2)}</div>
            <div className="text-[12px] text-gray-500">Per Portion: ${costPerPortion.toFixed(2)}</div>
          </div>
        </div>

        {/* Ingredients */}
        <div className="rounded-xl border p-3 mb-4">
          <div className="text-sm font-medium text-gray-700 mb-2">Ingredients</div>
          <ul className="text-sm text-gray-700 space-y-1.5 max-h-40 overflow-y-auto pr-1">
            {recipe.ingredients.map((item, idx) => (
              <li
                key={idx}
                className="flex items-center justify-between gap-2 border-b last:border-b-0 pb-1.5"
              >
                <span className="truncate">
                  • {getIngredientName(item.ingredientId)}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 border border-gray-200 whitespace-nowrap">
                  {Number(item.quantity).toFixed(2)} {getUnit(item.ingredientId)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-3 gap-2">
          <div className="col-span-3 md:col-span-2 flex items-center gap-2">
            <input
              type="number"
              className="px-3 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-red-200"
              value={clientCount}
              onChange={(e) => setClientCount(Number(e.target.value))}
              placeholder="Clients (e.g., 55)"
            />
            <button
              onClick={() => onQuickScale?.(clientCount)}
              className="px-3 py-2 rounded-lg border hover:bg-gray-50 text-sm"
              title="Preview scaled (no save)"
            >
              Preview
            </button>
          </div>

          <button
            onClick={() => onApplyScale?.(clientCount)}
            className={`px-3 py-2 rounded-lg text-white text-sm ${
              recipe.isLocked && !isAdmin
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-red-600 hover:bg-red-700'
            }`}
            title="Apply scale & save"
            disabled={recipe.isLocked && !isAdmin}
          >
            Apply & Save
          </button>
        </div>

        {/* Bottom Command Bar */}
        <div className="mt-4 flex items-center justify-between border-t pt-3">
          <div className="text-[12px] text-gray-500">
            Base portions: <span className="font-medium">{recipe.basePortions || recipe.portions}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onEdit}
              disabled={recipe.isLocked && !isAdmin}
              className={`${headerActionClass} ${
                recipe.isLocked && !isAdmin
                  ? 'text-gray-300 border-gray-200 cursor-not-allowed'
                  : 'text-blue-700 border-blue-200 hover:bg-blue-50'
              }`}
              title={recipe.isLocked && !isAdmin ? 'Recipe is locked' : 'Edit'}
            >
              <FaEdit /> Edit
            </button>

            <button
              onClick={onDelete}
              className={`${headerActionClass} text-red-700 border-red-200 hover:bg-red-50`}
              title="Delete"
            >
              <FaTrash /> Delete
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
