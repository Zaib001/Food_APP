import React, { useMemo, useState } from "react";
import MenuPlanner from "../features/menus/MenuPlanner";
import MenuCalendar from "../features/menus/MenuCalendar";
import { exportMenusToCSV, exportMenusToWeeklyPDF } from "../utils/exportMenus";
import { FaFileCsv, FaFilePdf, FaReceipt, FaCalendarWeek } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

import { useMenus } from "../contexts/MenuContext";
import { useIngredients } from "../contexts/IngredientContext";
import { useRecipes } from "../contexts/RecipeContext";

export default function Menus() {
  const { menus, addMenu } = useMenus();
  const { ingredients } = useIngredients();
  const { recipes } = useRecipes();

  const [selectedWeek, setSelectedWeek] = useState("all");

  const ingredientsMap = useMemo(() => {
    const m = {};
    (ingredients || []).forEach((i) => {
      m[i._id] = i;
    });
    return m;
  }, [ingredients]);

  const recipesById = useMemo(() => {
    const m = {};
    (recipes || []).forEach(r => r && r._id && (m[r._id] = r));
    return m;
  }, [recipes]);

  const handleSubmit = (newMenu) => {
    addMenu(newMenu);
  };

  const currentWeekDates = () => {
    const today = new Date();
    const start = new Date(today.setDate(today.getDate() - today.getDay())); // Sunday
    return Array.from({ length: 7 }).map((_, i) => {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      return date.toISOString().split("T")[0];
    });
  };

  const weekDates = currentWeekDates();
  const filteredMenus =
    selectedWeek === "all" ? menus : menus.filter((menu) => weekDates.includes(menu.date));

  const headerStats = useMemo(() => {
    const total = menus.length;
    const thisWeek = menus.filter((m) => weekDates.includes(m.date)).length;
    const bases = new Set(menus.map((m) => m.base || m.location)).size;
    return { total, thisWeek, bases };
  }, [menus]);

  const section = {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  };
  return (
    <div className="p-6 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-gradient-to-tr from-rose-200 via-pink-200 to-fuchsia-200 blur-3xl opacity-60" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-60 w-60 rounded-full bg-gradient-to-br from-amber-100 to-rose-100 blur-3xl opacity-70" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl border border-rose-100 shadow bg-white"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-rose-600 via-rose-500 to-pink-500 opacity-95" />
        <div className="absolute inset-0 backdrop-blur-[1px]" />
        <div className="relative p-6 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="grid place-items-center h-10 w-10 rounded-xl bg-white/20">
                <FaCalendarWeek />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Menus</h1>
                <p className="text-white/80 text-sm">Plan menus, preview the calendar, and export or generate weekly requisitions.</p>
              </div>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl bg-white/15 border border-white/20 p-3">
                <div className="text-xs uppercase tracking-wide text-white/80">Total Menus</div>
                <div className="text-lg font-extrabold">{headerStats.total}</div>
              </div>
              <div className="rounded-xl bg-white/15 border border-white/20 p-3">
                <div className="text-xs uppercase tracking-wide text-white/80">This Week</div>
                <div className="text-lg font-extrabold">{headerStats.thisWeek}</div>
              </div>
              <div className="rounded-xl bg-white/15 border border-white/20 p-3">
                <div className="text-xs uppercase tracking-wide text-white/80">Bases</div>
                <div className="text-lg font-extrabold">{headerStats.bases}</div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-4 flex flex-wrap justify-end gap-3">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => exportMenusToCSV(filteredMenus, recipesById)}
              className="relative inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-white text-sm font-semibold shadow hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-200/60"
            >
              <FaFileCsv /> Export CSV
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => exportMenusToWeeklyPDF(filteredMenus, recipesById)}
              className="relative inline-flex items-center gap-2 rounded-xl bg-sky-600 px-4 py-2 text-white text-sm font-semibold shadow hover:bg-sky-700 focus:outline-none focus:ring-4 focus:ring-sky-200/60"
            >
              <FaFilePdf /> Export Weekly PDF
            </motion.button>

          </div>
        </div>
      </motion.div>

      {/* Week Filter */}
      <motion.div
        variants={section}
        initial="hidden"
        animate="show"
        className="mt-5"
      >
        <div className="rounded-2xl border bg-white/80 backdrop-blur shadow-sm p-3 inline-flex gap-1">
          {[
            { key: "all", label: "All Menus" },
            { key: "week", label: "This Week" },
          ].map((w) => (
            <button
              key={w.key}
              onClick={() => setSelectedWeek(w.key)}
              className={`px-3 py-1.5 rounded-xl text-sm border transition-all ${selectedWeek === w.key
                ? "bg-rose-600 text-white border-rose-600 shadow"
                : "bg-white text-gray-700 border-gray-200 hover:border-rose-300"
                }`}
            >
              {w.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Planner + Calendar */}
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={section}
        className="mt-6"
      >
        <div className="rounded-2xl border border-gray-100 bg-white/80 shadow-sm p-4">
          <MenuPlanner onSubmit={handleSubmit} />
        </div>
      </motion.div>

      {/* Planner + Calendar */}
      <motion.div
        initial="hidden"
        animate="show"               // ← change from whileInView to animate
        variants={section}
        className="mt-6 text-gray-900"
      >
        <MenuCalendar menus={filteredMenus} ingredientsMap={ingredientsMap} />
      </motion.div>



    </div>
  );
}
