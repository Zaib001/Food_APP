import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaEdit, FaTrash } from "react-icons/fa";

export function IngredientTable({ ingredients = [], onEdit, onDelete }) {
  if (!Array.isArray(ingredients)) {
    return <div className="text-rose-600 p-4">Invalid ingredient data.</div>;
  }

  return (
    <motion.div
      className="bg-white/80 shadow-xl rounded-2xl p-6 border border-gray-100 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-xl font-bold mb-4 text-gray-800">Ingredient List</h2>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-700 font-semibold">
            <tr className="border-y">
              {[
                "Name",
                "Purchase Qty",
                "Purchase Unit",
                "Original Unit",
                "Price/Unit",
                "Price/Base Unit",
                "Yield",
                "Standard Wt",
                "KCAL",
                "Category",
                "Warehouse",
                "Actions",
              ].map((h) => (
                <th key={h} className="p-3 whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {ingredients.length === 0 ? (
                <tr>
                  <td colSpan={12} className="p-6 text-center text-gray-500">
                    No ingredients available.
                  </td>
                </tr>
              ) : (
                ingredients.map((ing, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`transition duration-200 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-rose-50 border-b`}
                  >
                    <td className="p-3 whitespace-nowrap">{ing.name}</td>
                    <td className="p-3 whitespace-nowrap">{ing.purchaseQuantity}</td>
                    <td className="p-3 whitespace-nowrap">{ing.purchaseUnit}</td>
                    <td className="p-3 whitespace-nowrap">{ing.originalUnit}</td>
                    <td className="p-3 whitespace-nowrap">${Number(ing.originalPrice).toFixed(2)}</td>
                    <td className="p-3 whitespace-nowrap">${Number(ing.pricePerKg).toFixed(2)}</td>
                    <td className="p-3 whitespace-nowrap">{ing.yield}%</td>
                    <td className="p-3 whitespace-nowrap">{ing.standardWeight || "-"}</td>
                    <td className="p-3 whitespace-nowrap">{ing.kcal}</td>
                    <td className="p-3 whitespace-nowrap capitalize">{ing.category || "-"}</td>
                    <td className="p-3 whitespace-nowrap">{ing.warehouse || "-"}</td>
                    <td className="p-3 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <button onClick={() => onEdit(index)} className="text-sky-600 hover:text-sky-800" title="Edit">
                          <FaEdit />
                        </button>
                        <button onClick={() => onDelete(index)} className="text-rose-600 hover:text-rose-800" title="Delete">
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}