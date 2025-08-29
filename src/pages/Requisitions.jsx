import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import RequisitionList from "../features/requisitions/RequisitionList";
import EditModal from "../components/EditModal";
import SupplierBarChart from "../components/SupplierBarChart";
import GeneratedRequisitionTable from "../features/requisitions/GeneratedRequisitionTable";
import RequisitionReport from "../components/RequisitionReport";
import { useRequisitions } from "../contexts/RequisitionContext";
import { useMenus } from "../contexts/MenuContext";
import { useIngredients } from "../contexts/IngredientContext";
import { exportRequisitionsToCSV, exportPerSupplierCSVs } from "../utils/exportRequisitions";
import { FaFileCsv, FaFileExport, FaChartBar, FaPlus, FaFilter, FaTruck, FaListUl, FaPrint } from "react-icons/fa";
import { approveRequisition as approveReqAPI, bulkApproveRequisitions as bulkApproveAPI, completeRequisition as completeReqAPI } from "../api/requisitions";
import CompletionModal from "../components/CompletionModal";

export default function Requisitions() {
  const { requisitions, fetchRequisitions, addRequisition, updateOne, deleteOne } = useRequisitions();
  const { generatedRequisitions } = useMenus();
  const { ingredients } = useIngredients();

  const [modalOpen, setModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [filter, setFilter] = useState("all");
  const [supplierFilter, setSupplierFilter] = useState("all");

  // Completion modal
  const [completionModalOpen, setCompletionModalOpen] = useState(false);
  const [selectedRequisition, setSelectedRequisition] = useState(null);

  // PRINT AREA ref (we print only this container)
  const printAreaRef = useRef(null);

  // helper: current user name (memoized)
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
  const currentUserName = useMemo(() => getCurrentUserName(), []);
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const ingredientOptions = useMemo(
    () =>
      (ingredients || []).map((ing) => ({
        label: ing?.name ?? "(Unnamed ingredient)",
        value: String(ing?._id ?? ""),
      })),
    [ingredients]
  );

  const ingredientMap = useMemo(() => {
    const m = {};
    (ingredients || []).forEach((ing) => {
      if (ing?._id) m[String(ing._id)] = ing;
    });
    return m;
  }, [ingredients]);

  // open completion flow
  const handleComplete = (requisition) => {
    setSelectedRequisition(requisition);
    setCompletionModalOpen(true);
  };

  // completion submit
  const handleCompletionSubmit = async (requisitionId, completionData) => {
    try {
      await completeReqAPI(requisitionId, completionData);
      await fetchRequisitions({ status: filter, supplier: supplierFilter });
      setCompletionModalOpen(false);
      setSelectedRequisition(null);
      alert("Requisition completed successfully!");
    } catch (error) {
      console.error("Failed to complete requisition:", error);
      alert("Failed to complete requisition. Please try again.");
    }
  };

  const handleDelete = async (index) => {
    const id = requisitions[index]._id;
    await deleteOne(id);
  };

  useEffect(() => {
    fetchRequisitions({ status: filter, supplier: supplierFilter });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, supplierFilter]);

  const filteredData = requisitions;

  const uniqueSuppliers = useMemo(() => {
    const set = new Set(
      requisitions.map((r) => (r.supplier || r.items?.[0]?.supplier || "")).filter(Boolean)
    );
    return ["all", ...set];
  }, [requisitions]);

  const grouped = useMemo(() => {
    return filteredData.reduce((acc, r) => {
      const first = r.items?.[0] || {};
      const s = (r.supplier ?? first.supplier) || "Unknown";
      const q = Number((r.quantity ?? first.quantity) || 0);
      acc[s] = (acc[s] || 0) + q;
      return acc;
    }, {});
  }, [filteredData]);

  // Modal initial values (supports items[0] shape)
  const modalInitialValues = useMemo(() => {
    if (editIndex !== null) {
      const requisition = requisitions[editIndex];
      if (requisition?.items?.length > 0) {
        return { ...requisition, ...requisition.items[0] };
      }
      return requisition;
    }
    return {
      date: today,
      requestedBy: currentUserName,
      status: "pending",
      supplier: "",
      unit: "",
      item: "",
      ingredientId: "",
      quantity: 0,
      base: "",
      notes: "",
    };
  }, [editIndex, requisitions, today, currentUserName]);

  // ADD (manual)
  const handleAdd = async (newItem) => {
    const payload = {
      status: "pending",
      requestedBy: newItem?.requestedBy || currentUserName,
      date: newItem?.date || today,
      base: newItem?.base || "",
      notes: newItem?.notes || "",
      items: [
        {
          item: newItem.item,
          quantity: newItem.quantity,
          unit: newItem.unit,
          supplier: newItem.supplier,
          ingredientId: newItem.ingredientId,
        },
      ],
    };
    await addRequisition(payload);
  };

  // UPDATE
  const handleUpdate = async (updated) => {
    const curr = requisitions[editIndex];
    if (!curr) return;

    if (String(updated?.status).toLowerCase() === "completed") {
      handleComplete({ ...curr, ...updated });
      setModalOpen(false);
      return;
    }

    const payload = {
      ...updated,
      items: [
        {
          item: updated.item,
          quantity: updated.quantity,
          unit: updated.unit,
          supplier: updated.supplier,
          ingredientId: updated.ingredientId,
        },
      ],
    };

    await updateOne(curr._id, payload);
  };

  // UI helpers
  const section = {
    hidden: { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  };
  const chip = (active) =>
    `px-3 py-1.5 rounded-xl border text-sm transition-all ${
      active
        ? "bg-rose-600 text-white border-rose-600 shadow"
        : "bg-white text-gray-700 border-gray-200 hover:border-rose-300"
    }`;

  const headerStats = useMemo(() => {
    const total = requisitions.length;
    const pending = requisitions.filter((r) => r.status === "pending").length;
    const approved = requisitions.filter((r) => r.status === "approved").length;
    const suppliers = new Set(
      requisitions.map((r) => (r.supplier || r.items?.[0]?.supplier || "")).filter(Boolean)
    ).size;
    return { total, pending, approved, suppliers };
  }, [requisitions]);

  // Approvals for headers (generated)
  const handleApproveHeader = async (id) => {
    await approveReqAPI(id);
    await fetchRequisitions({ status: filter, supplier: supplierFilter });
  };

  const handleBulkApproveHeaders = async (filterObj = {}) => {
    await bulkApproveAPI(filterObj);
    await fetchRequisitions({ status: filter, supplier: supplierFilter });
  };

  const handlePrint = () => window.print();

  return (
    <div className="p-6 relative overflow-hidden">
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #printArea, #printArea * { visibility: visible; }
          #printArea { position: absolute; left: 0; top: 0; width: 100%; }
          .shadow, .shadow-sm, .shadow-md, .shadow-lg, .shadow-xl, .shadow-2xl { box-shadow: none !important; }
          .bg-white\\/80, .bg-white\\/90, .bg-white, .bg-gray-50, .bg-gray-50\\/60 { background: #fff !important; }
          .no-print { display: none !important; }
          .print-only { display: block !important; }
          .page-break { page-break-before: always; }
          table { border-collapse: collapse !important; }
          th, td { border: 1px solid #ddd !important; }
          * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
        .print-only { display: none; }
      `}</style>

      {/* Decorative blobs */}
      <div className="no-print pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-gradient-to-tr from-rose-200 via-pink-200 to-fuchsia-200 blur-3xl opacity-60" />
      <div className="no-print pointer-events-none absolute -bottom-24 -left-24 h-60 w-60 rounded-full bg-gradient-to-br from-amber-100 to-rose-100 blur-3xl opacity-70" />

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-2xl border border-rose-100 shadow bg-white no-print">
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
                <p className="text-white/80 text-sm">Manage requests, filter by status/supplier, export, visualize, and print a clean PDF.</p>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-3">
              <div className="rounded-xl bg-white/15 border border-white/20 p-3">
                <div className="text-[11px] text-white/80">Total</div>
                <div className="text-lg font-extrabold">{headerStats.total}</div>
              </div>
              <div className="rounded-xl bg-white/15 border border-white/20 p-3">
                <div className="text-[11px] text-white/80">Pending</div>
                <div className="text-lg font-extrabold">{headerStats.pending}</div>
              </div>
              <div className="rounded-xl bg-white/15 border border-white/20 p-3">
                <div className="text-[11px] text-white/80">Approved</div>
                <div className="text-lg font-extrabold">{headerStats.approved}</div>
              </div>
              <div className="rounded-xl bg-white/15 border border-white/20 p-3">
                <div className="text-[11px] text-white/80">Suppliers</div>
                <div className="text-lg font-extrabold">{headerStats.suppliers}</div>
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap justify-end gap-3">
            <motion.button whileTap={{ scale: 0.98 }} onClick={() => exportRequisitionsToCSV(requisitions)} className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-white text-sm font-semibold shadow hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-200/60">
              <FaFileCsv /> Export CSV
            </motion.button>
            <motion.button whileTap={{ scale: 0.98 }} onClick={() => exportPerSupplierCSVs(requisitions)} className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2 text-white text-sm font-semibold shadow hover:bg-teal-700 focus:outline-none focus:ring-4 focus:ring-teal-200/60">
              <FaFileExport /> Export per Supplier
            </motion.button>
            <motion.button whileTap={{ scale: 0.98 }} onClick={() => { setEditIndex(null); setModalOpen(true); }} className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-white text-sm font-semibold shadow hover:bg-rose-700 focus:outline-none focus:ring-4 focus:ring-rose-200/60">
              <FaPlus /> New Requisition
            </motion.button>
            <motion.button whileTap={{ scale: 0.98 }} onClick={handlePrint} className="inline-flex items-center gap-2 rounded-xl bg-slate-700 px-4 py-2 text-white text-sm font-semibold shadow hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-200/60" title="Print or Save PDF">
              <FaPrint /> Print / Save PDF
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div variants={section} initial="hidden" animate="show" className="mt-5 no-print">
        <div className="rounded-2xl border bg-white/80 backdrop-blur shadow-sm p-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-2 text-gray-700">
              <FaFilter />
              <span className="text-sm font-semibold">Filters</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {["all", "pending", "approved", "completed"].map((f) => (
                <button key={f} onClick={() => setFilter(f)} className={chip(filter === f)}>
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <FaTruck className="text-gray-400" />
              <select
                onChange={(e) => setSupplierFilter(e.target.value)}
                value={supplierFilter}
                className="px-3 py-2 rounded-xl border border-gray-200 text-sm focus:border-rose-400 focus:ring-4 focus:ring-rose-200/50 outline-none"
              >
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

      {/* Table */}
      <motion.div variants={section} initial="hidden" animate="show" className="mt-6 no-print">
        <RequisitionList
          data={requisitions}
          onEdit={(i) => {
            setEditIndex(i);
            setModalOpen(true);
          }}
          onDelete={handleDelete}
          onComplete={handleComplete}
        />
      </motion.div>

      {/* Summary */}
      <motion.div variants={section} initial="hidden" animate="show" className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 no-print">
        {Object.entries(grouped).map(([supplier, qty]) => (
          <motion.div key={supplier} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-gray-100 bg-white/80 shadow-sm p-4">
            <div className="text-sm text-gray-500">Supplier</div>
            <div className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <FaTruck className="text-rose-600" /> {supplier || "Unknown"}
            </div>
            <div className="mt-1 text-sm">
              <span className="text-gray-500">Total Qty:</span> <strong>{qty}</strong>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Report */}
      <motion.div variants={section} initial="hidden" animate="show" className="mt-6">
        <RequisitionReport data={requisitions} title="Requisitions by Supplier & Date" />
      </motion.div>

      {/* Auto-generated */}
      <AnimatePresence>
        {generatedRequisitions?.length > 0 && (
          <motion.div key="auto" variants={section} initial="hidden" animate="show" className="mt-10 no-print">
            <h2 className="text-lg font-bold mb-3 text-gray-800">Auto-Generated Requisitions from Menus</h2>
            <GeneratedRequisitionTable
              requisitions={generatedRequisitions}
              onApprove={handleApproveHeader}
              onBulkApprove={handleBulkApproveHeaders}
              onComplete={handleComplete}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chart */}
      <motion.div variants={section} initial="hidden" animate="show" className="mt-6 rounded-2xl border border-gray-100 bg-white/80 shadow-sm p-4 no-print">
        <div className="flex items-center gap-2 text-gray-700 mb-2">
          <FaChartBar className="text-rose-600" />
          <h3 className="text-md font-semibold">Quantities by Supplier</h3>
        </div>
        <SupplierBarChart data={requisitions} />
      </motion.div>

      {/* PRINT-ONLY */}
      <div id="printArea" ref={printAreaRef} className="print-only">
        <div style={{ padding: "20px" }}>
          <h1 style={{ fontSize: "20px", marginBottom: "8px" }}>Requisitions Report</h1>
          <div style={{ fontSize: "12px", color: "#555", marginBottom: "16px" }}>
            Generated on {new Date().toLocaleString()}
          </div>

          <div style={{ pageBreakInside: "avoid" }}>
            <RequisitionReport data={requisitions} title="Requisitions by Supplier & Date" />
          </div>

          {generatedRequisitions?.length > 0 && (
            <div className="page-break" style={{ marginTop: "24px" }}>
              <h2 style={{ fontSize: "16px", marginBottom: "8px" }}>Auto-Generated Requisitions (Summary)</h2>
              <RequisitionReport data={generatedRequisitions} title="Auto-Generated (Grouped View)" />
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <EditModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={editIndex !== null ? handleUpdate : handleAdd}
        initialValues={modalInitialValues}
        title={editIndex !== null ? "Edit Requisition" : "New Requisition"}
        ingredientMap={ingredientMap}
        fields={[
          { name: "date", label: "Date", type: "date" },
          { name: "requestedBy", label: "Requested By" },
          {
            name: "ingredientId",
            label: "Ingredient",
            type: "select",
            options: [{ label: "— Select Ingredient —", value: "" }, ...ingredientOptions],
            help: "Choosing an ingredient can auto-fill Item and Unit when saving.",
          },
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
          { name: "notes", label: "Notes", type: "textarea" },
        ]}
      />

      {/* Completion Modal */}
      <CompletionModal
        isOpen={completionModalOpen}
        onClose={() => {
          setCompletionModalOpen(false);
          setSelectedRequisition(null);
        }}
        requisition={selectedRequisition}
        onComplete={handleCompletionSubmit}
      />
    </div>
  );
}
