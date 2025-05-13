import React, { useState } from 'react';
import Select from 'react-select';

export default function ProductionForm({ recipes, bases, onSubmit }) {
  const [form, setForm] = useState({
    recipeId: '',
    quantity: '',
    date: '',
    base: '',
    handler: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (option) => {
    setForm({ ...form, recipeId: option.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    setForm({
      recipeId: '',
      quantity: '',
      date: '',
      base: '',
      handler: '',
    });
  };

  const recipeOptions = recipes.map(r => ({ value: r.id, label: r.name }));

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow border border-gray-100 mb-6"
    >
      <h2 className="text-xl font-bold mb-4 text-gray-800">Log Production Batch</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="text-sm text-gray-600 block mb-1">Recipe</label>
          <Select
            options={recipeOptions}
            value={recipeOptions.find(o => o.value === form.recipeId)}
            onChange={handleSelectChange}
            placeholder="Select Recipe"
          />
        </div>

        <div>
          <label className="text-sm text-gray-600 block mb-1">Quantity Produced</label>
          <input
            type="number"
            name="quantity"
            value={form.quantity}
            onChange={handleChange}
            placeholder="e.g. 100"
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="text-sm text-gray-600 block mb-1">Production Date</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="text-sm text-gray-600 block mb-1">Base / Location</label>
          <select
            name="base"
            value={form.base}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          >
            <option value="">Select Base</option>
            {bases.map((b, i) => (
              <option key={i} value={b}>{b}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm text-gray-600 block mb-1">Handled By</label>
          <input
            type="text"
            name="handler"
            value={form.handler}
            onChange={handleChange}
            placeholder="Staff name"
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
      >
        Save Production Log
      </button>
    </form>
  );
}
