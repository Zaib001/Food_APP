// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { v4 as uuidv4 } from 'uuid';

// const RecipeContext = createContext();

// export const useRecipes = () => useContext(RecipeContext);

// export const RecipeProvider = ({ children }) => {
//   const [recipes, setRecipes] = useState([]);

//   useEffect(() => {
//     const stored = localStorage.getItem('recipes');
//     if (stored) setRecipes(JSON.parse(stored));
//   }, []);

//   useEffect(() => {
//     localStorage.setItem('recipes', JSON.stringify(recipes));
//   }, [recipes]);

//   const addRecipe = (recipe) => {
//     const recipeWithId = {
//       ...recipe,
//       id: recipe.id || uuidv4(),
//     };
//     setRecipes((prev) => [...prev, recipeWithId]);
//   };

//   const updateRecipe = (index, updated) => {
//     const copy = [...recipes];
//     copy[index] = updated;
//     setRecipes(copy);
//   };

//   const deleteRecipe = (index) => {
//     const copy = [...recipes];
//     copy.splice(index, 1);
//     setRecipes(copy);
//   };

//   const getIngredientsForRecipe = (recipeId) => {
//     const recipe = recipes.find((r) => r.id === recipeId);
//     if (!recipe) return [];
//     return recipe.ingredients.map(({ ingredientId, quantity }) => ({
//       ingredientId,
//       qtyPerUnit: parseFloat(quantity), // Normalize quantity as number
//     }));
//   };

//   return (
//     <RecipeContext.Provider
//       value={{
//         recipes,
//         setRecipes,
//         addRecipe,
//         updateRecipe,
//         deleteRecipe,
//         getIngredientsForRecipe,
//       }}
//     >
//       {children}
//     </RecipeContext.Provider>
//   );
// };
// contexts/RecipeContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const RecipeContext = createContext();
export const useRecipes = () => useContext(RecipeContext);

export const RecipeProvider = ({ children }) => {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('recipes');
    if (stored) setRecipes(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem('recipes', JSON.stringify(recipes));
  }, [recipes]);

  const addRecipe = (recipe) => {
    const id = Date.now().toString(); // assign a unique ID
    setRecipes((prev) => [...prev, { ...recipe, id }]);
  };

  const getIngredientsForRecipe = (recipeId) => {
    const recipe = recipes.find((r) => r.id === recipeId);
    return recipe?.ingredients.map(i => ({
      ingredientId: i.ingredientId,
      qtyPerUnit: i.quantity,
    })) || [];
  };

  return (
    <RecipeContext.Provider value={{ recipes, addRecipe, getIngredientsForRecipe }}>
      {children}
    </RecipeContext.Provider>
  );
};
