import React, { useState } from 'react';
import IngredientTable from '../features/ingredients/IngredientTable';
import EditModal from '../components/EditModal';
import IngredientForm from '../features/ingredients/IngredientForm';
import { useIngredients } from '../contexts/IngredientContext';

export default function Ingredients() {
  const {
    ingredients,
    addIngredient,
    updateIngredient,
    deleteIngredient,
  } = useIngredients();

  const [editingIndex, setEditingIndex] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const handleEdit = (index) => {
    setEditingIndex(index);
    setModalOpen(true);
  };

  const handleSave = (updatedData) => {
    updateIngredient(editingIndex, updatedData);
    setModalOpen(false);
  };

  return (
    <div>
      <IngredientForm onSubmit={addIngredient} />

      <IngredientTable
        ingredients={ingredients}
        onEdit={handleEdit}
        onDelete={deleteIngredient}
      />

      <EditModal
        isOpen={isModalOpen}
        title="Edit Ingredient"
        initialValues={ingredients[editingIndex]}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        fields={[
          { name: 'name', label: 'Name' },
          { name: 'purchaseUnit', label: 'Purchase Unit' },
          { name: 'purchaseQuantity', label: 'Purchase Quantity', tooltip: 'e.g. 25 for 25kg sack' },
          { name: 'originalUnit', label: 'Original Unit' },
          { name: 'originalPrice', label: 'Original Price', type: 'number' },
          { name: 'yield', label: 'Yield (%)', type: 'number', tooltip: 'Usable portion after prep (1-100)' },
          { name: 'kcal', label: 'KCAL', type: 'number' },
          { name: 'category', label: 'Category' },
          { name: 'warehouse', label: 'Warehouse' },
          { name: 'standardWeight', label: 'Standard Weight (g)', type: 'number', tooltip: 'e.g. 180g per piece' },
          { name: 'pricePerKg', label: 'Price per Kg', readOnly: true },
          { name: 'supplier', label: 'Supplier' },

        ]}

      />
    </div>
  );
}
