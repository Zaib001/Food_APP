import React, { useState, useEffect } from 'react';
import RecipeForm from '../features/recipes/RecipeForm';
import RecipeCard from '../features/recipes/RecipeCard';
import EditModal from '../components/EditModal';
import { exportRecipesToCSV, exportRecipesToPDF } from '../components/exportRecipesToPDF';
import { FaFileCsv, FaFilePdf } from 'react-icons/fa';
import { useRecipes } from '../contexts/RecipeContext';
import { getAllIngredients } from '../api/ingredientApi';

export default function Recipes() {
  const {
    recipes,
    addRecipe,
    updateRecipeNameAtIndex,
    deleteRecipeAtIndex
  } = useRecipes();

  const [editIndex, setEditIndex] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [ingredients, setIngredients] = useState([]);
  const [loadingIngredients, setLoadingIngredients] = useState(true);

  useEffect(() => {
    fetchIngredients();
  }, []);

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

  const ingredientsMap = Object.fromEntries(
    ingredients.map((i) => [i._id, i])
  );

  const handleAddRecipe = (newRecipe) => addRecipe(newRecipe);
  const handleUpdateRecipeName = (updated) => updateRecipeNameAtIndex(editIndex, updated);
  const handleDelete = (index) => deleteRecipeAtIndex(index);

  if (loadingIngredients) return <div className="p-6">Loading ingredients...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-end gap-3 mb-4">
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

      <RecipeForm ingredientsList={ingredients} onSubmit={handleAddRecipe} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((recipe, index) => (
          <RecipeCard
            key={index}
            recipe={recipe}
            ingredientsMap={ingredientsMap}
            onEdit={() => {
              setEditIndex(index);
              setEditModalOpen(true);
            }}
            onDelete={() => handleDelete(index)}
          />
        ))}
      </div>

      <EditModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSave={handleUpdateRecipeName}
        title="Edit Recipe"
        initialValues={{ name: recipes[editIndex]?.name || '' }}
        fields={[{ name: 'name', label: 'Recipe Name' }]}
      />
    </div>
  );
}
