import React, { useMemo } from 'react';
import { FaListUl } from 'react-icons/fa';

export default function RequisitionGenerator({ menus = [], recipes = [], ingredientsMap = {} }) {
  const recipeMap = useMemo(() => Object.fromEntries(recipes.map(r => [r.name, r])), [recipes]);

  const aggregate = {};

  menus.forEach(menu => {
    const allRecipeNames = [
      ...(menu.proteins || []),
      ...(menu.sides || []),
      ...(menu.breads || []),
      ...(menu.beverages || []),
    ];

    allRecipeNames.forEach(recipeId => {
      const recipe = recipes.find(r => r.id === recipeId);
      if (!recipe) return;

      const portions = Number(menu.portions || 1);

      recipe.ingredients.forEach(item => {
        const ing = ingredientsMap[item.ingredientId];
        if (!ing) return;

        const qty = (item.quantity * portions) / (ing.yield / 100);
        if (!aggregate[item.ingredientId]) {
          aggregate[item.ingredientId] = {
            name: ing.name,
            unit: ing.unit,
            total: 0,
          };
        }
        aggregate[item.ingredientId].total += qty;
      });
    });
  });

  const aggregatedList = Object.entries(aggregate).map(([id, item]) => ({
    id,
    name: item.name,
    unit: item.unit,
    total: item.total.toFixed(2),
  }));

  return (
    <div className="bg-white shadow p-4 rounded-xl border border-gray-100 mt-6">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-700">
        <FaListUl className="text-red-500" /> Auto-Generated Requisition Summary
      </h2>

      {aggregatedList.length === 0 ? (
        <p className="text-gray-500 text-sm">No linked recipes or menus to calculate requisition.</p>
      ) : (
        <table className="w-full text-sm border border-gray-200">
          <thead className="bg-gray-100 text-gray-700 font-medium">
            <tr>
              <th className="p-2 text-left">Ingredient</th>
              <th className="p-2 text-left">Unit</th>
              <th className="p-2 text-right">Total Qty</th>
            </tr>
          </thead>
          <tbody>
            {aggregatedList.map((item, i) => (
              <tr key={i} className="border-t hover:bg-gray-50">
                <td className="p-2">{item.name}</td>
                <td className="p-2">{item.unit}</td>
                <td className="p-2 text-right">{item.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}