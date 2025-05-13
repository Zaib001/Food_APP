import React, { useState } from 'react';
import Select from 'react-select';

export default function MenuPlanner({ ingredients, onSubmit }) {
  const [menu, setMenu] = useState({
    date: '',
    base: '',
    mealType: { value: 'dinner', label: 'Dinner' },
    protein: null,
    sides: [],
    bread: null,
    beverage: null,
  });

  const handleSelectChange = (field, option) => {
    setMenu({ ...menu, [field]: option });
  };

  const handleMultiSelectChange = (selectedOptions) => {
    setMenu({ ...menu, sides: selectedOptions });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...menu,
      mealType: menu.mealType?.value,
      protein: menu.protein?.value || '',
      sides: menu.sides.map((s) => s.value),
      bread: menu.bread?.value || '',
      beverage: menu.beverage?.value || '',
    });
    setMenu({
      date: '',
      base: '',
      mealType: { value: 'dinner', label: 'Dinner' },
      protein: null,
      sides: [],
      bread: null,
      beverage: null,
    });
  };

  const filterByCategory = (cat) =>
    ingredients
      .filter((i) => i.category === cat)
      .map((i) => ({ value: i.id, label: i.name }));

  const mealOptions = ['breakfast', 'lunch', 'snack', 'dinner'].map((m) => ({
    value: m,
    label: m.charAt(0).toUpperCase() + m.slice(1),
  }));

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow mb-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800">🍽️ Plan a New Menu</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="text-sm text-gray-700 block mb-1">Date</label>
          <input
            type="date"
            name="date"
            value={menu.date}
            onChange={(e) => setMenu({ ...menu, date: e.target.value })}
            className="border rounded px-3 py-2 w-full"
            required
          />
        </div>

        <div>
          <label className="text-sm text-gray-700 block mb-1">Base / Location</label>
          <input
            type="text"
            name="base"
            placeholder="e.g. Camp A"
            value={menu.base}
            onChange={(e) => setMenu({ ...menu, base: e.target.value })}
            className="border rounded px-3 py-2 w-full"
            required
          />
        </div>

        <div>
          <label className="text-sm text-gray-700 block mb-1">Meal Type</label>
          <Select
            options={mealOptions}
            value={menu.mealType}
            onChange={(val) => handleSelectChange('mealType', val)}
          />
        </div>

        <div>
          <label className="text-sm text-gray-700 block mb-1">Protein</label>
          <Select
            options={filterByCategory('protein')}
            value={menu.protein}
            onChange={(val) => handleSelectChange('protein', val)}
            placeholder="Select Protein"
          />
        </div>

        <div>
          <label className="text-sm text-gray-700 block mb-1">Sides (multi-select)</label>
          <Select
            isMulti
            options={filterByCategory('side')}
            value={menu.sides}
            onChange={handleMultiSelectChange}
            placeholder="Select Side Dishes"
          />
        </div>

        <div>
          <label className="text-sm text-gray-700 block mb-1">Bread</label>
          <Select
            options={filterByCategory('bread')}
            value={menu.bread}
            onChange={(val) => handleSelectChange('bread', val)}
            placeholder="Select Bread"
          />
        </div>

        <div>
          <label className="text-sm text-gray-700 block mb-1">Hot Beverage</label>
          <Select
            options={filterByCategory('beverage')}
            value={menu.beverage}
            onChange={(val) => handleSelectChange('beverage', val)}
            placeholder="Select Beverage"
          />
        </div>
      </div>

      <button
        type="submit"
        className="mt-4 bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
      >
        Save Menu
      </button>
    </form>
  );
}
