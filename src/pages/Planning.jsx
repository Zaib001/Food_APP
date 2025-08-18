import React, { useState, useMemo } from "react";
import PlanningForm from "../features/planning/PlanningForm";
import PlanningTable from "../features/planning/PlanningTable";
import { FaFilter, FaCalendarDay, FaMapMarkerAlt, FaClipboardList, FaSync } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { usePlanning } from "../contexts/PlanningContext";
import { useMenus } from "../contexts/MenuContext";
import { ymdLocal } from "../utils/date";

export default function Planning() {
  const { plans, addPlan, editPlan, removePlan } = usePlanning();
  const { menus } = useMenus();

  const [editIndex, setEditIndex] = useState(null);
  const [baseFilter, setBaseFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");

  const handleSave = (plan) => {
    const payload = { ...plan, date: ymdLocal(plan.date) };
    if (editIndex !== null) {
      const existingPlan = plans[editIndex];
      editPlan(existingPlan._id, payload);
      setEditIndex(null);
    } else {
      addPlan(payload);
    }
  };

  const handleEdit = (index) => setEditIndex(index);

  const handleDelete = (index) => {
    const p = plans[index];
    if (p?._id) removePlan(p._id);
  };

  const filteredPlans = plans.filter(
    (p) =>
      (baseFilter === "all" || p.base === baseFilter) &&
      (!dateFilter || ymdLocal(p.date) === ymdLocal(dateFilter))
  );

  const uniqueBases = useMemo(
    () => ["all", ...new Set(plans.map((p) => p.base).filter(Boolean))],
    [plans]
  );

  // Quick stats (robust to old/new plan shapes)
  const stats = useMemo(() => {
    const total = filteredPlans.length;
    const uniqueBasesCount = new Set(filteredPlans.map((p) => p.base)).size;
    const uniqueDates = new Set(filteredPlans.map((p) => ymdLocal(p.date))).size;
    const countBlocks = (p) => {
      if (p?.menus && Array.isArray(p.menus)) return p.menus.length;
      const blocks = [p.breakfast, p.lunch, p.snack, p.dinner, p.extra];
      return blocks.reduce((s, b) => s + (b?.menu ? 1 : 0), 0);
    };
    const scheduled = filteredPlans.reduce((s, p) => s + countBlocks(p), 0);
    return { total, uniqueBasesCount, uniqueDates, scheduled };
  }, [filteredPlans]);

  // UI helpers
  const section = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } };
  const chip = (active) =>
    `px-3 py-1.5 rounded-xl border text-sm transition-all ${
      active
        ? "bg-rose-600 text-white border-rose-600 shadow"
        : "bg-white/90 text-gray-700 border-gray-200 hover:border-rose-300"
    }`;

  return (
    <motion.div
      className="p-6 relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Decorative gradient background */}
      <div className="pointer-events-none absolute -top-20 -right-20 h-72 w-72 rounded-full bg-gradient-to-tr from-rose-200 to-pink-200 blur-3xl opacity-50" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-gradient-to-br from-amber-100 to-rose-100 blur-3xl opacity-60" />

      {/* Header / KPI ribbon */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl border border-rose-100 shadow bg-white"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-rose-600 via-rose-500 to-pink-500 opacity-95" />
        <div className="absolute inset-0 backdrop-blur-[1px]" />
        <div className="relative p-6 text-white">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="grid place-items-center h-10 w-10 rounded-xl bg-white/20">
                <FaClipboardList />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Production Planning</h1>
                <p className="text-white/80 text-sm">Schedule menus per base & meal, filter quickly, and manage edits.</p>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-3">
              <div className="rounded-xl bg-white/15 border border-white/20 p-3 text-center"><div className="text-[11px] text-white/80">Plans</div><div className="text-lg font-extrabold">{stats.total}</div></div>
              <div className="rounded-xl bg-white/15 border border-white/20 p-3 text-center"><div className="text-[11px] text-white/80">Bases</div><div className="text-lg font-extrabold">{stats.uniqueBasesCount}</div></div>
              <div className="rounded-xl bg-white/15 border border-white/20 p-3 text-center"><div className="text-[11px] text-white/80">Dates</div><div className="text-lg font-extrabold">{stats.uniqueDates}</div></div>
              <div className="rounded-xl bg-white/15 border border-white/20 p-3 text-center"><div className="text-[11px] text-white/80">Meals</div><div className="text-lg font-extrabold">{stats.scheduled}</div></div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        variants={section}
        initial="hidden"
        animate="show"
        className="mt-5"
      >
        <div className="rounded-2xl border bg-white/80 backdrop-blur shadow-sm p-4">
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
            <div className="flex items-center gap-2 text-gray-700">
              <FaFilter />
              <span className="text-sm font-semibold">Filters</span>
            </div>

            {/* Base chips */}
            <div className="flex flex-1 items-center gap-2 overflow-x-auto no-scrollbar">
              <FaMapMarkerAlt className="text-gray-400 shrink-0" />
              <div className="flex gap-2">
                {uniqueBases.map((base) => (
                  <button key={base} onClick={() => setBaseFilter(base)} className={chip(baseFilter === base)}>
                    {base === "all" ? "All Bases" : base}
                  </button>
                ))}
              </div>
            </div>

            {/* Date */}
            <div className="flex items-center gap-2">
              <FaCalendarDay className="text-gray-400" />
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-gray-200 text-sm focus:border-rose-400 focus:ring-4 focus:ring-rose-200/50 outline-none"
              />
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setBaseFilter("all");
                  setDateFilter("");
                }}
                className="px-3 py-2 rounded-xl border text-sm hover:bg-gray-50"
              >
                Reset
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Form */}
      <AnimatePresence>
        <motion.div
          key={editIndex !== null ? "edit" : "new"}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.3 }}
          className="mb-6 mt-5"
        >
          <PlanningForm
            menus={menus}
            onSubmit={handleSave}
            initialValues={editIndex !== null ? plans[editIndex] : null}
          />
        </motion.div>
      </AnimatePresence>

      {/* Table */}
      <motion.div
        variants={section}
        initial="hidden"
        animate="show"
        className="bg-white/90 border border-gray-100 shadow-lg rounded-xl overflow-hidden"
      >
        <PlanningTable
          plans={filteredPlans}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </motion.div>
    </motion.div>
  );
}
