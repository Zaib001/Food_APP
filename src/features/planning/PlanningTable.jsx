import React from 'react';
import { FaTrash, FaEdit, FaCalendarAlt, FaMapMarkerAlt, FaUtensils } from 'react-icons/fa';

export default function PlanningTable({ plans = [], menus = [], onEdit, onDelete }) {
  const getMenuLabel = (index) => {
    const menu = menus[index];
    if (!menu) return 'Unknown';
    return `${new Date(menu.date).toDateString()} – ${menu.mealType} @ ${menu.base}`;
  };

  return (
    <div className="bg-white shadow rounded-xl p-6">
      <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-700">
        <FaCalendarAlt /> Planned Production
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border border-gray-200">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3 border-b">Date</th>
              <th className="p-3 border-b">Base</th>
              <th className="p-3 border-b">Menus</th>
              <th className="p-3 border-b">Notes</th>
              <th className="p-3 border-b text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {plans.map((plan, index) => (
              <tr
                key={index}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="p-3">{plan.date}</td>
                <td className="p-3 flex items-center gap-2">
                  <FaMapMarkerAlt className="text-gray-500" />
                  {plan.base}
                </td>
                <td className="p-3 text-sm space-y-1">
                  {plan.menus.map((menuIndex, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <FaUtensils className="text-red-500" />
                      <span>{getMenuLabel(menuIndex)}</span>
                    </div>
                  ))}
                </td>
                <td className="p-3">{plan.notes}</td>
                <td className="p-3 text-center space-x-2">
                  <button onClick={() => onEdit(index)} className="text-blue-600 hover:text-blue-800">
                    <FaEdit />
                  </button>
                  <button onClick={() => onDelete(index)} className="text-red-600 hover:text-red-800">
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
            {plans.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center text-gray-400 p-4">No plans found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
