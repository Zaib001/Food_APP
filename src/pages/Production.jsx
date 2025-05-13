import React, { useState } from 'react';
import ProductionForm from '../features/production/ProductionForm';
import ProductionTable from '../features/production/ProductionTable';
import { FaFileCsv } from 'react-icons/fa';
// import { exportProductionToCSV } from '../utils/exportProduction'; // optional

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

  const handleSubmit = (entry) => {
    if (editIndex !== null) {
      const updated = [...logs];
      updated[editIndex] = entry;
      setLogs(updated);
      setEditIndex(null);
    } else {
      setLogs(prev => [...prev, entry]);
    }
  };

  const handleEdit = (index) => {
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    const copy = [...logs];
    copy.splice(index, 1);
    setLogs(copy);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">

        {/* Optional Export Button */}
        {/* 
        <button
          onClick={() => exportProductionToCSV(logs)}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm"
        >
          <FaFileCsv /> Export CSV
        </button>
        */}
      </div>

      <ProductionForm
        recipes={recipes}
        bases={bases}
        onSubmit={handleSubmit}
      />

      <ProductionTable
        data={logs}
        recipesMap={recipesMap}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
