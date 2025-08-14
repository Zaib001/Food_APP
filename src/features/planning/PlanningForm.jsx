import React, { useEffect, useMemo, useState } from 'react';
import Select from 'react-select';
import {
  FaClipboardList,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUtensils,
  FaStickyNote
} from 'react-icons/fa';

export default function PlanningForm({ menus = [], onSubmit, initialValues = null }) {
  const [plan, setPlan] = useState({
    date: '',
    base: '',
    // each block: { menu: <menuId>, qty: number }
    breakfast: { menu: null, qty: 0 },
    lunch:     { menu: null, qty: 0 },
    snack:     { menu: null, qty: 0 },
    dinner:    { menu: null, qty: 0 },
    extra:     { menu: null, qty: 0 },
    notes: ''
  });

  // Prefill on edit
  useEffect(() => {
    if (!initialValues) return;
    setPlan({
      date: initialValues.date || '',
      base: initialValues.base || '',
      breakfast: {
        menu: initialValues.breakfast?.menu?._id || initialValues.breakfast?.menu || null,
        qty:  Number(initialValues.breakfast?.qty ?? 0)
      },
      lunch: {
        menu: initialValues.lunch?.menu?._id || initialValues.lunch?.menu || null,
        qty:  Number(initialValues.lunch?.qty ?? 0)
      },
      snack: {
        menu: initialValues.snack?.menu?._id || initialValues.snack?.menu || null,
        qty:  Number(initialValues.snack?.qty ?? 0)
      },
      dinner: {
        menu: initialValues.dinner?.menu?._id || initialValues.dinner?.menu || null,
        qty:  Number(initialValues.dinner?.qty ?? 0)
      },
      extra: {
        menu: initialValues.extra?.menu?._id || initialValues.extra?.menu || null,
        qty:  Number(initialValues.extra?.qty ?? 0)
      },
      notes: initialValues.notes || ''
    });
  }, [initialValues]);

  const byTypeOptions = useMemo(() => {
    const make = (t) =>
      menus
        .filter(m => (m.mealType || '').toLowerCase() === t)
        .map(m => ({
          value: m._id,
          label: `${new Date(m.date).toDateString()} • ${t} • ${m.base}${m.menuName ? ' • ' + m.menuName : ''}`
        }));
    return {
      breakfast: make('breakfast'),
      lunch:     make('lunch'),
      snack:     make('snack'),
      dinner:    make('dinner'),
      extra:     make('extra'),
    };
  }, [menus]);

  const setMeal = (block, field, value) => {
    setPlan(prev => ({
      ...prev,
      [block]: {
        ...prev[block],
        [field]: field === 'qty' ? Number(value || 0) : value
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(plan);
    if (!initialValues) {
      setPlan({
        date: '',
        base: '',
        breakfast: { menu: null, qty: 0 },
        lunch:     { menu: null, qty: 0 },
        snack:     { menu: null, qty: 0 },
        dinner:    { menu: null, qty: 0 },
        extra:     { menu: null, qty: 0 },
        notes: ''
      });
    }
  };

  const MealRow = ({ title, block }) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      <div className="md:col-span-2">
        <label className="block text-sm text-gray-700 mb-1">{title} Menu</label>
        <Select
          options={byTypeOptions[block]}
          value={byTypeOptions[block].find(o => o.value === plan[block].menu) || null}
          onChange={(opt) => setMeal(block, 'menu', opt ? opt.value : null)}
          placeholder={`Select ${title.toLowerCase()} menu`}
        />
      </div>
      <div>
        <label className="block text-sm text-gray-700 mb-1">Quantity</label>
        <input
          type="number"
          min="0"
          value={plan[block].qty}
          onChange={(e) => setMeal(block, 'qty', e.target.value)}
          className="border rounded px-3 py-2 w-full"
          placeholder="e.g. 50"
        />
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow mb-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
        <FaClipboardList /> {initialValues ? 'Edit Plan' : 'Create a New Plan'}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm text-gray-700 mb-1 flex items-center gap-1">
            <FaCalendarAlt /> Date
          </label>
          <input
            type="date"
            value={plan.date}
            onChange={(e) => setPlan(prev => ({ ...prev, date: e.target.value }))}
            className="border rounded px-3 py-2 w-full"
            required
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1 flex items-center gap-1">
            <FaMapMarkerAlt /> Base / Location
          </label>
          <input
            type="text"
            value={plan.base}
            onChange={(e) => setPlan(prev => ({ ...prev, base: e.target.value }))}
            className="border rounded px-3 py-2 w-full"
            placeholder="e.g. Camp Alpha"
            required
          />
        </div>
      </div>

      <div className="space-y-4">
        <MealRow title="Breakfast" block="breakfast" />
        <MealRow title="Lunch"     block="lunch" />
        <MealRow title="Snack"     block="snack" />
        <MealRow title="Dinner"    block="dinner" />
        <MealRow title="Extra"     block="extra" />
      </div>

      <div className="mt-4">
        <label className="block text-sm text-gray-700 mb-1 flex items-center gap-1">
          <FaStickyNote /> Notes (optional)
        </label>
        <textarea
          value={plan.notes}
          onChange={(e) => setPlan(prev => ({ ...prev, notes: e.target.value }))}
          className="border rounded px-3 py-2 w-full"
          rows={3}
          placeholder="Additional instructions or reminders"
        />
      </div>

      <div className="text-right mt-4">
        <button
          type="submit"
          className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
        >
          {initialValues ? 'Update Plan' : 'Save Plan'}
        </button>
      </div>
    </form>
  );
}
