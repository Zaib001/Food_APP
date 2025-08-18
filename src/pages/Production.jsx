// src/pages/Production.jsx (Polished UI)
import React, { useEffect, useMemo, useState } from "react";
import ProductionForm from "../features/production/ProductionForm";
import ProductionTable from "../features/production/ProductionTable";
import { FaFilePdf, FaIndustry, FaFilter } from "react-icons/fa";
import { exportProductionToPDF } from "../components/exportRecipesToPDF";
import { useIngredients } from "../contexts/IngredientContext";
import { useRecipes } from "../contexts/RecipeContext";
import { useProductions } from "../contexts/ProductionContext";
import { motion } from "framer-motion";

export default function Production({ bases = [] }) {
  const { productions, addProduction, updateOne, deleteOne, fetchProductions } = useProductions();
  const { deductStock } = useIngredients();
  const { recipes, getIngredientsForRecipe } = useRecipes();

  const [editIndex, setEditIndex] = useState(null);
  const [filters, setFilters] = useState({ recipe: "all", base: "all", date: "" });

  const recipesMap = useMemo(
    () => Object.fromEntries((recipes || []).map((r) => [r._id || r.id, r])),
    [recipes]
  );

  const handleSubmit = async (entry) => {
    const qty = Number(entry.quantity || 0);
    const ingredientsUsed = getIngredientsForRecipe(entry.recipeId);
    if (ingredientsUsed && qty > 0) {
      ingredientsUsed.forEach(({ ingredientId, qtyPerUnit }) => {
        const totalQty = (Number(qtyPerUnit) || 0) * qty;
        deductStock(ingredientId, totalQty);
      });
    }
    if (editIndex !== null) {
      const target = productions[editIndex];
      await updateOne(target._id, entry);
      setEditIndex(null);
    } else {
      await addProduction(entry);
    }
  };

  const handleEdit = (index) => setEditIndex(index);
  const handleDelete = async (index) => {
    const target = productions[index];
    if (target?._id) await deleteOne(target._id);
  };

  // fetch when filters change
  useEffect(() => {
    const f = {};
    if (filters.recipe !== "all") f.recipe = filters.recipe;
    if (filters.base !== "all") f.base = filters.base;
    if (filters.date) f.date = filters.date;
    fetchProductions(f);
  }, [filters, fetchProductions]);

  const filteredLogs = useMemo(() => {
    return (productions || []).filter(
      (log) =>
        (filters.recipe === "all" || (log.recipeId === filters.recipe || log.recipe?._id === filters.recipe)) &&
        (filters.base === "all" || log.base === filters.base) &&
        (!filters.date || log.date === filters.date)
    );
  }, [productions, filters]);

  // UI helpers
  const section = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } };
  const chip = (active) =>
    `px-3 py-1.5 rounded-xl border text-sm transition-all ${
      active ? "bg-rose-600 text-white border-rose-600 shadow" : "bg-white text-gray-700 border-gray-200 hover:border-rose-300"
    }`;

  // Quick stats
  const stats = useMemo(() => {
    const totalBatches = filteredLogs.length;
    const totalQty = filteredLogs.reduce((s, r) => s + Number(r.quantity || 0), 0);
    const uniqueRecipes = new Set(filteredLogs.map((r) => r.recipeId || r.recipe?._id)).size;
    const uniqueBases = new Set(filteredLogs.map((r) => r.base)).size;
    return { totalBatches, totalQty, uniqueRecipes, uniqueBases };
  }, [filteredLogs]);

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
                <FaIndustry />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Production</h1>
                <p className="text-white/80 text-sm">Log batches, filter by recipe/base/date, export, and keep stock in sync.</p>
              </div>
            </div>
            {/* Stats */}
            <div className="grid grid-cols-4 gap-3">
              <div className="rounded-xl bg-white/15 border border-white/20 p-3 text-center"><div className="text-[11px] text-white/80">Batches</div><div className="text-lg font-extrabold">{stats.totalBatches}</div></div>
              <div className="rounded-xl bg-white/15 border border-white/20 p-3 text-center"><div className="text-[11px] text-white/80">Total Qty</div><div className="text-lg font-extrabold">{stats.totalQty}</div></div>
              <div className="rounded-xl bg-white/15 border border-white/20 p-3 text-center"><div className="text-[11px] text-white/80">Recipes</div><div className="text-lg font-extrabold">{stats.uniqueRecipes}</div></div>
              <div className="rounded-xl bg-white/15 border border-white/20 p-3 text-center"><div className="text-[11px] text-white/80">Bases</div><div className="text-lg font-extrabold">{stats.uniqueBases}</div></div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-4 flex flex-wrap justify-end gap-3">
            <motion.button
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-4 py-2 text-white text-sm font-semibold shadow hover:bg-sky-700 focus:outline-none focus:ring-4 focus:ring-sky-200/60"
              onClick={() => exportProductionToPDF(filteredLogs, recipesMap)}
            >
              <FaFilePdf /> Export PDF
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div variants={section} initial="hidden" animate="show" className="mt-5">
        <div className="rounded-2xl border bg-white/80 backdrop-blur shadow-sm p-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-2 text-gray-700"><FaFilter /><span className="text-sm font-semibold">Filters</span></div>
            <div className="flex flex-wrap gap-2">
              <select
                value={filters.recipe}
                onChange={(e) => setFilters({ ...filters, recipe: e.target.value })}
                className={"px-3 py-2 rounded-xl border border-gray-200 text-sm focus:border-rose-400 focus:ring-4 focus:ring-rose-200/50 outline-none"}
              >
                <option value="all">All Recipes</option>
                {(recipes || []).map((r) => (
                  <option key={r._id || r.id} value={r._id || r.id}>{r.name}</option>
                ))}
              </select>

              <select
                value={filters.base}
                onChange={(e) => setFilters({ ...filters, base: e.target.value })}
                className={"px-3 py-2 rounded-xl border border-gray-200 text-sm focus:border-rose-400 focus:ring-4 focus:ring-rose-200/50 outline-none"}
              >
                <option value="all">All Bases</option>
                {(bases || []).map((b, i) => (
                  <option key={i} value={b}>{b}</option>
                ))}
              </select>

              <input
                type="date"
                value={filters.date}
                onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                className={"px-3 py-2 rounded-xl border border-gray-200 text-sm focus:border-rose-400 focus:ring-4 focus:ring-rose-200/50 outline-none"}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Form */}
      <motion.div variants={section} initial="hidden" animate="show" className="mt-6">
        <ProductionForm
          recipes={recipes}
          onSubmit={handleSubmit}
          initialValues={editIndex !== null ? productions[editIndex] : null}
        />
      </motion.div>

      {/* Table */}
      <motion.div variants={section} initial="hidden" animate="show" className="mt-6">
        <ProductionTable
          data={filteredLogs}
          recipesMap={recipesMap}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </motion.div>
    </div>
  );
}
