import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function IngredientForm({ onSubmit }) {
  const [form, setForm] = useState({
    name: '',
    unit: 'kg',
    price: '',
    kcal: '',
    yield: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    setForm({ name: '', unit: 'kg', price: '', kcal: '', yield: '' });
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white shadow-lg rounded-xl p-6 mb-8 border border-gray-100"
    >
      <h2 className="text-xl font-bold mb-6 text-gray-800">Add New Ingredient</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="e.g. Potato"
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
          <select
            name="unit"
            value={form.unit}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
          >
            <option value="kg">kg</option>
            <option value="lt">lt</option>
            <option value="jug">jug</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Price (per unit)</label>
          <input
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder="e.g. 2.50"
            type="number"
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">KCAL / 1000g</label>
          <input
            name="kcal"
            value={form.kcal}
            onChange={handleChange}
            placeholder="e.g. 770"
            type="number"
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Yield (%)</label>
          <input
            name="yield"
            value={form.yield}
            onChange={handleChange}
            placeholder="e.g. 80"
            type="number"
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
          />
        </div>
      </div>

      <div className="mt-6 text-right">
        <button
          type="submit"
          className="bg-red-600 text-white font-semibold px-6 py-2 rounded-md hover:bg-red-700 transition shadow-sm"
        >
          Add Ingredient
        </button>
      </div>
    </motion.form>
  );
}
