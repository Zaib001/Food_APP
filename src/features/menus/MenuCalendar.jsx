import React from 'react';
import {
  FaUtensils,
  FaMapMarkerAlt,
  FaDollarSign,
  FaFireAlt,
} from 'react-icons/fa';

export default function MenuCalendar({ menus = [], recipesMap = {} }) {
  const groupedByDate = menus.reduce((acc, menu) => {
    if (!acc[menu.date]) acc[menu.date] = [];
    acc[menu.date].push(menu);
    return acc;
  }, {});

  const getRecipeNames = (ids = []) =>
    ids.map(id => recipesMap[id]?.name || id).join(', ');

  const getTotalKcal = (ids = []) => {
    return ids.reduce((sum, id) => {
      const recipe = recipesMap[id];
      if (!recipe || !recipe.ingredients) return sum;

      const recipeKcal = recipe.ingredients.reduce((kcal, item) => {
        const ing = item && item.ingredientId ? item : null;
        const kcalVal = ing ? recipesMap[recipe.id]?.ingredientsMap?.[ing.ingredientId]?.kcal : 0;
        return kcal + ((item.quantity * (kcalVal || 0)) / 1000);
      }, 0);

      return sum + recipeKcal;
    }, 0);
  };

  const getTotalCost = (ids = []) => {
    return ids.reduce((sum, id) => {
      const recipe = recipesMap[id];
      if (!recipe || !recipe.ingredients) return sum;

      const recipeCost = recipe.ingredients.reduce((cost, item) => {
        const ingMap = recipesMap[recipe.id]?.ingredientsMap;
        const price = ingMap?.[item.ingredientId]?.price || 0;
        const yieldPercent = ingMap?.[item.ingredientId]?.yield || 100;
        const adjustedQty = item.quantity / (yieldPercent / 100);
        return cost + adjustedQty * price;
      }, 0);

      return sum + recipeCost;
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
                const ids = menu[menu.mealType] || [];
                const totalKcal = getTotalKcal(ids);
                const totalCost = getTotalCost(ids);

                return (
                  <div key={idx} className="border rounded-lg p-3">
                    <h3 className="text-md font-semibold capitalize mb-2 text-red-600">
                      {menu.mealType}
                    </h3>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li className="flex items-center gap-2">
                        <FaUtensils className="text-red-500" />
                        Recipes: {getRecipeNames(ids)}
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
