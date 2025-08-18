import React, { useEffect, useMemo, useState } from 'react';
import { FaPlus, FaUtensils, FaImage, FaCalculator, FaLock, FaTrash } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const RECIPE_TYPES = [
  'Fruit', 'Protein', 'Side Dish', 'Salad',
  'Soup', 'Cold Drink', 'Hot Drink', 'Bakery',
  'Desserts', 'Base Recipes'
];

const inputVariants = {
  focus: {
    boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5)",
    transition: { duration: 0.2 }
  }
};

const ingredientItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      type: "spring",
      stiffness: 300,
      damping: 24
    }
  },
  exit: { opacity: 0, x: -20 }
};

export default function RecipeForm({
  ingredientsList,
  onSubmit,
  isEditing = false,
  initialRecipe = null,
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
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!recipe.name || !recipe.portions || !recipe.type || recipe.ingredients.length === 0) {
      alert('Please fill in all required fields and add at least one ingredient.');
      setIsSubmitting(false);
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

    try {
      await onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
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
    <motion.form 
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white shadow-xl rounded-lg p-6 border border-gray-100 mb-8 max-w-7xl mx-auto"
    >
      <div className="flex items-center gap-3 mb-8">
        <motion.div 
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 0.5 }}
          className="p-3 bg-red-100 rounded-full"
        >
          <FaUtensils className="text-xl text-red-600" />
        </motion.div>
        <h2 className="text-2xl font-bold text-gray-800">
          {isEditing ? 'Edit Recipe' : 'Create New Recipe'}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <motion.div whileFocus="focus">
          <label className="block text-sm font-medium text-gray-700 mb-1">Recipe Name</label>
          <motion.input
            name="name"
            value={recipe.name}
            onChange={handleChange}
            placeholder="e.g. Chicken Alfredo Pasta"
            className="px-4 py-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-red-500"
            required
            variants={inputVariants}
          />
        </motion.div>

        <motion.div whileFocus="focus">
          <label className="block text-sm font-medium text-gray-700 mb-1">Recipe Type</label>
          <motion.select
            name="type"
            value={recipe.type}
            onChange={handleChange}
            className="px-4 py-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-red-500"
            required
            variants={inputVariants}
          >
            <option value="">Select Recipe Type</option>
            {RECIPE_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </motion.select>
        </motion.div>

        <motion.div whileFocus="focus">
          <label className="block text-sm font-medium text-gray-700 mb-1">Portions</label>
          <div className="flex items-center gap-2">
            <motion.input
              name="portions"
              type="number"
              value={recipe.portions}
              onChange={handleChange}
              placeholder="Portions"
              className="px-4 py-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-red-500"
              required
              variants={inputVariants}
            />
            <span className="whitespace-nowrap text-sm text-gray-500">Base: {recipe.basePortions}</span>
          </div>
        </motion.div>

        <motion.div whileFocus="focus">
          <label className="block text-sm font-medium text-gray-700 mb-1">Total Weight (g)</label>
          <motion.input
            name="yieldWeight"
            type="number"
            value={Number(totalWeight).toFixed(2)}
            readOnly
            className="px-4 py-3 border border-gray-300 bg-gray-50 rounded-lg w-full"
            variants={inputVariants}
          />
        </motion.div>
      </div>

      {/* Scaling Controls */}
      <motion.div 
        className="grid grid-cols-3 gap-4 mb-8 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100"
        whileHover={{ scale: 1.005 }}
      >
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Scale Recipe For Client Count
          </label>
          <motion.input
            type="number"
            value={clientCount}
            onChange={(e) => setClientCount(e.target.value)}
            placeholder="Number of Clients"
            className="px-4 py-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            whileFocus={{ boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5)" }}
          />
        </div>
        <motion.button
          type="button"
          onClick={handleScale}
          className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 mt-7 transition-colors"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          <FaCalculator /> Scale
        </motion.button>
      </motion.div>

      {/* Ingredients */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Ingredients</h3>
          <motion.button
            type="button"
            onClick={addIngredient}
            className="flex items-center gap-2 text-sm bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={recipe.isLocked && isEditing}
          >
            <FaPlus /> Add Ingredient
          </motion.button>
        </div>

        <div className="space-y-4">
          <AnimatePresence>
            {recipe.ingredients.map((item, index) => (
              <motion.div
                key={index}
                variants={ingredientItemVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="grid grid-cols-2 md:grid-cols-5 gap-4 p-4 bg-white rounded-lg border border-gray-200 shadow-sm"
              >
                <motion.select
                  value={item.ingredientId}
                  onChange={(e) => handleIngredientChange(index, 'ingredientId', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                  disabled={recipe.isLocked && isEditing}
                  whileFocus={{ boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5)" }}
                >
                  <option value="">Select Ingredient</option>
                  {ingredientsList.map((ing) => (
                    <option key={ing._id} value={ing._id}>
                      {ing.name} ({ing.originalUnit})
                    </option>
                  ))}
                </motion.select>

                <motion.input
                  type="number"
                  step="0.01"
                  value={item.quantity}
                  onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
                  placeholder="Quantity"
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                  disabled={recipe.isLocked && isEditing}
                  whileFocus={{ boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5)" }}
                />

                <motion.input
                  type="number"
                  step="0.01"
                  value={item.baseQuantity || ''}
                  readOnly
                  placeholder="Base Qty (auto)"
                  className="px-3 py-2 border border-gray-300 bg-gray-50 rounded-md"
                />

                <span className="flex items-center text-sm text-gray-500">
                  {ingredientsList.find(i => i._id === item.ingredientId)?.originalUnit || ''}
                </span>

                <motion.button
                  type="button"
                  onClick={() => removeIngredient(index)}
                  className="flex items-center justify-center gap-1 text-red-600 hover:text-red-800 text-sm"
                  disabled={recipe.isLocked && isEditing}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaTrash size={14} /> Remove
                </motion.button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Recipe Summary */}
      <motion.div 
        className="mb-8 p-5 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border border-red-100"
        whileHover={{ scale: 1.005 }}
      >
        <h3 className="text-lg font-semibold mb-3">Recipe Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-sm flex justify-between">
              <span className="font-medium text-gray-700">Total Weight:</span>
              <span className="font-semibold">{Number(totalWeight).toFixed(2)}g</span>
            </p>
            <p className="text-sm flex justify-between">
              <span className="font-medium text-gray-700">Portions:</span>
              <span className="font-semibold">{recipe.portions}</span>
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm flex justify-between">
              <span className="font-medium text-gray-700">Total Cost:</span>
              <span className="font-semibold">${totalCost.toFixed(2)}</span>
            </p>
            <p className="text-sm flex justify-between">
              <span className="font-medium text-gray-700">Total KCAL:</span>
              <span className="font-semibold">{totalKcal.toFixed(2)}</span>
            </p>
          </div>
        </div>
      </motion.div>

      {/* Procedure */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">Procedure</label>
        <motion.textarea
          name="procedure"
          value={recipe.procedure}
          onChange={handleChange}
          placeholder="Describe the preparation steps in detail..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          rows={6}
          disabled={recipe.isLocked && isEditing}
          whileFocus={{ boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5)" }}
        />
      </div>

      {/* Image Upload */}
      <div className="mb-8">
        <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
          <FaImage className="text-blue-500" /> Dish Image
        </label>
        {recipe.imageUrl && (
          <motion.div 
            className="mb-3 overflow-hidden rounded-lg border border-gray-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <img
              src={`${import.meta.env.VITE_API_IMG_URL || ''}${recipe.imageUrl}`}
              alt="Dish"
              className="h-48 w-full object-cover"
            />
          </motion.div>
        )}
        <motion.label 
          className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer ${recipe.image ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-gray-400'}`}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <FaImage className="text-gray-400 text-2xl mb-2" />
          <p className="text-sm text-gray-600">
            {recipe.image ? recipe.image.name : 'Click to upload or drag and drop'}
          </p>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className="hidden"
            disabled={recipe.isLocked && isEditing}
          />
        </motion.label>
      </div>

      {/* Lock */}
      <div className="mb-8 flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <input
            type="checkbox"
            id="isLocked"
            name="isLocked"
            checked={recipe.isLocked}
            onChange={handleChange}
            className="h-5 w-5 text-red-600 rounded focus:ring-red-500"
          />
        </motion.div>
        <label htmlFor="isLocked" className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <FaLock className="text-gray-500" /> Lock this recipe (cannot be modified afterwards)
        </label>
      </div>

      <div className="text-right">
        <motion.button
          type="submit"
          className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-8 py-3 rounded-lg hover:from-red-700 hover:to-orange-700 font-medium shadow-md"
          whileHover={{ scale: 1.03, boxShadow: "0 4px 12px rgba(239, 68, 68, 0.3)" }}
          whileTap={{ scale: 0.98 }}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            isEditing ? 'Update Recipe' : 'Save Recipe'
          )}
        </motion.button>
      </div>
    </motion.form>
  );
}