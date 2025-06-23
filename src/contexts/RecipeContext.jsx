import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  getAllRecipes,
  createRecipe,
  updateRecipe,
  deleteRecipe,
} from '../api/recipeApi';

const RecipeContext = createContext();
export const useRecipes = () => useContext(RecipeContext);

export const RecipeProvider = ({ children }) => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecipes();
  }, []);

 const fetchRecipes = async () => {
  try {
    const res = await getAllRecipes();
    console.log("Recipe API Response:", res.data);

    // If res.data is an array
    if (Array.isArray(res.data)) {
      const cleanRecipes = res.data.map(r => ({
        ...r,
        ingredients: r.ingredients.map(i => ({
          ingredientId: i.ingredientId._id || i.ingredientId,
          quantity: i.quantity,
        })),
      }));
      setRecipes(cleanRecipes);
    } else {
      console.error("Expected array but got:", res.data);
    }

  } catch (err) {
    console.error('Failed to load recipes:', err);
  } finally {
    setLoading(false);
  }
};

  const getIngredientsForRecipe = (recipeId) => {
    const recipe = recipes.find(r => r._id === recipeId || r.id === recipeId);
    return recipe?.ingredients?.map(i => ({
      ingredientId: i.ingredientId,
      qtyPerUnit: i.quantity,
    })) || [];
  };
  const addRecipe = async (recipe) => {
    try {
      const res = await createRecipe(recipe);
      setRecipes(prev => [res.data, ...prev]);
    } catch (err) {
      console.error('Failed to create recipe:', err);
    }
  };

  const updateRecipeNameAtIndex = async (index, updatedData) => {
    try {
      const id = recipes[index]._id;
      const res = await updateRecipe(id, { name: updatedData.name });
      const copy = [...recipes];
      copy[index] = { ...copy[index], name: res.data.name };
      setRecipes(copy);
    } catch (err) {
      console.error('Failed to update recipe:', err);
    }
  };

  const deleteRecipeAtIndex = async (index) => {
    try {
      const id = recipes[index]._id;
      await deleteRecipe(id);
      setRecipes(prev => prev.filter((_, i) => i !== index));
    } catch (err) {
      console.error('Failed to delete recipe:', err);
    }
  };

  return (
    <RecipeContext.Provider
      value={{
        recipes,
        addRecipe,
        updateRecipeNameAtIndex,
        getIngredientsForRecipe,
        deleteRecipeAtIndex
      }}
    >
      {loading ? <div className="p-6">Loading recipes...</div> : children}
    </RecipeContext.Provider>
  );
};
