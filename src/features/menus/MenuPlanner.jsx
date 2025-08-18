import React, { useMemo, useState } from "react";
import Select from "react-select";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUtensils,
  FaSave,
  FaTag,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useRecipes } from "../../contexts/RecipeContext";

/**
 * MenuPlanner – polished, animated, professional UI
 * - Glass/gradient header with icon
 * - Staggered section entrance + subtle parallax glow
 * - Animated chips that summarize selections per meal
 * - Styled react-select to match theme
 * - Animated Save button with ripple & success tick state (optional)
 */

export default function MenuPlanner({ onSubmit }) {
  const { recipes } = useRecipes();

  const [menu, setMenu] = useState({
    menuName: "",
    date: "",
    base: "",
    breakfast: [],
    lunch: [],
    dinner: [],
    snack: [],
    extra: [],
  });

  const [saving, setSaving] = useState(false);
  const [savedOnce, setSavedOnce] = useState(false);

  const handleChange = (field, value) => setMenu((p) => ({ ...p, [field]: value }));

  const entries = useMemo(
    () => [
      { key: "breakfast", label: "Breakfast" },
      { key: "lunch", label: "Lunch" },
      { key: "dinner", label: "Dinner" },
      { key: "snack", label: "Snack" },
      { key: "extra", label: "Extra" },
    ],
    []
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const blocks = [
      { mealType: "breakfast", recipes: menu.breakfast },
      { mealType: "lunch", recipes: menu.lunch },
      { mealType: "dinner", recipes: menu.dinner },
      { mealType: "snack", recipes: menu.snack },
      { mealType: "extra", recipes: menu.extra },
    ];

    blocks.forEach((entry) => {
      if (entry.recipes.length > 0) {
        const recipeIds = entry.recipes.map((r) => r.value);
        onSubmit({
          menuName: menu.menuName,
          date: menu.date,
          base: menu.base,
          mealType: entry.mealType,
          recipeIds,
        });
      }
    });

    setTimeout(() => {
      setSaving(false);
      setSavedOnce(true);
      setMenu({
        menuName: "",
        date: "",
        base: "",
        breakfast: [],
        lunch: [],
        dinner: [],
        snack: [],
        extra: [],
      });
      setTimeout(() => setSavedOnce(false), 1600);
    }, 600); // tiny UX delay for animation
  };

  // Only prepared (locked) recipes
  const options = useMemo(
    () =>
      (recipes || [])
        .filter((r) => r.isLocked)
        .map((r) => ({ value: r._id, label: r.name })),
    [recipes]
  );

  // react-select theme/styles
  const selectStyles = {
    control: (base, state) => ({
      ...base,
      borderRadius: 12,
      borderColor: state.isFocused ? "#fb7185" : "#e5e7eb",
      boxShadow: state.isFocused ? "0 0 0 4px rgba(244,63,94,0.15)" : "none",
      padding: 2,
      minHeight: 42,
      ":hover": { borderColor: "#fb7185" },
    }),
    valueContainer: (base) => ({ ...base, padding: "0 6px" }),
    multiValue: (base) => ({
      ...base,
      background: "#fff1f2",
      border: "1px solid #ffe4e6",
      borderRadius: 10,
    }),
    multiValueLabel: (base) => ({ ...base, color: "#9f1239" }),
    multiValueRemove: (base) => ({
      ...base,
      ":hover": { background: "#fecdd3", color: "#9f1239" },
      borderRadius: 8,
    }),
    menu: (base) => ({ ...base, borderRadius: 12, overflow: "hidden" }),
    option: (base, state) => ({
      ...base,
      background: state.isSelected ? "#ffe4e6" : state.isFocused ? "#fff1f2" : "white",
      color: "#111827",
    }),
  };

  // helpers
  const totalSelected = entries.reduce((sum, e) => sum + (menu[e.key]?.length || 0), 0);

  const sectionVariants = {
    hidden: { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="relative overflow-hidden rounded-2xl bg-white/80 shadow-xl border border-rose-100"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      {/* Decorative gradient + glow */}
      <div className="pointer-events-none absolute -top-16 -right-16 h-56 w-56 rounded-full bg-gradient-to-tr from-rose-200 via-pink-200 to-fuchsia-200 blur-2xl opacity-70" />
      <div className="pointer-events-none absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-gradient-to-br from-rose-100 to-amber-100 blur-2xl opacity-70" />

      {/* Header */}
      <div className="relative p-6 border-b bg-gradient-to-r from-rose-600 via-rose-500 to-pink-500 text-white rounded-t-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="grid place-items-center h-10 w-10 rounded-xl bg-white/20">
              <FaUtensils className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Plan New Menu</h2>
              <p className="text-xs text-white/80">
                {totalSelected} recipe{totalSelected === 1 ? "" : "s"} selected across meals
              </p>
            </div>
          </div>

          {/* Live summary chips */}
          <div className="hidden md:flex gap-2">
            {entries.map((e) => (
              <motion.span
                key={e.key}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs"
              >
                <span className="font-semibold">{e.label}</span>
                <span className="grid h-5 min-w-[20px] place-items-center rounded-full bg-white/30 px-1 text-[10px]">
                  {menu[e.key]?.length || 0}
                </span>
              </motion.span>
            ))}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="relative p-6 space-y-6">
        {/* Top grid */}
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div>
            <label className="text-sm mb-1 flex items-center gap-1 text-gray-700">
              <FaTag /> Menu Name (anchor)
            </label>
            <input
              type="text"
              value={menu.menuName}
              onChange={(e) => handleChange("menuName", e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-rose-400 focus:ring-4 focus:ring-rose-200/50 outline-none transition-all"
              placeholder='e.g. "MENU 1"'
              required
            />
          </div>

          <div>
            <label className="text-sm mb-1 flex items-center gap-1 text-gray-700">
              <FaCalendarAlt /> Date
            </label>
            <input
              type="date"
              value={menu.date}
              onChange={(e) => handleChange("date", e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-rose-400 focus:ring-4 focus:ring-rose-200/50 outline-none transition-all"
              required
            />
          </div>

          <div>
            <label className="text-sm mb-1 flex items-center gap-1 text-gray-700">
              <FaMapMarkerAlt /> Base / Location
            </label>
            <input
              type="text"
              value={menu.base}
              onChange={(e) => handleChange("base", e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-rose-400 focus:ring-4 focus:ring-rose-200/50 outline-none transition-all"
              placeholder="e.g. Camp Alpha"
              required
            />
          </div>
        </motion.div>

        {/* Meal blocks */}
        <motion.div
  className="grid grid-cols-1 md:grid-cols-2 gap-5"
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0, transition: { delay: 0.05 } }}
>
  {entries.map((e, i) => (
    <motion.div
      key={e.key}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 * i }}
      className="rounded-2xl border border-gray-100 p-4 bg-white/70 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-semibold text-gray-800">{e.label} Recipes</label>
        <span className="text-[11px] rounded-full bg-rose-50 text-rose-700 px-2 py-0.5 border border-rose-100">
          {menu[e.key]?.length || 0} selected
        </span>
      </div>

      {/* IMPORTANT: portal + fixed menu + high z-index */}
      <div className="relative z-50">
        <Select
          isMulti
          options={options}
          value={menu[e.key]}
          onChange={(val) => handleChange(e.key, val)}
          placeholder="Select prepared recipes"
          styles={{
            ...selectStyles,
            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
          }}
          classNamePrefix="rp"
          menuPortalTarget={typeof window !== 'undefined' ? document.body : null}
          menuPosition="fixed"
          menuShouldScrollIntoView={false}
        />
      </div>
    </motion.div>
  ))}
</motion.div>


        {/* Footer / Actions */}
        <div className="flex items-center justify-end pt-2">
          <motion.button
            type="submit"
            whileTap={{ scale: 0.98 }}
            className="relative inline-flex items-center gap-2 rounded-xl bg-rose-600 px-6 py-2.5 text-white font-semibold shadow hover:bg-rose-700 focus:outline-none focus:ring-4 focus:ring-rose-200/60"
          >
            <span className="relative z-10 flex items-center gap-2">
              <FaSave className={saving ? "animate-pulse" : undefined} />
              {saving ? "Saving..." : savedOnce ? "Saved" : "Save Menu"}
            </span>

            {/* ripple */}
            {saving && (
              <span className="absolute inset-0 rounded-xl bg-white/10 animate-ping" />
            )}
          </motion.button>
        </div>
      </div>
    </motion.form>
  );
}
