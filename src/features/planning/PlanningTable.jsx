import { motion,AnimatePresence } from 'framer-motion';
import React from 'react';
import { FaTrash, FaEdit, FaCalendarAlt, FaMapMarkerAlt, FaUtensils } from 'react-icons/fa';
export default function PlanningTable({ plans = [], menus = [], onEdit, onDelete }) {
  const role = (JSON.parse(localStorage.getItem("user") || "{}")?.role ?? "user") || "user";
  const canEdit = ["planner", "admin"].includes(role);
  const canDelete = role === "admin";

  const getMenuLabelById = (menuId) => {
    const menu = menus.find((m) => m._id === menuId);
    if (!menu) return "Unknown";
    const name = menu.menuName ? ` • ${menu.menuName}` : "";
    return `${new Date(menu.date).toDateString()} • ${menu.mealType} • ${menu.base}${name}`;
  };

  const labelMealBlock = (block) => {
    if (!block || !block.menu) return "—";
    const m = block.menu; // populated Menu
    const name = m.menuName ? ` • ${m.menuName}` : "";
    const qty = Number(block.qty || 0);
    return `${new Date(m.date).toDateString()} • ${m.mealType} • ${m.base}${name}  (Qty: ${qty})`;
  };

  const isNewSchema = (p) => p && (p.breakfast || p.lunch || p.snack || p.dinner || p.extra);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="bg-white/80 shadow-xl rounded-2xl p-6 border border-gray-100"
    >
      <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-700">
        <FaCalendarAlt /> Planned Production
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-700">
            {plans.length > 0 && isNewSchema(plans[0]) ? (
              <tr className="border-y">
                <th className="p-3">Date</th>
                <th className="p-3">Base</th>
                <th className="p-3">Breakfast</th>
                <th className="p-3">Lunch</th>
                <th className="p-3">Snack</th>
                <th className="p-3">Dinner</th>
                <th className="p-3">Extra</th>
                <th className="p-3">Notes</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            ) : (
              <tr className="border-y">
                <th className="p-3">Date</th>
                <th className="p-3">Base</th>
                <th className="p-3">Menus</th>
                <th className="p-3">Notes</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            )}
          </thead>

          <tbody>
            <AnimatePresence>
              {(plans || []).map((plan, index) => {
                const newShape = isNewSchema(plan);
                return (
                  <motion.tr
                    key={plan?._id || index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`border-b transition ${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-rose-50`}
                  >
                    <td className="p-3">{plan?.date || "—"}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <FaMapMarkerAlt className="text-gray-500" />
                        {plan?.base || "—"}
                      </div>
                    </td>

                    {newShape ? (
                      <>
                        <td className="p-3"><div className="flex items-start gap-2"><FaUtensils className="text-rose-600 mt-1" /><span>{labelMealBlock(plan.breakfast)}</span></div></td>
                        <td className="p-3"><div className="flex items-start gap-2"><FaUtensils className="text-rose-600 mt-1" /><span>{labelMealBlock(plan.lunch)}</span></div></td>
                        <td className="p-3"><div className="flex items-start gap-2"><FaUtensils className="text-rose-600 mt-1" /><span>{labelMealBlock(plan.snack)}</span></div></td>
                        <td className="p-3"><div className="flex items-start gap-2"><FaUtensils className="text-rose-600 mt-1" /><span>{labelMealBlock(plan.dinner)}</span></div></td>
                        <td className="p-3"><div className="flex items-start gap-2"><FaUtensils className="text-rose-600 mt-1" /><span>{labelMealBlock(plan.extra)}</span></div></td>
                        <td className="p-3">{plan?.notes || "—"}</td>
                      </>
                    ) : (
                      <>
                        <td className="p-3 text-sm space-y-1">
                          {(plan?.menus || []).map((menuId, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <FaUtensils className="text-rose-600" />
                              <span>{getMenuLabelById(menuId)}</span>
                            </div>
                          ))}
                        </td>
                        <td className="p-3">{plan?.notes || "—"}</td>
                      </>
                    )}

                    <td className="p-3 text-center">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => canEdit && onEdit(index)}
                          className={`p-2 rounded-lg ${
                            canEdit
                              ? "text-sky-600 hover:text-sky-800 hover:bg-sky-50"
                              : "text-gray-300 cursor-not-allowed"
                          }`}
                          disabled={!canEdit}
                          title={canEdit ? "Edit" : "Only planners/admins can edit"}
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => canDelete && onDelete(index)}
                          className={`p-2 rounded-lg ${
                            canDelete
                              ? "text-rose-600 hover:text-rose-800 hover:bg-rose-50"
                              : "text-gray-300 cursor-not-allowed"
                          }`}
                          disabled={!canDelete}
                          title={canDelete ? "Delete" : "Only admins can delete"}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}

              {(plans || []).length === 0 && (
                <tr>
                  <td colSpan="9" className="text-center text-gray-400 p-6">
                    No plans found.
                  </td>
                </tr>
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
