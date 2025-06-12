import React, { useState } from 'react';
import { FaPlus, FaUtensils } from 'react-icons/fa';

export default function RecipeForm({ ingredientsList, onSubmit }) {
  const [recipe, setRecipe] = useState({
    name: '',
    portions: '',
    yieldWeight: '',
    type: '',
    category: '',
    ingredients: [],
  });

  const handleChange = (e) => {
    setRecipe({ ...recipe, [e.target.name]: e.target.value });
  };

  const handleIngredientChange = (index, field, value) => {
    const updated = [...recipe.ingredients];
    updated[index][field] = value;
    setRecipe({ ...recipe, ingredients: updated });
  };

  const addIngredient = () => {
    setRecipe((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, { ingredientId: '', quantity: '' }],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!recipe.name || !recipe.portions || !recipe.yieldWeight || recipe.ingredients.length === 0) {
      alert('Please fill in all required fields and add at least one ingredient.');
      return;
    }

    onSubmit(recipe);
    setRecipe({
      name: '',
      portions: '',
      yieldWeight: '',
      type: '',
      category: '',
      ingredients: [],
    });
  };

  const totalCost = recipe.ingredients.reduce((sum, item) => {
    const ing = ingredientsList.find(i => i._id === item.ingredientId);
    if (!ing || !item.quantity) return sum;
    const quantity = parseFloat(item.quantity);
    const price = parseFloat(ing.pricePerKg);
    const yieldPercent = parseFloat(ing.yield);

    if (isNaN(quantity) || isNaN(price) || isNaN(yieldPercent) || yieldPercent === 0) return sum;

    const adjustedQty = quantity / (yieldPercent / 100);
    return sum + adjustedQty * price;

  }, 0);

  const totalKcal = recipe.ingredients.reduce((sum, item) => {
    const ing = ingredientsList.find(i => i._id === item.ingredientId);
    if (!ing || !item.quantity) return sum;

    const quantity = parseFloat(item.quantity);
    const kcal = parseFloat(ing.kcal);

    if (isNaN(quantity) || isNaN(kcal)) return sum;

    return sum + (quantity * kcal) / 1000;
  }, 0);



  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-xl p-6 border border-gray-100 mb-8">
      <div className="flex items-center gap-2 mb-6 text-red-600">
        <FaUtensils className="text-xl" />
        <h2 className="text-xl font-bold text-gray-800">Create New Recipe</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        <input
          name="name"
          value={recipe.name}
          onChange={handleChange}
          placeholder="Recipe Name"
          className="px-4 py-2 border border-gray-300 rounded-md w-full"
          required
        />
        <input
          name="portions"
          value={recipe.portions}
          onChange={handleChange}
          type="number"
          placeholder="Portions"
          className="px-4 py-2 border border-gray-300 rounded-md w-full"
          required
        />
        <input
          name="yieldWeight"
          value={recipe.yieldWeight}
          onChange={handleChange}
          type="number"
          placeholder="Yield Weight (kg)"
          className="px-4 py-2 border border-gray-300 rounded-md w-full"
          required
        />
        <input
          name="type"
          value={recipe.type}
          onChange={handleChange}
          placeholder="Recipe Type (e.g., Soup)"
          className="px-4 py-2 border border-gray-300 rounded-md w-full"
        />
        <input
          name="category"
          value={recipe.category}
          onChange={handleChange}
          placeholder="Category (e.g., Cold Kitchen)"
          className="px-4 py-2 border border-gray-300 rounded-md w-full"
        />
      </div>

      {recipe.ingredients.map((item, index) => (
        <div key={index} className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
          <select
            value={item.ingredientId}
            onChange={(e) => handleIngredientChange(index, 'ingredientId', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md"
            required
          >
            <option value="">Select Ingredient</option>
            {ingredientsList.map((ing) => (
              <option key={ing._id} value={ing._id}>
                {ing.name} ({ing.unit})
              </option>
            ))}
          </select>
          <input
            type="number"
            value={item.quantity}
            onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
            placeholder="Quantity"
            className="px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>
      ))}

      <button
        type="button"
        onClick={addIngredient}
        className="flex items-center gap-2 text-sm text-red-600 hover:text-red-800 mb-5"
      >
        <FaPlus /> Add Ingredient
      </button>

      <div className="mb-4 text-sm text-gray-700">
        <p>Total KCAL: <strong>{totalKcal.toFixed(2)}</strong></p>
        <p>Total Cost: <strong>${totalCost.toFixed(2)}</strong></p>
        {parseFloat(recipe.portions) > 0 && (
          <>
            <p>KCAL / Portion: <strong>{(totalKcal / parseFloat(recipe.portions)).toFixed(2)}</strong></p>
            <p>Cost / Portion: <strong>${(totalCost / parseFloat(recipe.portions)).toFixed(2)}</strong></p>
          </>
        )}

      </div>

      <div className="text-right">
        <button type="submit" className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700">
          Save Recipe
        </button>
      </div>
    </form>
  );
}
