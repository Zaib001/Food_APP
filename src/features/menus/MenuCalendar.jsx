import React, { useState, useMemo } from 'react';
import {
  FaUtensils,
  FaMapMarkerAlt,
  FaDollarSign,
  FaFireAlt,
  FaTag,
  FaCalendarDay
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

export default function MenuCalendar({ menus = [], ingredientsMap = {} }) {
  const [openIdx, setOpenIdx] = useState(null); // index within the day list
  const [openDate, setOpenDate] = useState(null); // the date key for modal

  const groupedByDate = useMemo(() => {
    return menus.reduce((acc, menu) => {
      if (!acc[menu.date]) acc[menu.date] = [];
      acc[menu.date].push(menu);
      return acc;
    }, {});
  }, [menus]);

  const mealFrom = (m) => (m.mealType || m.meal || m.type || '').toLowerCase();
  const baseFrom = (m) => m.base || m.location || m.site || '—';

  const labelForMeal = (mealType) => {
    switch ((mealType || '').toLowerCase()) {
      case 'breakfast': return 'Breakfast';
      case 'lunch': return 'Lunch';
      case 'dinner': return 'Dinner';
      case 'snack': return 'Snack';
      case 'extra': return 'Extra';
      default: return mealType || '—';
    }
  };

  const getRecipeNames = (recipes = []) =>
    recipes.map(r => r?.name || 'Unnamed').join(', ');

  const getTotalKcal = (recipes = []) => {
    return recipes.reduce((sum, recipe) => {
      const kcal = recipe?.ingredients?.reduce((s, ing) => {
        const data = ingredientsMap[ing.ingredientId] || {};
        const kcal = parseFloat(data.kcal || 0);
        const qty = parseFloat(ing.quantity || 0);
        return s + ((qty * kcal) / 1000);
      }, 0) || 0;
      return sum + kcal;
    }, 0);
  };

  const getTotalCost = (recipes = []) => {
    return recipes.reduce((sum, recipe) => {
      const cost = recipe?.ingredients?.reduce((s, ing) => {
        const data = ingredientsMap[ing.ingredientId] || {};
        const price = parseFloat(data.pricePerKg || 0);
        const yieldPct = parseFloat(data.yield || 100);
        const qty = parseFloat(ing.quantity || 0);
        const adjustedQty = yieldPct === 0 ? 0 : qty / (yieldPct / 100);
        return s + adjustedQty * price;
      }, 0) || 0;
      return sum + cost;
    }, 0);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleOpen = (dateKey, idx) => {
    setOpenDate(dateKey);
    setOpenIdx(idx);
  };

  const handleClose = () => {
    setOpenDate(null);
    setOpenIdx(null);
  };

  const currentOpenMenu = openDate != null && openIdx != null
    ? (groupedByDate[openDate] || [])[openIdx]
    : null;

  return (
    <div className="space-y-6">
      <AnimatePresence>
        {Object.entries(groupedByDate)
          .sort(([a], [b]) => new Date(a) - new Date(b))
          .map(([date, menuEntries]) => (
            <motion.div
              key={date}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <div className="bg-gradient-to-r from-red-600 to-red-500 p-4 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FaCalendarDay className="text-xl" />
                    <h2 className="text-xl font-bold">
                      {formatDate(date)}
                    </h2>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {[...new Set(menuEntries.map(m => m.menuName))].map((mn, i) => (
                      <motion.span
                        key={i}
                        whileHover={{ scale: 1.05 }}
                        className="inline-flex items-center gap-1 text-xs bg-white bg-opacity-20 text-white px-3 py-1 rounded-full"
                      >
                        <FaTag size={10} /> {mn}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {menuEntries.map((menu, idx) => {
                  const recipes = Array.isArray(menu.recipeIds) ? menu.recipeIds : [];
                  const totalKcal = getTotalKcal(recipes);
                  const totalCost = getTotalCost(recipes);

                  return (
                    <motion.button
                      key={idx}
                      whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                      className="text-left border border-gray-100 rounded-lg p-4 hover:border-red-100 transition-all duration-200 focus:outline-none"
                      onClick={() => handleOpen(date, idx)}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-md font-semibold capitalize text-red-600">
                          {labelForMeal(mealFrom(menu))}
                        </h3>
                        <span className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded-full">
                          {recipes.length} {recipes.length === 1 ? 'recipe' : 'recipes'}
                        </span>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="mt-1 text-red-400">
                            <FaUtensils />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Recipes</p>
                            <p className="text-sm font-medium text-gray-700 line-clamp-2">
                              {getRecipeNames(recipes)}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div className="bg-gray-50 p-2 rounded-lg">
                            <div className="flex items-center gap-2 text-orange-500">
                              <FaFireAlt size={14} />
                              <span className="text-xs font-medium">Calories</span>
                            </div>
                            <p className="text-sm font-bold mt-1">
                              {totalKcal.toFixed(0)} kcal
                            </p>
                          </div>

                          <div className="bg-gray-50 p-2 rounded-lg">
                            <div className="flex items-center gap-2 text-green-600">
                              <FaDollarSign size={14} />
                              <span className="text-xs font-medium">Cost</span>
                            </div>
                            <p className="text-sm font-bold mt-1">
                              ${totalCost.toFixed(2)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 text-sm text-gray-600 border-t pt-2">
                          <div className="flex items-center gap-1">
                            <FaMapMarkerAlt size={12} className="text-gray-400" />
                            <span>{baseFrom(menu)}</span>
                          </div>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          ))}
      </AnimatePresence>

      {/* Empty state */}
      {menus.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="mx-auto max-w-md">
            <div className="text-gray-400 mb-4">
              <FaCalendarDay size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              No menus scheduled
            </h3>
            <p className="text-gray-500">
              Add menus to see them displayed in your calendar
            </p>
          </div>
        </motion.div>
      )}

      {/* Details Modal */}
      <AnimatePresence>
        {currentOpenMenu && (
          <motion.div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={handleClose}
          >
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white w-full max-w-2xl rounded-2xl p-6 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={handleClose}
                className="absolute right-4 top-4 text-gray-500 hover:text-black"
              >
                Close
              </button>

              <div className="mb-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FaCalendarDay />
                  <span className="font-medium">{formatDate(currentOpenMenu.date)}</span>
                  {currentOpenMenu.menuName && (
                    <span className="inline-flex items-center gap-1 text-xs bg-red-50 text-red-700 px-2 py-1 rounded ml-2">
                      <FaTag /> {currentOpenMenu.menuName}
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-semibold mt-2">
                  {labelForMeal(mealFrom(currentOpenMenu))} — {baseFrom(currentOpenMenu)}
                </h3>
              </div>

              {/* Recipes list */}
              <div className="max-h-[60vh] overflow-y-auto space-y-2">
                {(currentOpenMenu.recipeIds || []).map((r, i) => (
                  <div key={r?._id || i} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{r?.name || 'Unnamed'}</div>
                      {r?.type && (
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {r.type}
                        </span>
                      )}
                    </div>
                    <div className="mt-2 text-sm text-gray-600 grid grid-cols-2 gap-2">
                      <div>Portions: <span className="font-medium">{r?.portions ?? '—'}</span></div>
                      <div>Yield: <span className="font-medium">{(r?.yieldWeight ?? 0).toFixed ? r.yieldWeight.toFixed(2) : r?.yieldWeight || '—'} g</span></div>
                    </div>
                    {r?.ingredients?.length ? (
                      <div className="mt-2 text-xs text-gray-600">
                        <span className="font-medium">Ingredients:</span>{' '}
                        {r.ingredients.map((ing, idx) => {
                          const meta = ingredientsMap[ing.ingredientId] || {};
                          return (
                            <span key={idx}>
                              {meta.name || 'Item'} {Number(ing.quantity || 0).toFixed(2)} {meta.originalUnit || ''}
                              {idx < r.ingredients.length - 1 ? ', ' : ''}
                            </span>
                          );
                        })}
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
