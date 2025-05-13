import React, { useState } from 'react';
import { FaPlus, FaUtensils } from 'react-icons/fa';

export default function RecipeForm({ ingredientsList, onSubmit }) {
  const [recipeName, setRecipeName] = useState('');
  const [items, setItems] = useState([]);

  const handleIngredientChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const addIngredient = () => {
    setItems([...items, { ingredientId: '', quantity: '' }]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name: recipeName, ingredients: items });
    setRecipeName('');
    setItems([]);
  };

  const totalCost = items.reduce((sum, item) => {
    const ing = ingredientsList.find(i => i.id === item.ingredientId);
    if (!ing) return sum;
    const adjustedQty = item.quantity / (ing.yield / 100);
    return sum + adjustedQty * ing.price;
  }, 0);

  const totalKcal = items.reduce((sum, item) => {
    const ing = ingredientsList.find(i => i.id === item.ingredientId);
    if (!ing) return sum;
    return sum + (item.quantity * ing.kcal) / 1000;
  }, 0);

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-lg rounded-xl p-6 border border-gray-100 mb-8"
    >
      <div className="flex items-center gap-2 mb-6 text-red-600">
        <FaUtensils className="text-xl" />
        <h2 className="text-xl font-bold text-gray-800">Create New Recipe</h2>
      </div>

      <input
        type="text"
        value={recipeName}
        onChange={(e) => setRecipeName(e.target.value)}
        placeholder="Recipe Name"
        className="w-full mb-5 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-400 focus:outline-none"
      />

      {items.map((item, index) => (
        <div key={index} className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
          <select
            value={item.ingredientId}
            onChange={(e) =>
              handleIngredientChange(index, 'ingredientId', e.target.value)
            }
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-300 focus:outline-none"
          >
            <option value="">Select Ingredient</option>
            {ingredientsList.map((ing) => (
              <option key={ing.id} value={ing.id}>
                {ing.name} ({ing.unit})
              </option>
            ))}
          </select>

          <input
            type="number"
            value={item.quantity}
            onChange={(e) =>
              handleIngredientChange(index, 'quantity', e.target.value)
            }
            placeholder="Quantity"
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-300 focus:outline-none"
          />
        </div>
      ))}

      <button
        type="button"
        onClick={addIngredient}
        className="flex items-center gap-2 text-sm text-red-600 hover:text-red-800 transition mb-5"
      >
        <FaPlus /> Add Ingredient
      </button>

      <div className="mb-4 text-sm text-gray-700">
        <p>Total KCAL: <strong>{totalKcal.toFixed(2)}</strong></p>
        <p>Total Estimated Cost: <strong>${totalCost.toFixed(2)}</strong></p>
      </div>

      <div className="text-right">
        <button
          type="submit"
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md font-semibold transition"
        >
          Save Recipe
        </button>
      </div>
    </form>
  );
}
