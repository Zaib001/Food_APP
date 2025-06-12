import React, { useState } from 'react';
import InventoryForm from './InventoryForm';
import InventoryTable from './InventoryTable';

export default function StockCheck() {
  const [inventory, setInventory] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  // Sample static data (in real case, fetch from API or context)
  const ingredients = [
    { id: '1', name: 'Potato', unit: 'kg' },
    { id: '2', name: 'Carrot', unit: 'kg' },
    { id: '3', name: 'Chicken', unit: 'kg' },
  ];

  const suppliers = ['Supplier A', 'Supplier B', 'Supplier C'];

  const handleSave = (item) => {
    const itemWithName = {
      ...item,
      ingredientName: ingredients.find((i) => i.id === item.ingredientId)?.name || item.ingredientId,
    };

    if (editIndex !== null) {
      const updated = [...inventory];
      updated[editIndex] = itemWithName;
      setInventory(updated);
      setEditIndex(null);
    } else {
      setInventory([...inventory, itemWithName]);
    }
  };

  const handleEdit = (index) => setEditIndex(index);
  const handleDelete = (index) => {
    const updated = [...inventory];
    updated.splice(index, 1);
    setInventory(updated);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Inventory Management</h1>

      <InventoryForm
        ingredients={ingredients}
        suppliers={suppliers}
        onSave={handleSave}
        initialData={editIndex !== null ? inventory[editIndex] : {}}
      />

      <InventoryTable data={inventory} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
}
