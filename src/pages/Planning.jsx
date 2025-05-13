import React, { useState } from 'react';
import PlanningForm from '../features/planning/PlanningForm';
import PlanningTable from '../features/planning/PlanningTable';
import { FaFilter, FaPlusCircle } from 'react-icons/fa';

// Sample menus (replace with real data or API)
const sampleMenus = [
  { date: '2025-05-10', mealType: 'dinner', base: 'Camp A' },
  { date: '2025-05-10', mealType: 'lunch', base: 'Camp A' },
  { date: '2025-05-11', mealType: 'breakfast', base: 'Camp B' },
  { date: '2025-05-12', mealType: 'snack', base: 'Camp A' },
];

export default function Planning() {
  const [plans, setPlans] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [baseFilter, setBaseFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');

  const handleSave = (plan) => {
    if (editIndex !== null) {
      const updated = [...plans];
      updated[editIndex] = plan;
      setPlans(updated);
      setEditIndex(null);
    } else {
      setPlans((prev) => [...prev, plan]);
    }
  };

  const handleEdit = (index) => setEditIndex(index);
  const handleDelete = (index) => {
    const copy = [...plans];
    copy.splice(index, 1);
    setPlans(copy);
  };

  const filteredPlans = plans.filter((p) =>
    (baseFilter === 'all' || p.base === baseFilter) &&
    (!dateFilter || p.date === dateFilter)
  );

  const uniqueBases = ['all', ...new Set(plans.map((p) => p.base))];

  return (
    <div className="p-6">
      {/* <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <FaPlusCircle /> Planning
      </h1> */}

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center gap-2">
          <FaFilter className="text-gray-600" />
          <select
            value={baseFilter}
            onChange={(e) => setBaseFilter(e.target.value)}
            className="border px-3 py-2 rounded text-sm"
          >
            {uniqueBases.map((base, i) => (
              <option key={i} value={base}>
                {base === 'all' ? 'All Bases' : base}
              </option>
            ))}
          </select>
        </div>

        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="border px-3 py-2 rounded text-sm"
        />
      </div>

      {/* Form */}
      <PlanningForm
        menus={sampleMenus}
        onSubmit={handleSave}
        initialValues={editIndex !== null ? plans[editIndex] : null}
      />

      {/* Table */}
      <PlanningTable
        plans={filteredPlans}
        menus={sampleMenus}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
