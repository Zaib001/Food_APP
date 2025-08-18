import React, { useMemo, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductionTable({ data = [], onEdit, onDelete, recipesMap = {} }) {
  const [sortField, setSortField] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");

  const toggleSort = (field) => {
    if (sortField === field) setSortOrder((p) => (p === "asc" ? "desc" : "asc"));
    else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const sortedData = useMemo(() => {
    const copy = [...data];
    return copy.sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];
      if (valA === undefined || valA === null) return 1;
      if (valB === undefined || valB === null) return -1;
      if (sortOrder === "asc") return String(valA) > String(valB) ? 1 : -1;
      return String(valA) < String(valB) ? 1 : -1;
    });
  }, [data, sortField, sortOrder]);

  const getBadge = (qty) => {
    const n = Number(qty);
    if (n >= 100) return <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full text-xs">High</span>;
    if (n >= 50) return <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full text-xs">Medium</span>;
    return <span className="bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-full text-xs">Low</span>;
  };

  const headerCols = [
    { key: "date", label: "Date", sortable: true },
    { key: "recipeId", label: "Recipe" },
    { key: "quantity", label: "Quantity", sortable: true },
    { key: "base", label: "Base" },
    { key: "handler", label: "Handled By" },
    { key: "status", label: "Status" },
    { key: "actions", label: "Actions" },
  ];

  const sortIcon = (k) => (sortField === k ? (sortOrder === "asc" ? "▲" : "▼") : "");

  const rowVariants = { hidden: { opacity: 0, y: 6 }, show: { opacity: 1, y: 0, transition: { duration: 0.25 } } };

  return (
    <motion.div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-100 mt-6" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Production Logs</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-700 sticky top-0 z-10">
            <tr className="border-y">
              {headerCols.map((h) => (
                <th key={h.key} className={`p-3 ${h.key === 'actions' ? 'text-center' : 'text-left'}`}>
                  {h.sortable ? (
                    <button onClick={() => toggleSort(h.key)} className="inline-flex items-center gap-1">
                      {h.label} <span className="text-xs opacity-60">{sortIcon(h.key)}</span>
                    </button>
                  ) : (
                    h.label
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence initial={false}>
              {sortedData.length === 0 ? (
                <tr>
                  <td colSpan={headerCols.length} className="p-6 text-center text-gray-500">No production logs found.</td>
                </tr>
              ) : (
                sortedData.map((log, index) => (
                  <motion.tr key={log?._id || index} variants={rowVariants} initial="hidden" animate="show" exit={{ opacity: 0 }} className={`border-b transition ${index % 2 ? 'bg-gray-50' : 'bg-white'} hover:bg-rose-50`}>
                    <td className="p-3 whitespace-nowrap">{log.date}</td>
                    <td className="p-3 whitespace-nowrap text-gray-900">
                      {(() => {
                        const id = log.recipeId || log.recipe?._id || log.recipe;
                        const byMap = recipesMap && id ? recipesMap[id]?.name : null;
                        const fallback = typeof log.recipeId === 'object' && log.recipeId?.name ? log.recipeId.name : String(id || '—');
                        return byMap || fallback;
                      })()}
                    </td>
                    <td className="p-3 whitespace-nowrap font-medium">{log.quantity}</td>
                    <td className="p-3 whitespace-nowrap">{log.base}</td>
                    <td className="p-3 whitespace-nowrap">{log.handler}</td>
                    <td className="p-3 whitespace-nowrap">{getBadge(Number(log.quantity))}</td>
                    <td className="p-3 whitespace-nowrap text-center">
                      <div className="inline-flex items-center gap-2">
                        <button onClick={() => onEdit?.(index)} className="p-2 rounded-lg text-sky-600 hover:text-sky-800 hover:bg-sky-50" title="Edit"><FaEdit /></button>
                        <button onClick={() => onDelete?.(index)} className="p-2 rounded-lg text-rose-600 hover:text-rose-800 hover:bg-rose-50" title="Delete"><FaTrash /></button>
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
