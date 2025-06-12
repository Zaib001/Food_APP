import React, { useState } from 'react';
import MenuPlanner from '../features/menus/MenuPlanner';
import MenuCalendar from '../features/menus/MenuCalendar';
import GeneratedRequisitionTable from '../features/requisitions/GeneratedRequisitionTable';
import { exportMenusToCSV, exportMenusToWeeklyPDF } from '../utils/exportMenus';
import { FaFileCsv, FaFilePdf, FaReceipt } from 'react-icons/fa';

import { useMenus } from '../contexts/MenuContext';
import { useIngredients } from '../contexts/IngredientContext';
import { useRecipes } from '../contexts/RecipeContext';

export default function Menus() {
  const { menus, addMenu, generateRequisitionsFromServer, generatedRequisitions } = useMenus();
  const { ingredients } = useIngredients();
  const { recipes } = useRecipes();

  const [requisitions, setRequisitions] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState('all');

  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    await generateRequisitionsFromServer(100);
    setLoading(false);
  };
  const ingredientsMap = {};
  ingredients.forEach(i => {
    ingredientsMap[i._id] = i;
  });

  const handleSubmit = (newMenu) => {
    addMenu(newMenu);
  };

  const currentWeekDates = () => {
    const today = new Date();
    const start = new Date(today.setDate(today.getDate() - today.getDay())); // Sunday
    return Array.from({ length: 7 }).map((_, i) => {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      return date.toISOString().split('T')[0];
    });
  };

  const weekDates = currentWeekDates();
  const filteredMenus = selectedWeek === 'all'
    ? menus
    : menus.filter(menu => weekDates.includes(menu.date));


  return (
    <div className="p-6">
      {/* Export Buttons */}
      <div className="flex flex-wrap justify-end gap-3 mb-6">
        <button
          onClick={() => exportMenusToCSV(filteredMenus, ingredientsMap)}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm"
        >
          <FaFileCsv /> Export CSV
        </button>
        <button
          onClick={() => exportMenusToWeeklyPDF(filteredMenus, ingredientsMap)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
        >
          <FaFilePdf /> Export Weekly PDF
        </button>
        <button
          onClick={handleGenerate}
          disabled={loading}
          className={`flex items-center gap-2 px-4 py-2 rounded text-sm ${loading ? 'bg-gray-400' : 'bg-yellow-600 hover:bg-yellow-700'
            } text-white`}
        >
          <FaReceipt />
          {loading ? 'Generating...' : 'Generate Requisitions'}
        </button>
      </div>

      {/* Week Filter */}
      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setSelectedWeek('all')}
          className={`px-3 py-1 rounded ${selectedWeek === 'all' ? 'bg-red-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
        >
          All Menus
        </button>
        <button
          onClick={() => setSelectedWeek('week')}
          className={`px-3 py-1 rounded ${selectedWeek === 'week' ? 'bg-red-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
        >
          This Week
        </button>
      </div>

      {/* UI Sections */}
      <MenuPlanner ingredients={ingredients} onSubmit={handleSubmit} />
      <MenuCalendar menus={filteredMenus} ingredientsMap={ingredientsMap} />
      <GeneratedRequisitionTable requisitions={generatedRequisitions} />
    </div>
  );
}
