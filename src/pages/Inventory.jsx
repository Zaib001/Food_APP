// src/pages/Inventory.jsx (Polished UI)
import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import InventoryForm from "../features/inventory/InventoryForm";
import InventoryTable from "../features/inventory/InventoryTable";
import StockBarChart from "../components/StockBarChart";
import { FaFileCsv, FaBoxes, FaChartBar } from "react-icons/fa";
import { useInventory } from "../contexts/InventoryContext";
import { useIngredients } from "../contexts/IngredientContext";

export default function Inventory() {
  const { inventory, addInventory, editInventory, removeInventory, downloadCSV } = useInventory();
  const { ingredients } = useIngredients();
  const [editIndex, setEditIndex] = useState(null);

  // quick stats
  const stats = useMemo(() => {
    const totalEntries = inventory.length;
    const totalQty = inventory.reduce((s, r) => s + Number(r.quantity || 0), 0);
    const low = inventory.filter((r) => Number(r.quantity) > 0 && Number(r.quantity) < 5).length;
    const out = inventory.filter((r) => Number(r.quantity) <= 0).length;
    return { totalEntries, totalQty, low, out };
  }, [inventory]);

  const handleSave = async (item) => {
    const ingredient = ingredients.find((i) => i._id === item.ingredientId);
    if (!ingredient) return;
    const entry = { ...item, ingredientId: ingredient._id, ingredientName: ingredient.name };

    if (editIndex !== null) {
      await editInventory(inventory[editIndex]._id, entry);
      setEditIndex(null);
    } else {
      await addInventory(entry);
    }
  };

  const handleEdit = (index) => setEditIndex(index);
  const handleDelete = async (index) => {
    const id = inventory[index]._id;
    await removeInventory(id);
  };

  const section = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

  return (
    <div className="p-6 relative overflow-hidden">
      {/* soft background blobs */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-gradient-to-tr from-rose-200 via-pink-200 to-fuchsia-200 blur-3xl opacity-50" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-60 w-60 rounded-full bg-gradient-to-br from-amber-100 to-rose-100 blur-3xl opacity-60" />

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-2xl border border-rose-100 shadow bg-white">
        <div className="absolute inset-0 bg-gradient-to-r from-rose-600 via-rose-500 to-pink-500 opacity-95" />
        <div className="absolute inset-0 backdrop-blur-[1px]" />
        <div className="relative p-6 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="grid place-items-center h-10 w-10 rounded-xl bg-white/20">
                <FaBoxes />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Inventory</h1>
                <p className="text-white/80 text-sm">Capture deliveries, track stock levels, and export snapshots.</p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-4 gap-3">
              <div className="rounded-xl bg-white/15 border border-white/20 p-3 text-center"><div className="text-[11px] text-white/80">Entries</div><div className="text-lg font-extrabold">{stats.totalEntries}</div></div>
              <div className="rounded-xl bg-white/15 border border-white/20 p-3 text-center"><div className="text-[11px] text-white/80">Total Qty</div><div className="text-lg font-extrabold">{stats.totalQty}</div></div>
              <div className="rounded-xl bg-white/15 border border-white/20 p-3 text-center"><div className="text-[11px] text-white/80">Low</div><div className="text-lg font-extrabold">{stats.low}</div></div>
              <div className="rounded-xl bg-white/15 border border-white/20 p-3 text-center"><div className="text-[11px] text-white/80">Out</div><div className="text-lg font-extrabold">{stats.out}</div></div>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <motion.button whileTap={{ scale: 0.98 }} onClick={downloadCSV} className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-white text-sm font-semibold shadow hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-200/60">
              <FaFileCsv /> Export CSV
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Form */}
      <motion.div variants={section} initial="hidden" animate="show" className="mt-6">
        <InventoryForm ingredients={ingredients} onSave={handleSave} initialData={editIndex !== null ? inventory[editIndex] : {}} />
      </motion.div>

      {/* Table */}
      <motion.div variants={section} initial="hidden" animate="show" className="mt-6">
        <InventoryTable data={inventory} onEdit={handleEdit} onDelete={handleDelete} />
      </motion.div>

      {/* Chart */}
      <motion.div variants={section} initial="hidden" animate="show" className="mt-6 rounded-2xl border border-gray-100 bg-white/80 shadow-sm p-4">
        <div className="flex items-center gap-2 text-gray-700 mb-2"><FaChartBar className="text-rose-600" /><h3 className="text-md font-semibold">Stock by Ingredient</h3></div>
        <StockBarChart data={inventory} />
      </motion.div>
    </div>
  );
}
