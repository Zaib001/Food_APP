import React, { useState } from 'react';
import Select from 'react-select';
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUtensils,
  FaDrumstickBite,
  FaLeaf,
  FaBreadSlice,
  FaMugHot,
  FaSave
} from 'react-icons/fa';

export default function MenuPlanner({ ingredients, onSubmit }) {
  const [menu, setMenu] = useState({
    date: '',
    base: '',
    mealType: { value: 'dinner', label: 'Dinner' },
    proteins: [],
    sides: [],
    breads: [],
    beverages: [],
  });

  const handleChange = (field, value) => {
    setMenu(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...menu,
      mealType: menu.mealType.value,
      proteins: menu.proteins.map(i => i.value),
      sides: menu.sides.map(i => i.value),
      breads: menu.breads.map(i => i.value),
      beverages: menu.beverages.map(i => i.value),
    });
    setMenu({
      date: '',
      base: '',
      mealType: { value: 'dinner', label: 'Dinner' },
      proteins: [],
      sides: [],
      breads: [],
      beverages: [],
    });
  };

  const getOptions = (category) =>
    ingredients
      .filter(i => i.category === category)
      .map(i => ({ value: i.id, label: i.name }));

  const mealOptions = ['breakfast', 'lunch', 'snack', 'dinner'].map(m => ({
    value: m,
    label: m.charAt(0).toUpperCase() + m.slice(1),
  }));

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow mb-6">
      <div className="flex items-center gap-2 mb-4 text-gray-800">
        <FaUtensils className="text-red-600" />
        <h2 className="text-xl font-bold">Plan New Menu</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="text-sm block mb-1 flex items-center gap-1">
            <FaCalendarAlt /> Date
          </label>
          <input
            type="date"
            value={menu.date}
            onChange={(e) => handleChange('date', e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="text-sm block mb-1 flex items-center gap-1">
            <FaMapMarkerAlt /> Base / Location
          </label>
          <input
            type="text"
            value={menu.base}
            onChange={(e) => handleChange('base', e.target.value)}
            className="w-full px-3 py-2 border rounded"
            placeholder="e.g. Camp Alpha"
            required
          />
        </div>

        <div>
          <label className="text-sm block mb-1 flex items-center gap-1">
            <FaUtensils /> Meal Type
          </label>
          <Select
            options={mealOptions}
            value={menu.mealType}
            onChange={(val) => handleChange('mealType', val)}
          />
        </div>

        <div>
          <label className="text-sm block mb-1 flex items-center gap-1">
            <FaDrumstickBite /> Proteins
          </label>
          <Select
            isMulti
            options={getOptions('protein')}
            value={menu.proteins}
            onChange={(val) => handleChange('proteins', val)}
            placeholder="Select proteins"
          />
        </div>

        <div>
          <label className="text-sm block mb-1 flex items-center gap-1">
            <FaLeaf /> Sides
          </label>
          <Select
            isMulti
            options={getOptions('side')}
            value={menu.sides}
            onChange={(val) => handleChange('sides', val)}
            placeholder="Select sides"
          />
        </div>

        <div>
          <label className="text-sm block mb-1 flex items-center gap-1">
            <FaBreadSlice /> Breads
          </label>
          <Select
            isMulti
            options={getOptions('bread')}
            value={menu.breads}
            onChange={(val) => handleChange('breads', val)}
            placeholder="Select breads"
          />
        </div>

        <div>
          <label className="text-sm block mb-1 flex items-center gap-1">
            <FaMugHot /> Beverages
          </label>
          <Select
            isMulti
            options={getOptions('beverage')}
            value={menu.beverages}
            onChange={(val) => handleChange('beverages', val)}
            placeholder="Select beverages"
          />
        </div>
      </div>

      <div className="text-right mt-4">
        <button
          type="submit"
          className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 flex items-center gap-2"
        >
          <FaSave /> Save Menu
        </button>
      </div>
    </form>
  );
}
