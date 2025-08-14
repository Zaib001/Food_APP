import React, { useEffect, useMemo, useState } from 'react';
import { FaPlus, FaUtensils, FaImage, FaCalculator, FaLock } from 'react-icons/fa';

const RECIPE_TYPES = [
  'Fruit', 'Protein', 'Side Dish', 'Salad',
  'Soup', 'Cold Drink', 'Hot Drink', 'Bakery',
  'Desserts', 'Base Recipes'
];

export default function RecipeForm({
  ingredientsList,
  onSubmit,
  isEditing = false,
  initialRecipe = null, // provide when editing
}) {
  const [recipe, setRecipe] = useState({
    name: '',
    portions: 10,
    yieldWeight: 0,
    type: '',
    ingredients: [],
    procedure: '',
    image: null,
    imageUrl: null,
    isLocked: false,
    basePortions: 10,
  });

  // prefill if editing
  useEffect(() => {
    if (isEditing && initialRecipe) {
      setRecipe({
        name: initialRecipe.name || '',
        portions: Number(initialRecipe.portions || 10),
        yieldWeight: Number(initialRecipe.yieldWeight || 0),
        type: initialRecipe.type || '',
        ingredients: initialRecipe.ingredients?.map(i => ({
          ingredientId: i.ingredientId,
          quantity: Number(i.quantity) || 0,
          baseQuantity: Number(i.baseQuantity ?? i.quantity) || 0
        })) || [],
        procedure: initialRecipe.procedure || '',
        image: null,
        imageUrl: initialRecipe.imageUrl || null,
        isLocked: !!initialRecipe.isLocked,
        basePortions: Number(initialRecipe.basePortions || initialRecipe.portions || 10),
      });
      setClientCount(Number(initialRecipe.portions || 10));
    }
  }, [isEditing, initialRecipe]);

  const [clientCount, setClientCount] = useState(10);

  const totalWeight = useMemo(() => {
    return recipe.ingredients.reduce((sum, it) => sum + (parseFloat(it.quantity) || 0), 0);
  }, [recipe.ingredients]);

  const handleChange = (e) => {
    const { name, value, files, type, checked } = e.target;
    if (name === 'image') {
      setRecipe({ ...recipe, image: files[0] });
    } else if (type === 'checkbox') {
      setRecipe({ ...recipe, [name]: checked });
    } else {
      setRecipe({ ...recipe, [name]: value });
    }
  };

  const handleIngredientChange = (index, field, value) => {
    const updated = [...recipe.ingredients];
    updated[index][field] = field === 'ingredientId' ? value : Number(value);
    setRecipe(prev => ({
      ...prev,
      ingredients: updated,
      yieldWeight: updated.reduce((s, it) => s + (parseFloat(it.quantity) || 0), 0),
    }));
  };

  const addIngredient = () => {
    setRecipe(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, { ingredientId: '', quantity: 0, baseQuantity: 0 }]
    }));
  };

  const removeIngredient = (idx) => {
    setRecipe(prev => {
      const arr = prev.ingredients.filter((_, i) => i !== idx);
      return { ...prev, ingredients: arr };
    });
  };

  const handleScale = () => {
    const scaleFactor = (Number(clientCount) || 0) / (Number(recipe.portions) || 1);
    const scaledIngredients = recipe.ingredients.map(ing => ({
      ...ing,
      baseQuantity: ing.baseQuantity || Number(ing.quantity) || 0,
      quantity: Number(((ing.baseQuantity || Number(ing.quantity) || 0) * scaleFactor).toFixed(2)),
    }));
    setRecipe(prev => ({
      ...prev,
      ingredients: scaledIngredients,
      portions: Number(clientCount) || prev.portions,
      yieldWeight: Number((totalWeight * scaleFactor).toFixed(2)),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!recipe.name || !recipe.portions || !recipe.type || recipe.ingredients.length === 0) {
      alert('Please fill in all required fields and add at least one ingredient.');
      return;
    }

    // ensure baseQuantity stored
    const ingredientsWithBase = recipe.ingredients.map(ing => ({
      ...ing,
      baseQuantity: ing.baseQuantity || Number(ing.quantity) || 0
    }));

    const formData = new FormData();
    formData.append('name', recipe.name);
    formData.append('portions', recipe.portions);
    formData.append('yieldWeight', totalWeight);
    formData.append('type', recipe.type);
    formData.append('ingredients', JSON.stringify(ingredientsWithBase));
    formData.append('procedure', recipe.procedure);
    formData.append('isLocked', recipe.isLocked ? 'true' : 'false');
    if (recipe.image) formData.append('image', recipe.image);

    onSubmit(formData);
  };

  // cost & kcal
  const { totalCost, totalKcal } = recipe.ingredients.reduce((acc, item) => {
    const ing = ingredientsList.find(i => i._id === item.ingredientId);
    if (!ing) return acc;
    const quantity = parseFloat(item.quantity) || 0;
    const yieldPercent = parseFloat(ing.yield) || 100;
    const adjustedQty = quantity / (yieldPercent / 100);
    return {
      totalCost: acc.totalCost + (adjustedQty * (parseFloat(ing.pricePerKg) || 0)),
      totalKcal: acc.totalKcal + (quantity * (parseFloat(ing.kcal) || 0)) / 1000
    };
  }, { totalCost: 0, totalKcal: 0 });

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-xl p-6 border border-gray-100 mb-8">
      <div className="flex items-center gap-2 mb-6 text-red-600">
        <FaUtensils className="text-xl" />
        <h2 className="text-xl font-bold text-gray-800">
          {isEditing ? 'Edit Recipe' : 'Create New Recipe'}
        </h2>
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

        <select
          name="type"
          value={recipe.type}
          onChange={handleChange}
          className="px-4 py-2 border border-gray-300 rounded-md w-full"
          required
        >
          <option value="">Select Recipe Type</option>
          {RECIPE_TYPES.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>

        <div className="flex items-center gap-2">
          <input
            name="portions"
            type="number"
            value={recipe.portions}
            onChange={handleChange}
            placeholder="Portions"
            className="px-4 py-2 border border-gray-300 rounded-md w-full"
            required
          />
          <span className="whitespace-nowrap text-sm text-gray-500">Base: {recipe.basePortions}</span>
        </div>

        <input
          name="yieldWeight"
          type="number"
          value={Number(totalWeight).toFixed(2)}
          readOnly
          placeholder="Total Weight (auto)"
          className="px-4 py-2 border border-gray-300 bg-gray-100 rounded-md w-full"
        />
      </div>

      {/* Scaling Controls (preview within form while creating/editing) */}
      <div className="grid grid-cols-3 gap-4 mb-5 p-4 bg-blue-50 rounded-lg">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Scale Recipe For Client Count
          </label>
          <input
            type="number"
            value={clientCount}
            onChange={(e) => setClientCount(e.target.value)}
            placeholder="Number of Clients"
            className="px-4 py-2 border border-gray-300 rounded-md w-full"
          />
        </div>
        <button
          type="button"
          onClick={handleScale}
          className="flex items-center justify-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-6"
        >
          <FaCalculator /> Scale
        </button>
      </div>

      {/* Ingredients */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Ingredients</h3>
        {recipe.ingredients.map((item, index) => (
          <div key={index} className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-3">
            <select
              value={item.ingredientId}
              onChange={(e) => handleIngredientChange(index, 'ingredientId', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md"
              required
              disabled={recipe.isLocked && isEditing}
            >
              <option value="">Select Ingredient</option>
              {ingredientsList.map((ing) => (
                <option key={ing._id} value={ing._id}>
                  {ing.name} ({ing.originalUnit})
                </option>
              ))}
            </select>

            <input
              type="number"
              step="0.01"
              value={item.quantity}
              onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
              placeholder="Quantity"
              className="px-3 py-2 border border-gray-300 rounded-md"
              required
              disabled={recipe.isLocked && isEditing}
            />

            <input
              type="number"
              step="0.01"
              value={item.baseQuantity || ''}
              readOnly
              placeholder="Base Qty (auto)"
              className="px-3 py-2 border border-gray-300 bg-gray-100 rounded-md"
            />

            <span className="flex items-center text-sm text-gray-500">
              {ingredientsList.find(i => i._id === item.ingredientId)?.originalUnit || ''}
            </span>

            <button
              type="button"
              onClick={() => removeIngredient(index)}
              className="text-red-600 text-sm"
              disabled={recipe.isLocked && isEditing}
            >
              Remove
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={addIngredient}
          className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 mb-5"
          disabled={recipe.isLocked && isEditing}
        >
          <FaPlus /> Add Ingredient
        </button>
      </div>

      {/* Recipe Summary */}
      <div className="mb-4 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Recipe Summary</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm">
              <span className="font-medium">Total Weight:</span> {Number(totalWeight).toFixed(2)}g
            </p>
            <p className="text-sm">
              <span className="font-medium">Portions:</span> {recipe.portions}
            </p>
          </div>
          <div>
            <p className="text-sm">
              <span className="font-medium">Total Cost:</span> ${totalCost.toFixed(2)}
            </p>
            <p className="text-sm">
              <span className="font-medium">Total KCAL:</span> {totalKcal.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Procedure */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Procedure</label>
        <textarea
          name="procedure"
          value={recipe.procedure}
          onChange={handleChange}
          placeholder="Describe the preparation steps..."
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
          rows={4}
          disabled={recipe.isLocked && isEditing}
        />
      </div>

      {/* Image Upload */}
      <div className="mb-6">
        <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
          <FaImage /> Dish Image
        </label>
        {recipe.imageUrl && (
          <img
            src={`${import.meta.env.VITE_API_IMG_URL || ''}${recipe.imageUrl}`}
            alt="Dish"
            className="h-32 w-full object-cover rounded mb-2"
          />
        )}
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
          className="block text-sm text-gray-600"
          disabled={recipe.isLocked && isEditing}
        />
      </div>

      {/* Lock */}
      <div className="mb-6 flex items-center gap-2">
        <input
          type="checkbox"
          id="isLocked"
          name="isLocked"
          checked={recipe.isLocked}
          onChange={handleChange}
        />
        <label htmlFor="isLocked" className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <FaLock /> Lock this recipe (cannot be modified afterwards)
        </label>
      </div>

      <div className="text-right">
        <button
          type="submit"
          className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
        >
          {isEditing ? 'Update Recipe' : 'Save Recipe'}
        </button>
      </div>
    </form>
  );
}
