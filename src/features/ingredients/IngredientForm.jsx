import React, { useState } from 'react';
import { motion } from 'framer-motion';

const unitConversions = {
  kg: 1,
  g: 0.001,
  lb: 0.453592,
  oz: 0.0283495,
  lt: 1,
  ml: 0.001,
  jug: 1.89, 
  pcs: 1
};

export default function IngredientForm({ onSubmit }) {
  const [form, setForm] = useState({
    name: '',
    unit: 'kg',
    originalPrice: '',
    kcal: '',
    yield: '',
    category: '',
    warehouse: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const conversionFactor = unitConversions[form.unit] || 1;
    const pricePerKg = parseFloat(form.originalPrice || 0) / conversionFactor;

    const finalData = {
      name: form.name,
      originalUnit: form.unit,
      pricePerKg: pricePerKg.toFixed(4),
      originalPrice: parseFloat(form.originalPrice || 0).toFixed(2),
      kcal: form.kcal,
      yield: form.yield,
      category: form.category,
      warehouse: form.warehouse
    };

    onSubmit(finalData);

    setForm({
      name: '',
      unit: 'kg',
      originalPrice: '',
      kcal: '',
      yield: '',
      category: '',
      warehouse: ''
    });
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
            className="w-full border border-gray-300 rounded-md px-4 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Unit</label>
          <select
            name="unit"
            value={form.unit}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2"
          >
            <option value="kg">kg</option>
            <option value="g">g</option>
            <option value="lb">lb</option>
            <option value="oz">oz</option>
            <option value="lt">lt</option>
            <option value="ml">ml</option>
            <option value="jug">jug</option>
            <option value="pcs">pcs</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price (per unit)
          </label>
          <input
            name="originalPrice"
            value={form.originalPrice}
            onChange={handleChange}
            type="number"
            placeholder="e.g. 2.5"
            className="w-full border border-gray-300 rounded-md px-4 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">KCAL / 1000g</label>
          <input
            name="kcal"
            value={form.kcal}
            onChange={handleChange}
            type="number"
            placeholder="e.g. 770"
            className="w-full border border-gray-300 rounded-md px-4 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Yield (%)</label>
          <input
            name="yield"
            value={form.yield}
            onChange={handleChange}
            type="number"
            placeholder="e.g. 80"
            className="w-full border border-gray-300 rounded-md px-4 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2"
          >
            <option value="">Select category</option>
            <option value="protein">Protein</option>
            <option value="side">Side</option>
            <option value="bread">Bread</option>
            <option value="beverage">Beverage</option>
            <option value="cold">Cold Dish</option>
            <option value="hot">Hot Dish</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Warehouse</label>
          <input
            name="warehouse"
            value={form.warehouse}
            onChange={handleChange}
            placeholder="e.g. Freezer 1, Dry Store"
            className="w-full border border-gray-300 rounded-md px-4 py-2"
          />
        </div>
      </div>

      <div className="mt-6 text-right">
        <button
          type="submit"
          className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
        >
          Add Ingredient
        </button>
      </div>
    </motion.form>
  );
}
