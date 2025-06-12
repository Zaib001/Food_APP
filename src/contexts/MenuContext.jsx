import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  getAllMenus,
  createMenu as apiCreateMenu,
  deleteMenu as apiDeleteMenu,
  generateRequisitions as apiGenerateRequisitions
} from '../api/menus';
import { useRecipes } from './RecipeContext';

const MenuContext = createContext();
export const useMenus = () => useContext(MenuContext);

export const MenuProvider = ({ children }) => {
  const [menus, setMenus] = useState([]);
const [generatedRequisitions, setGeneratedRequisitions] = useState(() => {
  const stored = localStorage.getItem('generatedRequisitions');
  return stored ? JSON.parse(stored) : [];
});
  const { recipes } = useRecipes();

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    try {
      const res = await getAllMenus();
      setMenus(res.data);
      console.log(res.data)
    } catch (err) {
      console.error('Failed to fetch menus:', err);
    }
  };

  const addMenu = async (menuData) => {
    try {
      const res = await apiCreateMenu(menuData);
      setMenus(prev => [...prev, res.data]);
    } catch (err) {
      console.error('Failed to create menu:', err);
    }
  };

  const removeMenu = async (id) => {
    try {
      await apiDeleteMenu(id);
      setMenus(prev => prev.filter(menu => menu._id !== id));
    } catch (err) {
      console.error('Failed to delete menu:', err);
    }
  };

const generateRequisitionsFromServer = async (peopleCount = 100) => {
  try {
    const res = await apiGenerateRequisitions(peopleCount);
    setGeneratedRequisitions(res.data);
    localStorage.setItem('generatedRequisitions', JSON.stringify(res.data)); // 👈 Save
  } catch (err) {
    console.error('Failed to generate requisitions:', err.response?.data || err.message);
  }
};
const clearGeneratedRequisitions = () => {
  setGeneratedRequisitions([]);
  localStorage.removeItem('generatedRequisitions');
};



  return (
    <MenuContext.Provider
      value={{
        menus,
        setMenus,
        addMenu,
        removeMenu,
        generatedRequisitions,
        generateRequisitionsFromServer,
        clearGeneratedRequisitions
      }}
    >
      {children}
    </MenuContext.Provider>
  );
};
