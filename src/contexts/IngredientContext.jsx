import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  getAllIngredients,
  createIngredient,
  updateIngredient,
  deleteIngredient,
} from '../api/ingredientApi';
import toast from 'react-hot-toast';
import FoodLoader from '../components/ui/FoodLoader'; // ← animated loader

const IngredientContext = createContext();
export const useIngredients = () => useContext(IngredientContext);

export const IngredientProvider = ({ children }) => {
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchIngredients(); }, []);

  const fetchIngredients = async () => {
    setLoading(true); // ← ensure we show loader on refresh too
    try {
      const res = await getAllIngredients();
      setIngredients(res.data);
    } catch (err) {
      toast.error('Failed to load ingredients');
    } finally {
      setLoading(false);
    }
  };

  const addIngredient = async (ingredient) => {
    try {
      const res = await createIngredient(ingredient);
      setIngredients(prev => [res.data, ...prev]);
      toast.success('Ingredient added');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Add failed');
    }
  };

  const updateIngredientAtIndex = async (index, updatedData) => {
    try {
      const id = ingredients[index]._id;
      const res = await updateIngredient(id, updatedData);
      setIngredients(prev => {
        const copy = [...prev];
        copy[index] = res.data;
        return copy;
      });
      toast.success('Ingredient updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  const deleteIngredientAtIndex = async (index) => {
    try {
      const id = ingredients[index]._id;
      await deleteIngredient(id);
      setIngredients(prev => prev.filter((_, i) => i !== index));
      toast.success('Ingredient deleted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  const deductStock = (ingredientId, amount) => {
    setIngredients(prev =>
      prev.map(ing =>
        ing._id === ingredientId
          ? { ...ing, stock: Math.max((ing.stock || 0) - amount, 0) }
          : ing
      )
    );
  };

  return (
    <IngredientContext.Provider
      value={{
        ingredients,
        loading,              // ← exposed for consumers
        refresh: fetchIngredients,
        addIngredient,
        deductStock,
        updateIngredient: updateIngredientAtIndex,
        deleteIngredient: deleteIngredientAtIndex,
      }}
    >
          {children}

    </IngredientContext.Provider>
  );
};
