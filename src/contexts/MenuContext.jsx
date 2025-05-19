import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRecipes } from './RecipeContext';

const MenuContext = createContext();
export const useMenus = () => useContext(MenuContext);

export const MenuProvider = ({ children }) => {
  const [menus, setMenus] = useState([]);
  const [generatedRequisitions, setGeneratedRequisitions] = useState([]);
  const { recipes } = useRecipes();

  useEffect(() => {
    const stored = localStorage.getItem('menus');
    if (stored) setMenus(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem('menus', JSON.stringify(menus));
  }, [menus]);

  const addMenu = (menu) => {
    setMenus(prev => [...prev, menu]);
  };

  const generateRequisitionsFromMenus = () => {
    const recipeMap = Object.fromEntries(recipes.map(r => [r.id, r]));
    const result = [];

    menus.forEach(menu => {
      const allIds = [
        ...(menu.proteins || []),
        ...(menu.sides || []),
        ...(menu.breads || []),
        ...(menu.beverages || []),
      ];

      allIds.forEach(recipeId => {
        const recipe = recipeMap[recipeId];
        if (recipe?.ingredients) {
          recipe.ingredients.forEach(({ ingredientId, quantity }) => {
            const qty = Number(quantity);
            const existing = result.find(r =>
              r.date === menu.date &&
              r.base === menu.base &&
              r.item === ingredientId
            );

            if (existing) {
              existing.quantity += qty;
            } else {
              result.push({
                date: menu.date,
                base: menu.base,
                item: ingredientId,
                quantity: qty,
                unit: 'kg',
                status: 'pending',
                requestedBy: 'Auto-System',
                supplier: 'Default Supplier'
              });
            }
          });
        }
      });
    });

    setGeneratedRequisitions(result);
    return result;
  };

  return (
    <MenuContext.Provider
      value={{
        menus,
        setMenus,
        addMenu,
        generatedRequisitions,
        generateRequisitionsFromMenus
      }}
    >
      {children}
    </MenuContext.Provider>
  );
};
