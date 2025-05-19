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
          { name: 'originalUnit', label: 'Unit' },
          { name: 'originalPrice', label: 'Price', type: 'number' },
          { name: 'kcal', label: 'KCAL', type: 'number' },
          { name: 'yield', label: 'Yield (%)', type: 'number' },
          { name: 'category', label: 'Category' },
          { name: 'warehouse', label: 'Warehouse' },
        ]}
      />
    </div>
  );
}
