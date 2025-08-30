// src/context/RecipeContext.jsx
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

// ---- helpers ----
function normalizeIngredients(raw) {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((i) => {
      const ingObj = i?.ingredientId;
      const candidateId =
        (ingObj && (ingObj._id || ingObj.id)) ??
        i?.ingredient?._id ??
        i?.ingredientId ??
        i?.id ??
        null;

      if (!candidateId) return null;

      return {
        ingredientId: candidateId,
        quantity: Number(i?.quantity ?? 0),
        baseQuantity: Number(i?.baseQuantity ?? i?.quantity ?? 0),
      };
    })
    .filter(Boolean);
}

export const RecipeProvider = ({ children }) => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchRecipes(); }, []);

  const fetchRecipes = async () => {
    try {
      const res = await getAllRecipes();

      const list = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.recipes)
          ? res.data.recipes
          : [];

      const cleanRecipes = list.map((r) => ({
        ...r,
        ingredients: normalizeIngredients(r?.ingredients),
      }));

      setRecipes(cleanRecipes);
    } catch (err) {
      console.error('Failed to load recipes:', err);
    } finally {
      setLoading(false);
    }
  };

  const getIngredientsForRecipe = (recipeId) => {
    const recipe = recipes.find((r) => r._id === recipeId || r.id === recipeId);
    return (recipe?.ingredients ?? []).map((i) => ({
      ingredientId: i.ingredientId,
      qtyPerUnit: Number(i.quantity ?? 0),
    }));
  };

  const addRecipe = async (formData) => {
    try {
      const res = await createRecipe(formData);
      const normalized = {
        ...res.data,
        ingredients: normalizeIngredients(res.data?.ingredients),
      };
      setRecipes((prev) => [normalized, ...prev]);
    } catch (err) {
      console.error('Failed to create recipe:', err);
    }
  };

  // Full update of a recipe using FormData (name, type, portions, ingredients, image, lock, scaling, etc.)
  const updateRecipeAtIndex = async (index, formData) => {
    try {
      const id = recipes[index]?._id || recipes[index]?.id;
      if (!id) throw new Error('Recipe id missing for update');

      const res = await updateRecipe(id, formData);
      const copy = [...recipes];
      copy[index] = {
        ...res.data,
        ingredients: normalizeIngredients(res.data?.ingredients),
      };
      setRecipes(copy);
    } catch (err) {
      console.error('Failed to update recipe:', err);
    }
  };

  const deleteRecipeAtIndex = async (index) => {
    try {
      const id = recipes[index]?._id || recipes[index]?.id;
      if (!id) throw new Error('Recipe id missing for delete');
      await deleteRecipe(id);
      setRecipes((prev) => prev.filter((_, i) => i !== index));
    } catch (err) {
      console.error('Failed to delete recipe:', err);
    }
  };

  const quickScaleRecipeAtIndex = async (index, clientCount) => {
    try {
      const id = recipes[index]?._id || recipes[index]?.id;
      if (!id) throw new Error('Recipe id missing for quick scale');
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
        loading,
        refreshRecipes: fetchRecipes,
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
