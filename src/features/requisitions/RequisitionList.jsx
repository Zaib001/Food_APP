import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaEdit, FaTrash, FaCheckCircle } from "react-icons/fa";

/**
 * Props:
 * - data: array
 * - onEdit(index)
 * - onDelete(index)
 * - onComplete?(requisition)
 */
export default function RequisitionList({ data = [], onEdit, onDelete, onComplete }) {
  const statusPill = (status) => {
    const s = String(status || "").toLowerCase();
    const map = {
      pending: "bg-amber-50 text-amber-700 border-amber-200",
      approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
      completed: "bg-sky-50 text-sky-700 border-sky-200",
    };
    const cls = map[s] || "bg-gray-50 text-gray-700 border-gray-200";
    const label = s ? s.charAt(0).toUpperCase() + s.slice(1) : "—";
    return (
      <span className={`inline-flex items-center px-2 py-0.5 text-xs rounded-full border ${cls}`}>
        {label}
      </span>
    );
  };

  // Detect whether to show amount columns (optional)
  const hasAmounts = (data || []).some(
    (r) =>
      typeof r.receivedQty === "number" ||
      typeof r.unitPrice === "number" ||
      typeof r.lineTotal === "number"
  );

  const fmt2 = (n) =>
    typeof n === "number" && !Number.isNaN(n) ? n.toFixed(2) : n === 0 ? "0.00" : "—";

  const deriveLineTotal = (r, q) => {
    if (typeof r.lineTotal === "number") return r.lineTotal;
    if (typeof q === "number" && typeof r.unitPrice === "number") return q * r.unitPrice;
    return undefined;
  };

  const baseHeader = [
    { key: "date", label: "Date" },
    { key: "requestedBy", label: "Requested By" },
    { key: "item", label: "Item" },
    { key: "quantity", label: "Qty" },
    { key: "unit", label: "Unit" },
    { key: "supplier", label: "Supplier" },
    ...(hasAmounts
      ? [
          { key: "receivedQty", label: "Recv Qty" },
          { key: "unitPrice", label: "Unit Price" },
          { key: "lineTotal", label: "Line Total" },
        ]
      : []),
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
              {baseHeader.map((h) => (
                <th
                  key={h.key}
                  className={`p-3 whitespace-nowrap ${
                    h.align === "center" ? "text-center" : "text-left"
                  }`}
                >
                  {h.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            <AnimatePresence initial={false}>
              {(data || []).length === 0 ? (
                <tr>
                  <td colSpan={baseHeader.length} className="p-6 text-center text-gray-500">
                    No requisitions found.
                  </td>
                </tr>
              ) : (
                data.map((req, idx) => {
                  const first = req?.items?.[0] || {};
                  const item = req.item ?? first.item;
                  const quantity = req.quantity ?? first.quantity;
                  const unit = req.unit ?? first.unit;
                  const supplier = req.supplier ?? first.supplier;

                  const canComplete =
                    typeof onComplete === "function" && req?.status !== "completed";
                  const lineTotal = deriveLineTotal(req, quantity);

                  return (
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
                      <td className="p-3 whitespace-nowrap text-gray-900">{item || "—"}</td>
                      <td className="p-3 whitespace-nowrap">{quantity ?? "—"}</td>
                      <td className="p-3 whitespace-nowrap">{unit || "—"}</td>
                      <td className="p-3 whitespace-nowrap">{supplier || "—"}</td>

                      {hasAmounts && (
                        <>
                          <td className="p-3 whitespace-nowrap">
                            {typeof req?.receivedQty === "number" ? req.receivedQty : "—"}
                          </td>
                          <td className="p-3 whitespace-nowrap">{fmt2(req?.unitPrice)}</td>
                          <td className="p-3 whitespace-nowrap font-medium">{fmt2(lineTotal)}</td>
                        </>
                      )}

                      <td className="p-3 whitespace-nowrap">{statusPill(req?.status)}</td>
                      <td className="p-3 whitespace-nowrap">
                        <div className="flex items-center justify-center gap-2">
                          {canComplete && (
                            <button
                              onClick={() => onComplete?.(req)}
                              className="px-2 py-1.5 rounded-lg text-emerald-700 border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-xs font-medium inline-flex items-center gap-1"
                              title="Complete (enter amounts)"
                            >
                              <FaCheckCircle /> Complete
                            </button>
                          )}
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
          {(data || []).length === 0 ? (
            <div className="text-center text-gray-500 py-6">No requisitions found.</div>
          ) : (
            data.map((req, idx) => {
              const first = req?.items?.[0] || {};
              const item = req.item ?? first.item;
              const quantity = req.quantity ?? first.quantity;
              const unit = req.unit ?? first.unit;
              const supplier = req.supplier ?? first.supplier;

              const canComplete =
                typeof onComplete === "function" && req?.status !== "completed";
              const lineTotal = deriveLineTotal(req, quantity);

              return (
                <motion.div
                  key={`card-${req?._id || idx}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="rounded-xl border border-gray-100 bg-white p-3 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-gray-900">{item || "—"}</div>
                    {statusPill(req?.status)}
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-gray-600">
                    <div><span className="text-gray-500">Date:</span> {req?.date || "—"}</div>
                    <div><span className="text-gray-500">Supplier:</span> {supplier || "—"}</div>
                    <div><span className="text-gray-500">Qty:</span> {quantity ?? "—"}</div>
                    <div><span className="text-gray-500">Unit:</span> {unit || "—"}</div>
                    {hasAmounts && (
                      <>
                        <div><span className="text-gray-500">Recv Qty:</span> {typeof req?.receivedQty === "number" ? req.receivedQty : "—"}</div>
                        <div><span className="text-gray-500">Unit Price:</span> {fmt2(req?.unitPrice)}</div>
                        <div className="col-span-2">
                          <span className="text-gray-500">Line Total:</span> <strong>{fmt2(lineTotal)}</strong>
                        </div>
                      </>
                    )}
                    <div className="col-span-2">
                      <span className="text-gray-500">Requested By:</span> {req?.requestedBy || "—"}
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-end gap-2">
                    {canComplete && (
                      <button
                        onClick={() => onComplete?.(req)}
                        className="px-3 py-1.5 rounded-lg text-emerald-700 border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-xs font-medium inline-flex items-center gap-1"
                      >
                        <FaCheckCircle /> Complete
                      </button>
                    )}
                    <button
                      onClick={() => onEdit?.(idx)}
                      className="px-3 py-1.5 rounded-lg text-sky-600 hover:bg-sky-50 text-xs font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete?.(idx)}
                      className="px-3 py-1.5 rounded-lg text-rose-600 hover:bg-rose-50 text-xs font-medium"
                    >
                      Delete
                    </button>
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
