import React, { useMemo } from 'react';
import { FaTruck } from 'react-icons/fa';
import { useMenus } from '../../contexts/MenuContext';
import { useRecipes } from '../../contexts/RecipeContext';
import { useIngredients } from '../../contexts/IngredientContext';

const unitConversions = {
  kg: 1,
  g: 0.001,
  lb: 0.453592,
  oz: 0.0283495,
  pcs: 1,
  lt: 1,
  ml: 0.001,
  jug: 1.89,
};

export default function GeneratedRequisitionTable() {
  const { menus } = useMenus();
  const { getIngredientsForRecipe } = useRecipes();
  const { ingredients } = useIngredients();

  // Create a map of ingredientId -> metadata (unit, name)
  const ingredientsMap = useMemo(() => {
    return Object.fromEntries(ingredients.map(i => [i.id, i]));
  }, [ingredients]);

  // Aggregate requisitions from all menu-linked recipes
  const requisitions = useMemo(() => {
    const aggregated = {};

    menus.forEach((menu) => {
      const allRecipeIds = [
        ...(menu.proteins || []),
        ...(menu.sides || []),
        ...(menu.breads || []),
        ...(menu.beverages || []),
      ];

      allRecipeIds.forEach((recipeId) => {
        const recipeIngredients = getIngredientsForRecipe(recipeId);
        recipeIngredients.forEach(({ ingredientId, quantity }) => {
          const key = `${menu.date}-${menu.base}-${ingredientId}`;
          const ing = ingredientsMap[ingredientId];
          if (!ing) return;

          const conversion = unitConversions[ing.unit] || 1;
          const qtyInKg = quantity / (ing.yield / 100) * conversion;

          if (!aggregated[key]) {
            aggregated[key] = {
              date: menu.date,
              base: menu.base,
              item: ing.name,
              unit: 'kg',
              quantity: 0,
              status: 'pending',
            };
          }

          aggregated[key].quantity += qtyInKg;
        });
      });
    });

    return Object.values(aggregated).map(item => ({
      ...item,
      quantity: item.quantity.toFixed(2),
    }));
  }, [menus, ingredientsMap, getIngredientsForRecipe]);

  if (requisitions.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-6 text-sm">
        No requisitions generated from menus yet.
      </div>
    );
  }

  return (
    <div className="mt-10 bg-white shadow-lg rounded-xl p-6 border border-gray-100">
      <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-800">
        <FaTruck className="text-red-600" /> Menu-Based Requisitions
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border border-gray-200 items-center">
          <thead className="bg-gray-100 text-gray-700 font-medium">
            <tr>
              <th className="p-3 border-b">Date</th>
              <th className="p-3 border-b">Item</th>
              <th className="p-3 border-b">Unit</th>
              <th className="p-3 border-b">Quantity</th>
              <th className="p-3 border-b">Base</th>
              <th className="p-3 border-b">Status</th>
            </tr>
          </thead>
          <tbody>
            {requisitions.map((req, idx) => (
              <tr
                key={idx}
                className={`transition-all ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-red-50`}
              >
                <td className="p-3 border-b">{req.date}</td>
                <td className="p-3 border-b">{req.item}</td>
                <td className="p-3 border-b">{req.unit}</td>
                <td className="p-3 border-b">{req.quantity}</td>
                <td className="p-3 border-b">{req.base}</td>
                <td className="p-3 border-b text-red-600 font-medium">{req.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
