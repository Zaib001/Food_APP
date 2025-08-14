import React, { useState, useEffect } from 'react';
import RecipeForm from '../features/recipes/RecipeForm';
import RecipeCard from '../features/recipes/RecipeCard';
import { exportRecipesToCSV, exportRecipesToPDF } from '../components/exportRecipesToPDF';
import { FaFileCsv, FaFilePdf } from 'react-icons/fa';
import { useRecipes } from '../contexts/RecipeContext';
import { getAllIngredients } from '../api/ingredientApi';

const RECIPE_TYPES = [
  'All', 'Fruit', 'Protein', 'Side Dish', 'Salad',
  'Soup', 'Cold Drink', 'Hot Drink', 'Bakery',
  'Desserts', 'Base Recipes'
];

export default function Recipes() {
  const {
    recipes,
    addRecipe,
    updateRecipeAtIndex,
    deleteRecipeAtIndex,
    quickScaleRecipeAtIndex
  } = useRecipes();

  const [ingredients, setIngredients] = useState([]);
  const [loadingIngredients, setLoadingIngredients] = useState(true);

  const [filterType, setFilterType] = useState('All');

  const [editIndex, setEditIndex] = useState(null); // if not null, we're editing
  const [viewIndex, setViewIndex] = useState(null); // single recipe viewer
  const [scaledPreview, setScaledPreview] = useState(null); // store quick scale preview

  useEffect(() => { fetchIngredients(); }, []);
  const fetchIngredients = async () => {
    try {
      const res = await getAllIngredients();
      setIngredients(res.data);
    } catch (err) {
      console.error('Error fetching ingredients:', err);
    } finally {
      setLoadingIngredients(false);
    }
  };

  const ingredientsMap = Object.fromEntries(ingredients.map((i) => [i._id, i]));

  const handleAddRecipe = (newRecipeFormData) => addRecipe(newRecipeFormData);

  const handleUpdateRecipe = (formData) => {
    updateRecipeAtIndex(editIndex, formData);
    setEditIndex(null);
  };

  const handleDelete = (index) => deleteRecipeAtIndex(index);

  const handleQuickScale = async (index, clientCount) => {
    const preview = await quickScaleRecipeAtIndex(index, clientCount);
    setScaledPreview(preview);
    setViewIndex(index);
  };

  const handleApplyScaleAndSave = async (index, clientCount) => {
    // reuse update endpoint with clientCount to save scaled values
    const formData = new FormData();
    formData.append('name', recipes[index].name);
    formData.append('portions', recipes[index].portions);
    formData.append('yieldWeight', recipes[index].yieldWeight);
    formData.append('type', recipes[index].type);
    formData.append('ingredients', JSON.stringify(recipes[index].ingredients));
    formData.append('procedure', recipes[index].procedure || '');
    formData.append('isLocked', recipes[index].isLocked ? 'true' : 'false');
    formData.append('clientCount', clientCount);
    await updateRecipeAtIndex(index, formData);
  };

  const list = recipes.filter(r => filterType === 'All' ? true : r.type === filterType);

  if (loadingIngredients) return <div className="p-6">Loading ingredients...</div>;

  return (
    <div className="p-6">
      {/* Export + Type Filter */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
        <div className="flex gap-3">
          <button
            onClick={() => exportRecipesToCSV(recipes, ingredientsMap)}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            <FaFileCsv className="text-lg" />
            Export to CSV
          </button>
          <button
            onClick={() => exportRecipesToPDF(recipes, ingredientsMap)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            <FaFilePdf className="text-lg" />
            Export to PDF
          </button>
        </div>

        <div className="ml-auto">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border rounded"
          >
            {RECIPE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      {/* Create or Edit Form */}
      {editIndex === null ? (
        <RecipeForm ingredientsList={ingredients} onSubmit={handleAddRecipe} />
      ) : (
        <RecipeForm
          ingredientsList={ingredients}
          onSubmit={handleUpdateRecipe}
          isEditing
          initialRecipe={recipes[editIndex]}
        />
      )}

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {list.map((recipe, index) => (
          <RecipeCard
            key={recipe._id || index}
            recipe={recipe}
            ingredientsMap={ingredientsMap}
            onEdit={() => setEditIndex(index)}
            onDelete={() => handleDelete(index)}
            onView={() => setViewIndex(index)}
            onQuickScale={(count) => handleQuickScale(index, count)}
            onApplyScale={(count) => handleApplyScaleAndSave(index, count)}
          />
        ))}
      </div>

      {/* Simple View Modal */}
      {viewIndex !== null && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-2xl rounded-xl p-6 relative">
            <button
              onClick={() => { setViewIndex(null); setScaledPreview(null); }}
              className="absolute right-4 top-4 text-gray-500 hover:text-black"
            >
              Close
            </button>
            <h3 className="text-xl font-semibold mb-3">
              {recipes[viewIndex].name} — Details
            </h3>

            {/* If scaledPreview exists, show that; otherwise show current */}
            <div className="space-y-2 max-h-[60vh] overflow-y-auto">
              {(scaledPreview || recipes[viewIndex]).ingredients.map((it, i) => (
                <div key={i} className="flex justify-between text-sm border-b py-1">
                  <span>
                    {ingredientsMap[it.ingredientId]?.name || 'Unknown'}
                  </span>
                  <span>
                    {Number(it.quantity).toFixed(2)} {ingredientsMap[it.ingredientId]?.originalUnit || ''}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 text-sm text-gray-600">
              Portions: <strong>{(scaledPreview || recipes[viewIndex]).portions}</strong> &nbsp;|&nbsp;
              Weight: <strong>{Number((scaledPreview || recipes[viewIndex]).yieldWeight || 0).toFixed(2)} g</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
