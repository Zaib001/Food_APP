import React from 'react';
import {
  FaUtensils,
  FaMapMarkerAlt,
  FaDollarSign,
  FaFireAlt,
} from 'react-icons/fa';

export default function MenuCalendar({ menus = [], ingredientsMap = {} }) {
  const groupedByDate = menus.reduce((acc, menu) => {
    if (!acc[menu.date]) acc[menu.date] = [];
    acc[menu.date].push(menu);
    return acc;
  }, {});

  const getRecipeNames = (recipes = []) =>
    recipes.map(r => r.name || 'Unnamed').join(', ');

  const getTotalKcal = (recipes = []) => {
    return recipes.reduce((sum, recipe) => {
      const kcal = recipe.ingredients?.reduce((s, ing) => {
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
      const cost = recipe.ingredients?.reduce((s, ing) => {
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

  return (
    <div className="space-y-6">
      {Object.entries(groupedByDate)
        .sort(([a], [b]) => new Date(a) - new Date(b))
        .map(([date, menuEntries]) => (
          <div key={date} className="bg-white rounded-xl shadow p-4">
            <h2 className="text-lg font-bold text-gray-800 mb-3">{new Date(date).toDateString()}</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {menuEntries.map((menu, idx) => {
                const recipes = menu.recipeIds || [];
                const totalKcal = getTotalKcal(recipes);
                const totalCost = getTotalCost(recipes);

                return (
                  <div key={idx} className="border rounded-lg p-3">
                    <h3 className="text-md font-semibold capitalize mb-2 text-red-600">
                      {menu.mealType}
                    </h3>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li className="flex items-center gap-2">
                        <FaUtensils className="text-red-500" />
                        Recipes: {getRecipeNames(recipes)}
                      </li>
                      <li className="flex items-center gap-2">
                        <FaFireAlt className="text-orange-500" />
                        Total KCAL: <strong>{totalKcal.toFixed(2)}</strong>
                      </li>
                      <li className="flex items-center gap-2">
                        <FaDollarSign className="text-green-600" />
                        Total Cost: <strong>${totalCost.toFixed(2)}</strong>
                      </li>
                      <li className="flex items-center gap-2">
                        <FaMapMarkerAlt className="text-gray-500" />
                        Base: {menu.base}
                      </li>
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
    </div>
  );
}
