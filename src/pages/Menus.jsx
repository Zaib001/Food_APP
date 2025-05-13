import React, { useState } from 'react';
import MenuPlanner from '../features/menus/MenuPlanner';
import MenuCalendar from '../features/menus/MenuCalendar';
import GeneratedRequisitionTable from '../features/requisitions/GeneratedRequisitionTable';
import { exportMenusToCSV, exportMenusToWeeklyPDF } from '../utils/exportMenus';
import { useRequisitions } from '../contexts/RequisitionContext';
import { FaFileCsv, FaFilePdf, FaReceipt } from 'react-icons/fa';

const ingredients = [
  { id: '1', name: 'Chicken', category: 'protein', unit: 'kg' },
  { id: '2', name: 'Potato', category: 'side', unit: 'kg' },
  { id: '3', name: 'Salad', category: 'side', unit: 'kg' },
  { id: '4', name: 'Bun', category: 'bread', unit: 'pcs' },
  { id: '5', name: 'Tea', category: 'beverage', unit: 'ltr' },
  { id: '6', name: 'Fish', category: 'protein', unit: 'kg' },
  { id: '7', name: 'Rice', category: 'side', unit: 'kg' },
  { id: '8', name: 'Coffee', category: 'beverage', unit: 'ltr' },
];

export default function Menus() {
  const [menus, setMenus] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState('all');
  const { requisitions, setRequisitions } = useRequisitions();

  const ingredientsMap = Object.fromEntries(ingredients.map(i => [i.id, i]));

  const handleSubmit = (newMenu) => {
    setMenus(prev => [...prev, newMenu]);
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

  const generateRequisitionsFromMenus = () => {
    const newRequisitions = [];

    filteredMenus.forEach(menu => {
      const allItems = [menu.protein, ...menu.sides, menu.bread, menu.beverage];
      allItems.forEach(id => {
        const ing = ingredientsMap[id];
        if (ing) {
          newRequisitions.push({
            date: menu.date,
            item: ing.name,
            unit: ing.unit,
            base: menu.base,
            status: 'pending',
            quantity: 1,
            supplier: 'Default Supplier',
            requestedBy: 'System',
          });
        }
      });
    });

    setRequisitions(newRequisitions);
    alert('Requisitions generated from menus!');
    console.log('Requisitions:', newRequisitions);
  };

  return (
    <div className="p-6">

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
    onClick={generateRequisitionsFromMenus}
    className="flex items-center gap-2 bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 text-sm"
  >
    <FaReceipt /> Generate Requisitions
  </button>
</div>

      {/* Week Filter */}
      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setSelectedWeek('all')}
          className={`px-3 py-1 rounded ${
            selectedWeek === 'all' ? 'bg-red-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          All Menus
        </button>
        <button
          onClick={() => setSelectedWeek('week')}
          className={`px-3 py-1 rounded ${
            selectedWeek === 'week' ? 'bg-red-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          This Week
        </button>
      </div>

      {/* Form + Calendar + Requisition Table */}
      <MenuPlanner ingredients={ingredients} onSubmit={handleSubmit} />
      <MenuCalendar menus={filteredMenus} ingredientsMap={ingredientsMap} />
      <GeneratedRequisitionTable requisitions={requisitions} />
    </div>
  );
}
