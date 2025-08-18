import React, { useState } from "react";
import { IngredientTable } from "../features/ingredients/IngredientTable";
import EditModal from "../components/EditModal";
import { IngredientForm } from "../features/ingredients/IngredientForm";
import { useIngredients } from "../contexts/IngredientContext";
import { motion } from "framer-motion";
import { FaBoxes } from "react-icons/fa";

export default function Ingredients() {
  const { ingredients, addIngredient, updateIngredient, deleteIngredient } = useIngredients();

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
    <div className="p-6 relative overflow-hidden">
      {/* header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl border border-rose-100 shadow bg-white mb-6"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-rose-600 via-rose-500 to-pink-500 opacity-95" />
        <div className="absolute inset-0 backdrop-blur-[1px]" />
        <div className="relative p-6 text-white flex items-center gap-3">
          <div className="grid place-items-center h-10 w-10 rounded-xl bg-white/20">
            <FaBoxes />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Ingredients</h1>
            <p className="text-white/80 text-sm">Add items, compute costs per base unit, and keep your catalog tidy.</p>
          </div>
        </div>
      </motion.div>

      <IngredientForm onSubmit={addIngredient} />

      <IngredientTable ingredients={ingredients} onEdit={handleEdit} onDelete={deleteIngredient} />

      <EditModal
        isOpen={isModalOpen}
        title="Edit Ingredient"
        initialValues={ingredients[editingIndex]}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        fields={[
          { name: "name", label: "Name" },
          { name: "purchaseUnit", label: "Purchase Unit" },
          { name: "purchaseQuantity", label: "Purchase Quantity", tooltip: "e.g. 25 for 25kg sack" },
          { name: "originalUnit", label: "Original Unit" },
          { name: "originalPrice", label: "Original Price", type: "number" },
          { name: "yield", label: "Yield (%)", type: "number", tooltip: "Usable portion after prep (1-100)" },
          { name: "kcal", label: "KCAL", type: "number" },
          { name: "category", label: "Category" },
          { name: "warehouse", label: "Warehouse" },
          { name: "standardWeight", label: "Standard Weight (g)", type: "number", tooltip: "e.g. 180g per piece" },
          { name: "pricePerKg", label: "Price per Base Unit", readOnly: true },
          { name: "supplier", label: "Supplier" },
        ]}
      />
    </div>
  );
}
