import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  getAllRecipes,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  scaleRecipeApi,
} from '../api/recipeApi';

const RecipeContext = createContext();
export const useRecipes = () => useContext(RecipeContext);

export const RecipeProvider = ({ children }) => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchRecipes(); }, []);

  const fetchRecipes = async () => {
    try {
      const res = await getAllRecipes();
      if (Array.isArray(res.data)) {
        const cleanRecipes = res.data.map(r => ({
          ...r,
          ingredients: r.ingredients.map(i => ({
            ingredientId: i.ingredientId._id || i.ingredientId,
            quantity: Number(i.quantity),
            baseQuantity: i.baseQuantity,
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

  const addRecipe = async (formData) => {
    try {
      const res = await createRecipe(formData);
      setRecipes(prev => [res.data, ...prev]);
    } catch (err) {
      console.error('Failed to create recipe:', err);
    }
  };

  // Full update of a recipe using FormData (name, type, portions, ingredients, image, lock, scaling, etc.)
  const updateRecipeAtIndex = async (index, formData) => {
    try {
      const id = recipes[index]._id;
      const res = await updateRecipe(id, formData);
      const copy = [...recipes];
      copy[index] = {
        ...res.data,
        ingredients: res.data.ingredients.map(i => ({
          ingredientId: i.ingredientId._id || i.ingredientId,
          quantity: Number(i.quantity),
          baseQuantity: Number(i.baseQuantity || i.quantity),
        })),
      };
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

  const quickScaleRecipeAtIndex = async (index, clientCount) => {
    try {
      const id = recipes[index]._id;
      const { data } = await scaleRecipeApi(id, clientCount);
      return data; // returns a scaled (not saved) recipe object
    } catch (err) {
      console.error('Failed to scale recipe:', err);
      return null;
    }
  };

  return (
    <RecipeContext.Provider
      value={{
        recipes,
        addRecipe,
        updateRecipeAtIndex,
        getIngredientsForRecipe,
        deleteRecipeAtIndex,
        quickScaleRecipeAtIndex,
      }}
    >
      {children}
    </RecipeContext.Provider>
  );
};
