import React, { useState } from 'react';
import InventoryForm from '../features/inventory/InventoryForm';
import InventoryTable from '../features/inventory/InventoryTable';
import StockBarChart from '../components/StockBarChart';
import { FaFileCsv } from 'react-icons/fa';
import { useInventory } from '../contexts/InventoryContext';
import { useIngredients } from '../contexts/IngredientContext';

export default function Inventory() {
  const {
    inventory,
    addInventory,
    editInventory,
    removeInventory,
    downloadCSV,
  } = useInventory();

  const { ingredients } = useIngredients();

  const [editIndex, setEditIndex] = useState(null);


  const handleSave = async (item) => {
    console.log(item)
    const ingredientName = ingredients.find(i => i._id === item.ingredientId)?.name || item.ingredientId;
    const ingredient = ingredients.find(i => i._id === item.ingredientId);
    if (!ingredient) return;

    const entry = {
      ...item,
      ingredientId: ingredient._id,
      ingredientName: ingredient.name,
    };
    if (editIndex !== null) {
      await editInventory(inventory[editIndex]._id, entry);
      setEditIndex(null);
    } else {
      console.log('Submitting inventory entry:', entry);
      await addInventory(entry);

    }
  };

  const handleEdit = (index) => setEditIndex(index);
  const handleDelete = async (index) => {
    const id = inventory[index]._id;
    await removeInventory(id);
  };

  return (
    <div className="p-6">
      <div className="flex justify-end mb-4">
        <button
          onClick={downloadCSV}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm"
        >
          <FaFileCsv /> Export CSV
        </button>
      </div>

      <InventoryForm
        ingredients={ingredients}
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
