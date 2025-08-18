
// --- InventoryTable.jsx (drop-in replacement) ---
import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function InventoryTable({ data = [], onEdit, onDelete }) {
  const getStatus = (qty) => {
    const n = Number(qty);
    if (!Number.isFinite(n) || n <= 0) return { label: "Out of Stock", color: "bg-rose-50 text-rose-700 border-rose-200" };
    if (n < 5) return { label: "Low Stock", color: "bg-amber-50 text-amber-700 border-amber-200" };
    return { label: "In Stock", color: "bg-emerald-50 text-emerald-700 border-emerald-200" };
  };

  const rowVariants = { hidden: { opacity: 0, y: 6 }, show: { opacity: 1, y: 0, transition: { duration: 0.25 } } };

  return (
    <motion.div className="bg-white/80 p-4 rounded-2xl shadow border border-gray-100" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Inventory Overview</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-700 sticky top-0 z-10">
            <tr className="border-y">
              {['Ingredient','Supplier','Qty','Unit','Date','Status','Actions'].map((h) => (
                <th key={h} className={`p-3 text-left ${h==='Actions' ? 'text-center' : ''}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence initial={false}>
              {data.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center p-6 text-gray-500">No inventory records found.</td>
                </tr>
              ) : (
                data.map((item, index) => {
                  const status = getStatus(item.quantity);
                  return (
                    <motion.tr key={item?._id || index} variants={rowVariants} initial="hidden" animate="show" exit={{ opacity: 0 }} className={`border-b transition ${index % 2 ? 'bg-gray-50' : 'bg-white'} hover:bg-rose-50`}>
                      <td className="p-3 whitespace-nowrap">{item.ingredientName || item.ingredientId}</td>
                      <td className="p-3 whitespace-nowrap">{item.supplier}</td>
                      <td className="p-3 whitespace-nowrap font-medium">{item.quantity}</td>
                      <td className="p-3 whitespace-nowrap">{item.unit}</td>
                      <td className="p-3 whitespace-nowrap">{item.date}</td>
                      <td className="p-3 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${status.color}`}>{status.label}</span>
                      </td>
                      <td className="p-3 whitespace-nowrap text-center">
                        <div className="inline-flex items-center gap-2">
                          <button onClick={() => onEdit?.(index)} className="p-2 rounded-lg text-sky-600 hover:text-sky-800 hover:bg-sky-50" title="Edit"><FaEdit /></button>
                          <button onClick={() => onDelete?.(index)} className="p-2 rounded-lg text-rose-600 hover:text-rose-800 hover:bg-rose-50" title="Delete"><FaTrash /></button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Mobile stacked cards */}
      <div className="mt-4 grid gap-3 sm:hidden">
        <AnimatePresence initial={false}>
          {data.length === 0 ? (
            <div className="text-center text-gray-500 py-6">No inventory records found.</div>
          ) : (
            data.map((item, index) => {
              const status = getStatus(item.quantity);
              return (
                <motion.div key={`card-${item?._id || index}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-gray-900">{item.ingredientName || item.ingredientId}</div>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${status.color}`}>{status.label}</span>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-gray-600">
                    <div><span className="text-gray-500">Supplier:</span> {item.supplier}</div>
                    <div><span className="text-gray-500">Qty:</span> {item.quantity}</div>
                    <div><span className="text-gray-500">Unit:</span> {item.unit}</div>
                    <div><span className="text-gray-500">Date:</span> {item.date}</div>
                  </div>
                  <div className="mt-3 flex items-center justify-end gap-2">
                    <button onClick={() => onEdit?.(index)} className="px-3 py-1.5 rounded-lg text-sky-600 hover:bg-sky-50 text-xs font-medium">Edit</button>
                    <button onClick={() => onDelete?.(index)} className="px-3 py-1.5 rounded-lg text-rose-600 hover:bg-rose-50 text-xs font-medium">Delete</button>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}