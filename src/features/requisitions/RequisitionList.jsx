import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaEdit, FaTrash } from "react-icons/fa";

/**
 * Drop-in replacement for your existing RequisitionList.
 * Props are unchanged: { data, onEdit, onDelete }
 */
export default function RequisitionList({ data = [], onEdit, onDelete }) {
  const statusPill = (status) => {
    const s = String(status || "").toLowerCase();
    const map = {
      pending: "bg-amber-50 text-amber-700 border-amber-200",
      approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
      completed: "bg-sky-50 text-sky-700 border-sky-200",
    };
    const cls = map[s] || "bg-gray-50 text-gray-700 border-gray-200";
    const label = s ? s.charAt(0).toUpperCase() + s.slice(1) : "—";
    return <span className={`inline-flex items-center px-2 py-0.5 text-xs rounded-full border ${cls}`}>{label}</span>;
  };

  const header = [
    { key: "date", label: "Date" },
    { key: "requestedBy", label: "Requested By" },
    { key: "item", label: "Item" },
    { key: "quantity", label: "Qty" },
    { key: "unit", label: "Unit" },
    { key: "supplier", label: "Supplier" },
    { key: "status", label: "Status" },
    { key: "actions", label: "Actions", align: "center" },
  ];

  const rowVariants = {
    hidden: { opacity: 0, y: 8 },
    show: { opacity: 1, y: 0, transition: { duration: 0.25 } },
    exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
  };

  return (
    <motion.div
      className="bg-white/80 rounded-2xl shadow p-4 border border-gray-100"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-gray-800">Requisition List</h2>
        <span className="text-xs text-gray-500">{data?.length || 0} items</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left sticky top-0 z-10">
            <tr className="border-y">
              {header.map((h) => (
                <th key={h.key} className={`p-3 whitespace-nowrap ${h.align === "center" ? "text-center" : "text-left"}`}>
                  {h.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            <AnimatePresence initial={false}>
              {(data || []).length === 0 ? (
                <tr>
                  <td colSpan={header.length} className="p-6 text-center text-gray-500">
                    No requisitions found.
                  </td>
                </tr>
              ) : (
                data.map((req, idx) => (
                  <motion.tr
                    key={req?._id || idx}
                    variants={rowVariants}
                    initial="hidden"
                    animate="show"
                    exit="exit"
                    className={`border-b transition ${idx % 2 ? "bg-gray-50" : "bg-white"} hover:bg-rose-50`}
                  >
                    <td className="p-3 whitespace-nowrap">{req?.date || "—"}</td>
                    <td className="p-3 whitespace-nowrap">{req?.requestedBy || "—"}</td>
                    <td className="p-3 whitespace-nowrap text-gray-900">{req?.item || "—"}</td>
                    <td className="p-3 whitespace-nowrap">{req?.quantity ?? "—"}</td>
                    <td className="p-3 whitespace-nowrap">{req?.unit || "—"}</td>
                    <td className="p-3 whitespace-nowrap">{req?.supplier || "—"}</td>
                    <td className="p-3 whitespace-nowrap">{statusPill(req?.status)}</td>
                    <td className="p-3 whitespace-nowrap">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => onEdit?.(idx)}
                          className="p-2 rounded-lg text-sky-600 hover:text-sky-800 hover:bg-sky-50"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => onDelete?.(idx)}
                          className="p-2 rounded-lg text-rose-600 hover:text-rose-800 hover:bg-rose-50"
                          title="Delete"
                        >
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

      {/* Mobile stacked cards */}
      <div className="mt-4 grid gap-3 sm:hidden">
        <AnimatePresence initial={false}>
          {(data || []).length === 0 ? (
            <div className="text-center text-gray-500 py-6">No requisitions found.</div>
          ) : (
            data.map((req, idx) => (
              <motion.div
                key={`card-${req?._id || idx}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="rounded-xl border border-gray-100 bg-white p-3 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-gray-900">{req?.item || "—"}</div>
                  {statusPill(req?.status)}
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-gray-600">
                  <div><span className="text-gray-500">Date:</span> {req?.date || "—"}</div>
                  <div><span className="text-gray-500">Supplier:</span> {req?.supplier || "—"}</div>
                  <div><span className="text-gray-500">Qty:</span> {req?.quantity ?? "—"}</div>
                  <div><span className="text-gray-500">Unit:</span> {req?.unit || "—"}</div>
                  <div className="col-span-2"><span className="text-gray-500">Requested By:</span> {req?.requestedBy || "—"}</div>
                </div>
                <div className="mt-3 flex items-center justify-end gap-2">
                  <button onClick={() => onEdit?.(idx)} className="px-3 py-1.5 rounded-lg text-sky-600 hover:bg-sky-50 text-xs font-medium">Edit</button>
                  <button onClick={() => onDelete?.(idx)} className="px-3 py-1.5 rounded-lg text-rose-600 hover:bg-rose-50 text-xs font-medium">Delete</button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
