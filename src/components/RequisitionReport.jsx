import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown, FaChevronRight, FaTruck, FaCalendarDay } from "react-icons/fa";

const fmtQty = (n) => {
  const v = Number(n);
  if (!Number.isFinite(v)) return "0";
  // avoid too many decimals for whole numbers
  return Number.isInteger(v) ? v.toString() : v.toFixed(2);
};

function groupBySupplierAndDate(rows = []) {
  // supplier -> date -> items[]
  const map = new Map();
  for (const r of rows) {
    const supplier = r.supplier || "Unknown";
    const date = r.date || "—";
    if (!map.has(supplier)) map.set(supplier, new Map());
    const dm = map.get(supplier);
    if (!dm.has(date)) dm.set(date, []);
    dm.get(date).push(r);
  }
  // sort supplier asc, date asc
  const suppliers = [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  return suppliers.map(([supplier, dateMap]) => {
    const dates = [...dateMap.entries()].sort((a, b) => a[0].localeCompare(b[0]));
    return { supplier, dates };
  });
}

export default function RequisitionReport({ data = [], title = "Requisitions Report" }) {
  // local expand/collapse per supplier
  const [openSuppliers, setOpenSuppliers] = useState(() => new Set());

  const grouped = useMemo(() => groupBySupplierAndDate(data), [data]);

  const totals = useMemo(() => {
    // total quantity & count
    const grandQty = data.reduce((s, r) => s + Number(r.quantity || 0), 0);
    return { grandQty, count: data.length };
  }, [data]);

  const section = {
    hidden: { opacity: 0, y: 8 },
    show: { opacity: 1, y: 0, transition: { duration: 0.25 } },
  };

  if (!data.length) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white/80 shadow-sm p-6 text-center text-gray-600">
        No requisitions match your filters.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-white/80 shadow-sm">
      {/* Header / summary bar */}
      <div className="sticky top-0 z-10 px-4 sm:px-6 py-4 border-b bg-white/90 backdrop-blur rounded-t-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="text-gray-900">
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-xs text-gray-500">
              Grouped by Supplier → Date • {grouped.length} supplier(s), {totals.count} line(s), total qty:{" "}
              <span className="font-semibold">{fmtQty(totals.grandQty)}</span>
            </p>
          </div>
          <div className="text-xs text-gray-500">
            Tip: Click a supplier row to expand/collapse its dates.
          </div>
        </div>
      </div>

      <div className="divide-y">
        {grouped.map(({ supplier, dates }) => {
          const supplierQty = dates.reduce(
            (s, [, items]) => s + items.reduce((ss, r) => ss + Number(r.quantity || 0), 0),
            0
          );
          const isOpen = openSuppliers.has(supplier);
          return (
            <div key={supplier}>
              {/* Supplier header row */}
              <button
                className="w-full text-left px-4 sm:px-6 py-4 bg-white hover:bg-gray-50 transition-colors"
                onClick={() => {
                  const next = new Set(openSuppliers);
                  if (next.has(supplier)) next.delete(supplier);
                  else next.add(supplier);
                  setOpenSuppliers(next);
                }}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="text-rose-600">
                      {isOpen ? <FaChevronDown /> : <FaChevronRight />}
                    </div>
                    <div className="flex items-center gap-2 text-gray-900">
                      <FaTruck className="text-rose-600" />
                      <span className="font-semibold">{supplier}</span>
                      <span className="text-xs text-gray-500">
                        ({dates.length} date{dates.length > 1 ? "s" : ""})
                      </span>
                    </div>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-500">Supplier total qty:</span>{" "}
                    <span className="font-semibold">{fmtQty(supplierQty)}</span>
                  </div>
                </div>
              </button>

              {/* Dates list (expand) */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    variants={section}
                    initial="hidden"
                    animate="show"
                    exit={{ opacity: 0, y: -6 }}
                    className="bg-white/60"
                  >
                    {dates.map(([date, rows]) => {
                      const dateQty = rows.reduce((s, r) => s + Number(r.quantity || 0), 0);
                      return (
                        <div key={`${supplier}_${date}`} className="border-t">
                          {/* Date header */}
                          <div className="px-4 sm:px-6 py-3 bg-gray-50/60 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-gray-700">
                              <FaCalendarDay className="text-gray-500" />
                              <span className="font-medium">
                                {new Date(date).toString() !== "Invalid Date" ? new Date(date).toLocaleDateString() : date}
                              </span>
                            </div>
                            <div className="text-sm">
                              <span className="text-gray-500">Date total qty:</span>{" "}
                              <span className="font-semibold">{fmtQty(dateQty)}</span>
                            </div>
                          </div>

                          {/* Table */}
                          <div className="overflow-x-auto">
                            <table className="min-w-full text-sm">
                              <thead className="bg-white">
                                <tr className="text-left border-b">
                                  <th className="px-4 py-2">Item</th>
                                  <th className="px-4 py-2">Qty</th>
                                  <th className="px-4 py-2">Unit</th>
                                  <th className="px-4 py-2">Base</th>
                                  <th className="px-4 py-2">Requested By</th>
                                  <th className="px-4 py-2">Status</th>
                                </tr>
                              </thead>
                              <tbody>
                                {rows.map((r) => (
                                  <tr key={r._id} className="border-b last:border-0">
                                    <td className="px-4 py-2 font-medium text-gray-900">{r.item || "—"}</td>
                                    <td className="px-4 py-2 tabular-nums">{fmtQty(r.quantity)}</td>
                                    <td className="px-4 py-2">{r.unit || "—"}</td>
                                    <td className="px-4 py-2">{r.base || "—"}</td>
                                    <td className="px-4 py-2">{r.requestedBy || "—"}</td>
                                    <td className="px-4 py-2">
                                      <span
                                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs border ${
                                          (r.status || "").toLowerCase() === "approved"
                                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                            : (r.status || "").toLowerCase() === "completed"
                                            ? "bg-sky-50 text-sky-700 border-sky-200"
                                            : "bg-amber-50 text-amber-700 border-amber-200"
                                        }`}
                                      >
                                        {r.status || "pending"}
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                                {/* date subtotal row */}
                                <tr className="bg-gray-50/70">
                                  <td className="px-4 py-2 font-semibold text-gray-700" colSpan={1}>
                                    Subtotal
                                  </td>
                                  <td className="px-4 py-2 font-semibold">{fmtQty(dateQty)}</td>
                                  <td className="px-4 py-2" colSpan={4} />
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Grand total footer */}
      <div className="px-4 sm:px-6 py-4 border-t bg-white/90 rounded-b-2xl flex items-center justify-between">
        <div className="text-sm text-gray-500">
          {grouped.length} supplier group{grouped.length > 1 ? "s" : ""} • {totals.count} line item
          {totals.count > 1 ? "s" : ""}.
        </div>
        <div className="text-sm">
          <span className="text-gray-500">Grand total qty:</span>{" "}
          <span className="font-semibold">{fmtQty(totals.grandQty)}</span>
        </div>
      </div>
    </div>
  );
}
