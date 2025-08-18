// src/pages/Requisitions.jsx (Polished UI)
import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import RequisitionList from "../features/requisitions/RequisitionList";
import EditModal from "../components/EditModal";
import SupplierBarChart from "../components/SupplierBarChart";
import GeneratedRequisitionTable from "../features/requisitions/GeneratedRequisitionTable";
import { useRequisitions } from "../contexts/RequisitionContext";
import { useMenus } from "../contexts/MenuContext";
import { exportRequisitionsToCSV, exportPerSupplierCSVs } from "../utils/exportRequisitions";
import { FaFileCsv, FaFileExport, FaChartBar, FaPlus, FaFilter, FaTruck, FaListUl } from "react-icons/fa";

export default function Requisitions() {
  const { requisitions, fetchRequisitions, addRequisition, updateOne, deleteOne, loading } =
    useRequisitions();
  const { generatedRequisitions } = useMenus();

  const [modalOpen, setModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [filter, setFilter] = useState("all");
  const [supplierFilter, setSupplierFilter] = useState("all");

  // helper: get current user name from JWT or localStorage
  const getCurrentUserName = () => {
    try {
      const storedName = localStorage.getItem("userName") || localStorage.getItem("name");
      if (storedName) return storedName;
      const token = localStorage.getItem("token");
      if (!token) return "Manual Entry";
      const parts = token.split(".");
      if (parts.length !== 3) return "Manual Entry";
      const payload = JSON.parse(atob(parts[1] || ""));
      return payload?.name || payload?.username || payload?.user?.name || payload?.email || "Manual Entry";
    } catch {
      return "Manual Entry";
    }
  };

  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const handleAdd = async (newItem) => {
    const payload = {
      status: "pending",
      ...newItem,
      requestedBy: newItem?.requestedBy || getCurrentUserName(),
      date: newItem?.date || today,
    };
    await addRequisition(payload);
  };

  const handleUpdate = async (updated) => {
    const id = requisitions[editIndex]._id;
    await updateOne(id, updated);
  };

  const handleDelete = async (index) => {
    const id = requisitions[index]._id;
    await deleteOne(id);
  };

  useEffect(() => {
    fetchRequisitions({ status: filter, supplier: supplierFilter });
  }, [filter, supplierFilter]);

  const filteredData = requisitions;
  const uniqueSuppliers = useMemo(
    () => ["all", ...new Set(requisitions.map((r) => r.supplier || "").filter(Boolean))],
    [requisitions]
  );

  const grouped = filteredData.reduce((acc, r) => {
    acc[r.supplier || "Unknown"] = (acc[r.supplier || "Unknown"] || 0) + Number(r.quantity || 0);
    return acc;
  }, {});

  const modalInitialValues =
    editIndex !== null
      ? requisitions[editIndex]
      : {
          date: today,
          requestedBy: getCurrentUserName(),
          status: "pending",
          supplier: "Default Supplier",
          unit: "",
          item: "",
          quantity: 0,
        };

  // UI helpers
  const section = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } };
  const chip = (active) =>
    `px-3 py-1.5 rounded-xl border text-sm transition-all ${
      active ? "bg-rose-600 text-white border-rose-600 shadow" : "bg-white text-gray-700 border-gray-200 hover:border-rose-300"
    }`;

  const headerStats = useMemo(() => {
    const total = requisitions.length;
    const pending = requisitions.filter((r) => r.status === "pending").length;
    const approved = requisitions.filter((r) => r.status === "approved").length;
    const suppliers = new Set(requisitions.map((r) => r.supplier || "")).size;
    return { total, pending, approved, suppliers };
  }, [requisitions]);

  return (
    <div className="p-6 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-gradient-to-tr from-rose-200 via-pink-200 to-fuchsia-200 blur-3xl opacity-60" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-60 w-60 rounded-full bg-gradient-to-br from-amber-100 to-rose-100 blur-3xl opacity-70" />

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-2xl border border-rose-100 shadow bg-white">
        <div className="absolute inset-0 bg-gradient-to-r from-rose-600 via-rose-500 to-pink-500 opacity-95" />
        <div className="absolute inset-0 backdrop-blur-[1px]" />
        <div className="relative p-6 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="grid place-items-center h-10 w-10 rounded-xl bg-white/20">
                <FaListUl />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Requisitions</h1>
                <p className="text-white/80 text-sm">Manage requests, filter by status/supplier, export, and visualize totals.</p>
              </div>
            </div>
            {/* Stats */}
            <div className="grid grid-cols-4 gap-3">
              <div className="rounded-xl bg-white/15 border border-white/20 p-3"><div className="text-[11px] text-white/80">Total</div><div className="text-lg font-extrabold">{headerStats.total}</div></div>
              <div className="rounded-xl bg-white/15 border border-white/20 p-3"><div className="text-[11px] text-white/80">Pending</div><div className="text-lg font-extrabold">{headerStats.pending}</div></div>
              <div className="rounded-xl bg-white/15 border border-white/20 p-3"><div className="text-[11px] text-white/80">Approved</div><div className="text-lg font-extrabold">{headerStats.approved}</div></div>
              <div className="rounded-xl bg-white/15 border border-white/20 p-3"><div className="text-[11px] text-white/80">Suppliers</div><div className="text-lg font-extrabold">{headerStats.suppliers}</div></div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-4 flex flex-wrap justify-end gap-3">
            <motion.button whileTap={{ scale: 0.98 }} onClick={() => exportRequisitionsToCSV(filteredData)} className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-white text-sm font-semibold shadow hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-200/60"><FaFileCsv /> Export CSV</motion.button>
            <motion.button whileTap={{ scale: 0.98 }} onClick={() => exportPerSupplierCSVs(filteredData)} className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2 text-white text-sm font-semibold shadow hover:bg-teal-700 focus:outline-none focus:ring-4 focus:ring-teal-200/60"><FaFileExport /> Export per Supplier</motion.button>
            <motion.button whileTap={{ scale: 0.98 }} onClick={() => { setEditIndex(null); setModalOpen(true); }} className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-white text-sm font-semibold shadow hover:bg-rose-700 focus:outline-none focus:ring-4 focus:ring-rose-200/60"><FaPlus /> New Requisition</motion.button>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div variants={section} initial="hidden" animate="show" className="mt-5">
        <div className="rounded-2xl border bg-white/80 backdrop-blur shadow-sm p-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-2 text-gray-700"><FaFilter /><span className="text-sm font-semibold">Filters</span></div>
            <div className="flex flex-wrap gap-2">
              {["all", "pending", "approved", "completed"].map((f) => (
                <button key={f} onClick={() => setFilter(f)} className={chip(filter === f)}>
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <FaTruck className="text-gray-400" />
              <select onChange={(e) => setSupplierFilter(e.target.value)} value={supplierFilter} className="px-3 py-2 rounded-xl border border-gray-200 text-sm focus:border-rose-400 focus:ring-4 focus:ring-rose-200/50 outline-none">
                {uniqueSuppliers.map((s, i) => (
                  <option key={i} value={s}>
                    {s === "all" ? "All Suppliers" : s}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Manual Requisition Table */}
      <motion.div variants={section} initial="hidden" animate="show" className="mt-6">
        <RequisitionList
          data={filteredData}
          onEdit={(i) => {
            setEditIndex(i);
            setModalOpen(true);
          }}
          onDelete={handleDelete}
        />
      </motion.div>

      {/* Summary Cards */}
      <motion.div variants={section} initial="hidden" animate="show" className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(grouped).map(([supplier, qty]) => (
          <motion.div key={supplier} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-gray-100 bg-white/80 shadow-sm p-4">
            <div className="text-sm text-gray-500">Supplier</div>
            <div className="text-lg font-semibold text-gray-800 flex items-center gap-2"><FaTruck className="text-rose-600" /> {supplier || "Unknown"}</div>
            <div className="mt-1 text-sm"><span className="text-gray-500">Total Qty:</span> <strong>{qty}</strong></div>
          </motion.div>
        ))}
      </motion.div>

      {/* Auto-Generated Requisitions */}
      <AnimatePresence>{generatedRequisitions?.length > 0 && (
        <motion.div key="auto" variants={section} initial="hidden" animate="show" className="mt-10">
          <h2 className="text-lg font-bold mb-3 text-gray-800">Auto-Generated Requisitions from Menus</h2>
          <GeneratedRequisitionTable requisitions={generatedRequisitions} />
        </motion.div>
      )}</AnimatePresence>

      {/* Chart */}
      <motion.div variants={section} initial="hidden" animate="show" className="mt-6 rounded-2xl border border-gray-100 bg-white/80 shadow-sm p-4">
        <div className="flex items-center gap-2 text-gray-700 mb-2"><FaChartBar className="text-rose-600" /><h3 className="text-md font-semibold">Quantities by Supplier</h3></div>
        <SupplierBarChart data={filteredData} />
      </motion.div>

      {/* Add/Edit Modal */}
      <EditModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={editIndex === null ? handleAdd : handleUpdate}
        initialValues={modalInitialValues}
        title={editIndex !== null ? "Edit Requisition" : "New Requisition"}
        fields={[
          { name: "date", label: "Date", type: "date" },
          { name: "requestedBy", label: "Requested By" },
          { name: "item", label: "Item" },
          { name: "quantity", label: "Quantity", type: "number" },
          { name: "unit", label: "Unit" },
          { name: "supplier", label: "Supplier" },
          {
            name: "status",
            label: "Status",
            type: "select",
            options: [
              { label: "Pending", value: "pending" },
              { label: "Approved", value: "approved" },
              { label: "Completed", value: "completed" },
            ],
          },
          { name: "base", label: "Base / Location" },
        ]}
      />
    </div>
  );
}
