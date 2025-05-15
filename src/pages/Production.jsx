import React, { useState } from 'react';
import ProductionForm from '../features/production/ProductionForm';
import ProductionTable from '../features/production/ProductionTable';
import { FaFileCsv, FaFilePdf, FaFilter } from 'react-icons/fa';
import { exportProductionToPDF } from '../components/exportRecipesToPDF';

export default function Production() {
  const [logs, setLogs] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  const recipes = [
    { id: 'r1', name: 'Chicken Soup' },
    { id: 'r2', name: 'Rice & Beans' },
    { id: 'r3', name: 'Beef Stew' },
  ];

  const bases = ['Camp A', 'Camp B', 'Base Alpha'];

  const recipesMap = Object.fromEntries(recipes.map(r => [r.id, r]));

  const [filters, setFilters] = useState({ recipe: 'all', base: 'all', date: '' });

  const handleSubmit = async (entry) => {
    if (editIndex !== null) {
      const updated = [...logs];
      updated[editIndex] = entry;
      setLogs(updated);
      setEditIndex(null);
    } else {
      setLogs(prev => [...prev, entry]);
    }

    // Optional: Trigger inventory deduction API
    // await deductInventoryForRecipe(entry.recipeId, entry.quantity);
  };

  const handleEdit = (index) => {
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    const copy = [...logs];
    copy.splice(index, 1);
    setLogs(copy);
  };

  const filteredLogs = logs.filter(log =>
    (filters.recipe === 'all' || log.recipeId === filters.recipe) &&
    (filters.base === 'all' || log.base === filters.base) &&
    (!filters.date || log.date === filters.date)
  );

  return (
    <div className="p-6">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
        <div className="flex flex-wrap gap-2">
          <select
            value={filters.recipe}
            onChange={(e) => setFilters({ ...filters, recipe: e.target.value })}
            className="px-3 py-1 text-sm border border-gray-300 rounded"
          >
            <option value="all">All Recipes</option>
            {recipes.map((r) => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>

          <select
            value={filters.base}
            onChange={(e) => setFilters({ ...filters, base: e.target.value })}
            className="px-3 py-1 text-sm border border-gray-300 rounded"
          >
            <option value="all">All Bases</option>
            {bases.map((b, i) => (
              <option key={i} value={b}>{b}</option>
            ))}
          </select>

          <input
            type="date"
            value={filters.date}
            onChange={(e) => setFilters({ ...filters, date: e.target.value })}
            className="px-3 py-1 text-sm border border-gray-300 rounded"
          />
        </div>

        <div className="flex gap-2">
          {/* CSV button (optional) */}
          {/* 
          <button
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700"
            onClick={() => exportProductionToCSV(filteredLogs)}
          >
            <FaFileCsv /> Export CSV
          </button>
          */}

          <button
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
            onClick={() => exportProductionToPDF(filteredLogs, recipesMap)}
          >
            <FaFilePdf /> Export PDF
          </button>
        </div>
      </div>

      <ProductionForm
        recipes={recipes}
        bases={bases}
        onSubmit={handleSubmit}
      />

      <ProductionTable
        data={filteredLogs}
        recipesMap={recipesMap}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
