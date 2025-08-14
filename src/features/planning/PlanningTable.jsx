import React from 'react';
import { FaTrash, FaEdit, FaCalendarAlt, FaMapMarkerAlt, FaUtensils } from 'react-icons/fa';

export default function PlanningTable({ plans = [], menus = [], onEdit, onDelete }) {
  // Fallback label for old schema (plan.menus = [menuIds])
  const getMenuLabelById = (menuId) => {
    const menu = menus.find((m) => m._id === menuId);
    if (!menu) return 'Unknown';
    const name = menu.menuName ? ` • ${menu.menuName}` : '';
    return `${new Date(menu.date).toDateString()} • ${menu.mealType} • ${menu.base}${name}`;
  };

  // New schema label (populated object + qty)
  const labelMealBlock = (block) => {
    if (!block || !block.menu) return '—';
    const m = block.menu; // populated Menu
    const name = m.menuName ? ` • ${m.menuName}` : '';
    const qty = Number(block.qty || 0);
    return `${new Date(m.date).toDateString()} • ${m.mealType} • ${m.base}${name}  (Qty: ${qty})`;
  };

  const isNewSchema = (p) =>
    p && (p.breakfast || p.lunch || p.snack || p.dinner || p.extra);

  return (
    <div className="bg-white shadow rounded-xl p-6">
      <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-700">
        <FaCalendarAlt /> Planned Production
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border border-gray-200">
          <thead className="bg-gray-100 text-gray-700">
            {plans.length > 0 && isNewSchema(plans[0]) ? (
              <tr>
                <th className="p-3 border-b">Date</th>
                <th className="p-3 border-b">Base</th>
                <th className="p-3 border-b">Breakfast</th>
                <th className="p-3 border-b">Lunch</th>
                <th className="p-3 border-b">Snack</th>
                <th className="p-3 border-b">Dinner</th>
                <th className="p-3 border-b">Extra</th>
                <th className="p-3 border-b">Notes</th>
                <th className="p-3 border-b text-center">Actions</th>
              </tr>
            ) : (
              <tr>
                <th className="p-3 border-b">Date</th>
                <th className="p-3 border-b">Base</th>
                <th className="p-3 border-b">Menus</th>
                <th className="p-3 border-b">Notes</th>
                <th className="p-3 border-b text-center">Actions</th>
              </tr>
            )}
          </thead>

          <tbody>
            {(plans || []).map((plan, index) => {
              const newShape = isNewSchema(plan);

              return (
                <tr key={plan?._id || index} className="border-b hover:bg-gray-50 transition">
                  <td className="p-3">{plan?.date || '—'}</td>
                  <td className="p-3 flex items-center gap-2">
                    <FaMapMarkerAlt className="text-gray-500" />
                    {plan?.base || '—'}
                  </td>

                  {newShape ? (
                    <>
                      <td className="p-3"><div className="flex items-start gap-2"><FaUtensils className="text-red-500 mt-1" /><span>{labelMealBlock(plan.breakfast)}</span></div></td>
                      <td className="p-3"><div className="flex items-start gap-2"><FaUtensils className="text-red-500 mt-1" /><span>{labelMealBlock(plan.lunch)}</span></div></td>
                      <td className="p-3"><div className="flex items-start gap-2"><FaUtensils className="text-red-500 mt-1" /><span>{labelMealBlock(plan.snack)}</span></div></td>
                      <td className="p-3"><div className="flex items-start gap-2"><FaUtensils className="text-red-500 mt-1" /><span>{labelMealBlock(plan.dinner)}</span></div></td>
                      <td className="p-3"><div className="flex items-start gap-2"><FaUtensils className="text-red-500 mt-1" /><span>{labelMealBlock(plan.extra)}</span></div></td>
                      <td className="p-3">{plan?.notes || '—'}</td>
                    </>
                  ) : (
                    <>
                      <td className="p-3 text-sm space-y-1">
                        {(plan?.menus || []).map((menuId, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <FaUtensils className="text-red-500" />
                            <span>{getMenuLabelById(menuId)}</span>
                          </div>
                        ))}
                      </td>
                      <td className="p-3">{plan?.notes || '—'}</td>
                    </>
                  )}

                  <td className="p-3 text-center space-x-2">
                    <button onClick={() => onEdit(index)} className="text-blue-600 hover:text-blue-800">
                      <FaEdit />
                    </button>
                    <button onClick={() => onDelete(index)} className="text-red-600 hover:text-red-800">
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              );
            })}

            {(plans || []).length === 0 && (
              <tr>
                <td colSpan="9" className="text-center text-gray-400 p-4">No plans found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
