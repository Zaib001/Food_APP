import React, { createContext, useContext, useState, useEffect } from 'react';

const IngredientContext = createContext();

export const useIngredients = () => useContext(IngredientContext);

export const IngredientProvider = ({ children }) => {
  const [ingredients, setIngredients] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('ingredients');
    if (stored) setIngredients(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem('ingredients', JSON.stringify(ingredients));
  }, [ingredients]);

  const addIngredient = (ingredient) => {
    setIngredients(prev => [
      ...prev,
      { ...ingredient, stock: 0 } // default stock to 0
    ]);
  };

  const updateIngredient = (index, updated) => {
    const copy = [...ingredients];
    copy[index] = { ...updated, stock: copy[index].stock || 0 };
    setIngredients(copy);
  };

  const deleteIngredient = (index) => {
    const copy = [...ingredients];
    copy.splice(index, 1);
    setIngredients(copy);
  };

  const addStock = (ingredientName, quantity) => {
    setIngredients(prev =>
      prev.map(i =>
        i.name === ingredientName
          ? { ...i, stock: (i.stock || 0) + quantity }
          : i
      )
    );
  };

  const deductStock = (ingredientName, quantity) => {
    setIngredients(prev =>
      prev.map(i =>
        i.name === ingredientName
          ? { ...i, stock: Math.max(0, (i.stock || 0) - quantity) }
          : i
      )
    );
  };

  return (
    <IngredientContext.Provider
      value={{
        ingredients,
        setIngredients,
        addIngredient,
        updateIngredient,
        deleteIngredient,
        addStock,
        deductStock
      }}
    >
      {children}
    </IngredientContext.Provider>
  );
};
