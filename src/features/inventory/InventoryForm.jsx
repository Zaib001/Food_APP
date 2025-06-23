import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { motion } from 'framer-motion';

export default function InventoryForm({ ingredients = [], initialData = {}, onSave }) {
  const [form, setForm] = useState({
    ingredientId: '',
    supplier: '',
    quantity: '',
    unit: '',
    date: '',
    notes: '',
  });

  useEffect(() => {
    if (initialData) setForm({ ...form, ...initialData });
  }, [initialData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSelect = (field, selected) => {
    setForm({ ...form, [field]: selected.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
    setForm({
      ingredientId: '',
      supplier: '',
      quantity: '',
      unit: '',
      date: '',
      notes: '',
    });
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-xl font-bold text-gray-800 mb-4">Add / Update Inventory</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Ingredient */}
        <div>
          <label className="block text-sm text-gray-700 mb-1">Ingredient</label>
          <Select
            options={ingredients.map((i) => ({ value: i._id, label: i.name }))}
            value={ingredients.find((i) => i._id === form.ingredientId) ? {
              value: form.ingredientId,
              label: ingredients.find((i) => i._id === form.ingredientId)?.name,
            } : null}
            onChange={(selected) => handleSelect('ingredientId', selected)}
            placeholder="Select ingredient"
            required
          />

        </div>

        {/* Supplier */}
        {/* Supplier (manual input) */}
        <div>
          <label className="block text-sm text-gray-700 mb-1">Supplier</label>
          <input
            type="text"
            name="supplier"
            value={form.supplier}
            onChange={handleChange}
            placeholder="Enter supplier name"
            className="border rounded px-3 py-2 w-full"
          />
        </div>


        {/* Quantity */}
        <div>
          <label className="block text-sm text-gray-700 mb-1">Quantity</label>
          <input
            type="number"
            name="quantity"
            value={form.quantity}
            onChange={handleChange}
            className="border rounded px-3 py-2 w-full"
            required
          />
        </div>

        {/* Unit */}
        <div>
          <label className="block text-sm text-gray-700 mb-1">Unit</label>
          <input
            type="text"
            name="unit"
            placeholder="e.g. kg, jug"
            value={form.unit}
            onChange={handleChange}
            className="border rounded px-3 py-2 w-full"
          />
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm text-gray-700 mb-1">Delivery Date</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="border rounded px-3 py-2 w-full"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm text-gray-700 mb-1">Notes (optional)</label>
          <input
            type="text"
            name="notes"
            value={form.notes}
            onChange={handleChange}
            className="border rounded px-3 py-2 w-full"
          />
        </div>
      </div>

      <button
        type="submit"
        className="mt-6 bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
      >
        Save Entry
      </button>
    </motion.form>
  );
}
