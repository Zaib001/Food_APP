import React, { useState } from 'react';
import Select from 'react-select';
import {
  FaClipboardList,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUtensils,
  FaStickyNote
} from 'react-icons/fa';

export default function PlanningForm({ menus = [], onSubmit }) {
  const [plan, setPlan] = useState({
    date: '',
    base: '',
    menus: [],
    notes: ''
  });

  const menuOptions = menus.map((menu) => ({
    value: menu._id,
    label: `${new Date(menu.date).toDateString()} – ${menu.mealType} @ ${menu.base}`,
  }));


  const handleChange = (e) => {
    setPlan({ ...plan, [e.target.name]: e.target.value });
  };

  const handleMenusChange = (selectedOptions) => {
    setPlan({
      ...plan,
      menus: selectedOptions.map(opt => opt._id)
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(plan);
    setPlan({ date: '', base: '', menus: [], notes: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow mb-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
        <FaClipboardList /> Create a New Plan
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-700 mb-1 flex items-center gap-1">
            Date
          </label>
          <input
            type="date"
            name="date"
            value={plan.date}
            onChange={handleChange}
            className="border rounded px-3 py-2 w-full"
            required
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1 flex items-center gap-1">
            Base / Location
          </label>
          <input
            type="text"
            name="base"
            value={plan.base}
            onChange={handleChange}
            className="border rounded px-3 py-2 w-full"
            placeholder="e.g. Camp Alpha"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm text-gray-700 mb-1 flex items-center gap-1">
            Menus (select multiple)
          </label>
          <Select
            isMulti
            options={menuOptions}
            onChange={(selectedOptions) =>
              setPlan({
                ...plan,
                menus: selectedOptions.map(opt => opt.value), // ✅ now using value which is _id
              })
            }
            value={menuOptions.filter((opt) => plan.menus.includes(opt.value))} // ✅ compare with opt.value
            className="react-select-container"
            classNamePrefix="react-select"
          />


        </div>

        <div className="md:col-span-2">
          <label className="block text-sm text-gray-700 mb-1 flex items-center gap-1">
            Notes (optional)
          </label>
          <textarea
            name="notes"
            value={plan.notes}
            onChange={handleChange}
            className="border rounded px-3 py-2 w-full"
            rows={3}
            placeholder="Additional instructions or reminders"
          />
        </div>
      </div>

      <div className="text-right mt-4">
        <button
          type="submit"
          className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
        >
          Save Plan
        </button>
      </div>
    </form>
  );
}
