import React, { useState } from 'react';
import IngredientTable from '../features/ingredients/IngredientTable';
import EditModal from '../components/EditModal';
import IngredientForm from '../features/ingredients/IngredientForm';

export default function Ingredients() {
  const [ingredients, setIngredients] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const handleEdit = (index) => {
    setEditingIndex(index);
    setModalOpen(true);
  };

  const handleSave = (updatedData) => {
    const updated = [...ingredients];
    updated[editingIndex] = updatedData;
    setIngredients(updated);
  };
  const addIngredient = (ingredient) => {
    setIngredients([...ingredients, ingredient]);
  };
  return (
    <div>
        <IngredientForm onSubmit={addIngredient} />
        <IngredientTable
        ingredients={ingredients}
        onEdit={handleEdit}
        onDelete={(index) => {
          const updated = [...ingredients];
          updated.splice(index, 1);
          setIngredients(updated);
        }}
      />

      <EditModal
        isOpen={isModalOpen}
        title="Edit Ingredient"
        initialValues={ingredients[editingIndex]}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        fields={[
          { name: 'name', label: 'Name' },
          { name: 'unit', label: 'Unit' },
          { name: 'price', label: 'Price', type: 'number' },
          { name: 'kcal', label: 'KCAL', type: 'number' },
          { name: 'yield', label: 'Yield (%)', type: 'number' },
        ]}
      />
    </div>
  );
}
