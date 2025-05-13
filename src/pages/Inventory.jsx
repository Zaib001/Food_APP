import React, { useState } from 'react';
import InventoryForm from '../features/inventory/InventoryForm';
import InventoryTable from '../features/inventory/InventoryTable';
import StockBarChart from '../components/StockBarChart';
import { exportInventoryToCSV } from '../utils/exportMenus';

import { FaFileCsv, FaBoxOpen } from 'react-icons/fa';

export default function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  const ingredients = [
    { id: '1', name: 'Potato', unit: 'kg' },
    { id: '2', name: 'Carrot', unit: 'kg' },
    { id: '3', name: 'Chicken', unit: 'kg' },
  ];

  const suppliers = ['Supplier A', 'Supplier B', 'Supplier C'];

  const handleSave = (item) => {
    const fullItem = {
      ...item,
      ingredientName: ingredients.find(i => i.id === item.ingredientId)?.name || item.ingredientId,
    };

    if (editIndex !== null) {
      const updated = [...inventory];
      updated[editIndex] = fullItem;
      setInventory(updated);
      setEditIndex(null);
    } else {
      setInventory(prev => [...prev, fullItem]);
    }
  };

  const handleEdit = (index) => setEditIndex(index);
  const handleDelete = (index) => {
    const copy = [...inventory];
    copy.splice(index, 1);
    setInventory(copy);
  };

  return (
    <div className="p-6">
     

      <div className="flex justify-end mb-4">
        <button
          onClick={() => exportInventoryToCSV(inventory)}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm"
        >
          <FaFileCsv /> Export CSV
        </button>
      </div>

      <InventoryForm
        ingredients={ingredients}
        suppliers={suppliers}
        onSave={handleSave}
        initialData={editIndex !== null ? inventory[editIndex] : {}}
      />

      <InventoryTable
        data={inventory}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <StockBarChart data={inventory} />
    </div>
  );
}
