import React, { useState } from 'react';
import PlanningForm from '../features/planning/PlanningForm';
import PlanningTable from '../features/planning/PlanningTable';
import { FaFilter } from 'react-icons/fa';
import { usePlanning } from '../contexts/PlanningContext';
import { useMenus } from '../contexts/MenuContext';

export default function Planning() {
  const { plans, addPlan, editPlan, removePlan, loading } = usePlanning();
  const { menus } = useMenus();

  const [editIndex, setEditIndex] = useState(null);
  const [baseFilter, setBaseFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');

  const handleSave = (plan) => {
    if (editIndex !== null) {
      const existingPlan = plans[editIndex];
      editPlan(existingPlan._id, plan);
      setEditIndex(null);
    } else {
      addPlan(plan);
    }
  };

  const handleEdit = (index) => setEditIndex(index);

  const handleDelete = (index) => {
    const planToDelete = plans[index];
    if (planToDelete && planToDelete._id) removePlan(planToDelete._id);
  };

  const filteredPlans = plans.filter((p) =>
    (baseFilter === 'all' || p.base === baseFilter) &&
    (!dateFilter || p.date === dateFilter)
  );

  const uniqueBases = ['all', ...new Set(plans.map((p) => p.base))];

  return (
    <div className="p-6">
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
        menus={menus}
        onSubmit={handleSave}
        initialValues={editIndex !== null ? plans[editIndex] : null}
      />

      {/* Table */}
      <PlanningTable
        plans={filteredPlans}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
