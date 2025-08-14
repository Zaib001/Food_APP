import React, { useState } from 'react';
import Select from 'react-select';
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUtensils,
  FaSave,
  FaTag
} from 'react-icons/fa';
import { useRecipes } from '../../contexts/RecipeContext';

export default function MenuPlanner({ onSubmit }) {
  const { recipes } = useRecipes();

  const [menu, setMenu] = useState({
    menuName: '',   // NEW: anchor name (e.g., "MENU 1")
    date: '',
    base: '',
    breakfast: [],
    lunch: [],
    dinner: [],
    snack: [],      // NEW block
    extra: [],      // NEW block
  });

  const handleChange = (field, value) => {
    setMenu(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const entries = [
      { mealType: 'breakfast', recipes: menu.breakfast },
      { mealType: 'lunch', recipes: menu.lunch },
      { mealType: 'dinner', recipes: menu.dinner },
      { mealType: 'snack', recipes: menu.snack },   // NEW
      { mealType: 'extra', recipes: menu.extra },   // NEW
    ];

    entries.forEach(entry => {
      if (entry.recipes.length > 0) {
        const recipeIds = entry.recipes.map(r => r.value);
        onSubmit({
          menuName: menu.menuName,             // pass through
          date: menu.date,
          base: menu.base,
          mealType: entry.mealType,
          recipeIds,
        });
      }
    });

    setMenu({
      menuName: '',
      date: '',
      base: '',
      breakfast: [],
      lunch: [],
      dinner: [],
      snack: [],
      extra: [],
    });
  };

  // Show only prepared (locked) recipes for quick adding to any meal block
  const recipeOptions = () =>
    recipes
      .filter(r => r.isLocked) // prepared/finalized only
      .map(r => ({ value: r._id, label: r.name }));

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow mb-6">
      <div className="flex items-center gap-2 mb-4 text-gray-800">
        <FaUtensils className="text-red-600" />
        <h2 className="text-xl font-bold">Plan New Menu</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="text-sm block mb-1 flex items-center gap-1">
            <FaTag /> Menu Name (anchor)
          </label>
          <input
            type="text"
            value={menu.menuName}
            onChange={(e) => handleChange('menuName', e.target.value)}
            className="w-full px-3 py-2 border rounded"
            placeholder='e.g. "MENU 1"'
            required
          />
        </div>

        <div>
          <label className="text-sm block mb-1 flex items-center gap-1">
            <FaCalendarAlt /> Date
          </label>
          <input
            type="date"
            value={menu.date}
            onChange={(e) => handleChange('date', e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="text-sm block mb-1 flex items-center gap-1">
            <FaMapMarkerAlt /> Base / Location
          </label>
          <input
            type="text"
            value={menu.base}
            onChange={(e) => handleChange('base', e.target.value)}
            className="w-full px-3 py-2 border rounded"
            placeholder="e.g. Camp Alpha"
            required
          />
        </div>
      </div>

      {/* Meal Blocks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="text-sm block mb-1">Breakfast Recipes</label>
          <Select
            isMulti
            options={recipeOptions()}
            value={menu.breakfast}
            onChange={(val) => handleChange('breakfast', val)}
            placeholder="Select prepared recipes"
          />
        </div>
        <div>
          <label className="text-sm block mb-1">Lunch Recipes</label>
          <Select
            isMulti
            options={recipeOptions()}
            value={menu.lunch}
            onChange={(val) => handleChange('lunch', val)}
            placeholder="Select prepared recipes"
          />
        </div>
        <div>
          <label className="text-sm block mb-1">Dinner Recipes</label>
          <Select
            isMulti
            options={recipeOptions()}
            value={menu.dinner}
            onChange={(val) => handleChange('dinner', val)}
            placeholder="Select prepared recipes"
          />
        </div>

        {/* NEW blocks */}
        <div>
          <label className="text-sm block mb-1">Snack Recipes</label>
          <Select
            isMulti
            options={recipeOptions()}
            value={menu.snack}
            onChange={(val) => handleChange('snack', val)}
            placeholder="Select prepared recipes"
          />
        </div>
        <div>
          <label className="text-sm block mb-1">Extra Recipes</label>
          <Select
            isMulti
            options={recipeOptions()}
            value={menu.extra}
            onChange={(val) => handleChange('extra', val)}
            placeholder="Select prepared recipes"
          />
        </div>
      </div>

      <div className="text-right mt-4">
        <button
          type="submit"
          className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 flex items-center gap-2"
        >
          <FaSave /> Save Menu
        </button>
      </div>
    </form>
  );
}
