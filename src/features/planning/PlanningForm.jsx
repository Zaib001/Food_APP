import React, { useEffect, useMemo, useState } from "react";
import Select from "react-select";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaClipboardList,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaStickyNote,
  FaUtensils,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import { ymdLocal } from "../../utils/date";

// =====================
// PlanningForm (polished)
// =====================
export default function PlanningForm({ menus = [], onSubmit, initialValues = null }) {
  const [plan, setPlan] = useState({
    date: "",
    base: "",
    breakfast: { menu: null, qty: 0 },
    lunch: { menu: null, qty: 0 },
    snack: { menu: null, qty: 0 },
    dinner: { menu: null, qty: 0 },
    extra: { menu: null, qty: 0 },
    notes: "",
  });

  // Role gating
  const role = (JSON.parse(localStorage.getItem("user") || "{}")?.role ?? "user") || "user";
  const disabled = !["planner", "admin"].includes(role);

  // Prefill on edit
  useEffect(() => {
    if (!initialValues) return;
    setPlan({
      date: initialValues.date || "",
      base: initialValues.base || "",
      breakfast: {
        menu: initialValues.breakfast?.menu?._id || initialValues.breakfast?.menu || null,
        qty: Number(initialValues.breakfast?.qty ?? 0),
      },
      lunch: {
        menu: initialValues.lunch?.menu?._id || initialValues.lunch?.menu || null,
        qty: Number(initialValues.lunch?.qty ?? 0),
      },
      snack: {
        menu: initialValues.snack?.menu?._id || initialValues.snack?.menu || null,
        qty: Number(initialValues.snack?.qty ?? 0),
      },
      dinner: {
        menu: initialValues.dinner?.menu?._id || initialValues.dinner?.menu || null,
        qty: Number(initialValues.dinner?.qty ?? 0),
      },
      extra: {
        menu: initialValues.extra?.menu?._id || initialValues.extra?.menu || null,
        qty: Number(initialValues.extra?.qty ?? 0),
      },
      notes: initialValues.notes || "",
    });
  }, [initialValues]);

  // Build select options grouped by meal type
  const byTypeOptions = useMemo(() => {
    const make = (t) =>
      menus
        .filter((m) => (m.mealType || "").toLowerCase() === t)
        .map((m) => ({
          value: m._id,
          label: `${new Date(m.date).toDateString()} • ${t} • ${m.base}${m.menuName ? " • " + m.menuName : ""}`,
        }));
    return {
      breakfast: make("breakfast"),
      lunch: make("lunch"),
      snack: make("snack"),
      dinner: make("dinner"),
      extra: make("extra"),
    };
  }, [menus]);

  // Safe setter per block/field
  const setMeal = (block, field, value) => {
    setPlan((prev) => ({
      ...prev,
      // keep the date as user's current selection; when editing normalize to local format
      date: initialValues ? ymdLocal(prev.date || initialValues.date) : prev.date,
      [block]: {
        ...prev[block],
        [field]: field === "qty" ? Number(value || 0) : value,
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (disabled) return;
    onSubmit(plan);
    if (!initialValues) {
      setPlan({
        date: "",
        base: "",
        breakfast: { menu: null, qty: 0 },
        lunch: { menu: null, qty: 0 },
        snack: { menu: null, qty: 0 },
        dinner: { menu: null, qty: 0 },
        extra: { menu: null, qty: 0 },
        notes: "",
      });
    }
  };

  const section = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  const selectStyles = {
    control: (base, state) => ({
      ...base,
      borderRadius: 12,
      borderColor: state.isFocused ? "#fb7185" : "#e5e7eb",
      boxShadow: state.isFocused ? "0 0 0 4px rgba(244,63,94,0.15)" : "none",
      padding: 2,
      minHeight: 42,
      ":hover": { borderColor: "#fb7185" },
      background: disabled ? "#f8fafc" : "white",
    }),
    valueContainer: (b) => ({ ...b, padding: "0 6px" }),
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
    menu: (base) => ({ ...base, zIndex: 9999 }),
  };

  const MealRow = ({ title, block }) => (
    <motion.div variants={section} className="grid grid-cols-1 md:grid-cols-3 gap-3">
      <div className="md:col-span-2">
        <label className="block text-sm text-gray-700 mb-1">{title} Menu</label>
        {/* Portal + fixed menu avoids clipping behind other layers */}
        <div className="relative z-50">
          <Select
            isDisabled={disabled}
            options={byTypeOptions[block]}
            value={byTypeOptions[block].find((o) => o.value === plan[block].menu) || null}
            onChange={(opt) => setMeal(block, "menu", opt ? opt.value : null)}
            placeholder={`Select ${title.toLowerCase()} menu`}
            styles={selectStyles}
            classNamePrefix="rp"
            menuPortalTarget={typeof window !== "undefined" ? document.body : null}
            menuPosition="fixed"
            menuShouldScrollIntoView={false}
          />
        </div>
      </div>
      <div>
        <label className="block text-sm text-gray-700 mb-1">Quantity</label>
        <input
          type="number"
          min="0"
          value={plan[block].qty}
          onChange={(e) => setMeal(block, "qty", e.target.value)}
          className="border rounded-xl px-3 py-2 w-full focus:border-rose-400 focus:ring-4 focus:ring-rose-200/50 outline-none"
          placeholder="e.g. 50"
          disabled={disabled}
        />
      </div>
    </motion.div>
  );

  const totalSelected = ["breakfast", "lunch", "snack", "dinner", "extra"].reduce(
    (sum, k) => sum + Number(!!plan[k].menu),
    0
  );

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial="hidden"
      animate="show"
      variants={section}
      className="bg-white/80 p-6 rounded-2xl shadow border border-gray-100"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center gap-2 mb-4 text-gray-800">
        <FaClipboardList className="text-rose-600" />
        <h2 className="text-xl font-bold">
          {initialValues ? "Edit Plan" : "Create a New Plan"}
        </h2>
        <span className="ml-auto text-xs px-2 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-100">
          {totalSelected} meals selected
        </span>
        {disabled && (
          <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-600">Read-only for your role</span>
        )}
      </div>

      {/* Top row */}
      <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4" variants={section}>
        <div>
          <label className="block text-sm text-gray-700 mb-1 flex items-center gap-1">
            <FaCalendarAlt /> Date
          </label>
          <input
            type="date"
            value={plan.date}
            onChange={(e) =>
              setPlan((prev) => ({ ...prev, date: e.target.value }))
            }
            className="border rounded-xl px-3 py-2 w-full focus:border-rose-400 focus:ring-4 focus:ring-rose-200/50 outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1 flex items-center gap-1">
            <FaMapMarkerAlt /> Base / Location
          </label>
          <input
            type="text"
            value={plan.base}
            onChange={(e) => setPlan((prev) => ({ ...prev, base: e.target.value }))}
            className="border rounded-xl px-3 py-2 w-full focus:border-rose-400 focus:ring-4 focus:ring-rose-200/50 outline-none"
            placeholder="e.g. Camp Alpha"
            required
            disabled={disabled}
          />
        </div>
      </motion.div>

      {/* Meal blocks */}
      <div className="space-y-4">
        <MealRow title="Breakfast" block="breakfast" />
        <MealRow title="Lunch" block="lunch" />
        <MealRow title="Snack" block="snack" />
        <MealRow title="Dinner" block="dinner" />
        <MealRow title="Extra" block="extra" />
      </div>

      {/* Notes */}
      <div className="mt-4">
        <label className="block text-sm text-gray-700 mb-1 flex items-center gap-1">
          <FaStickyNote /> Notes (optional)
        </label>
        <textarea
          value={plan.notes}
          onChange={(e) => setPlan((prev) => ({ ...prev, notes: e.target.value }))}
          className="border rounded-xl px-3 py-2 w-full focus:border-rose-400 focus:ring-4 focus:ring-rose-200/50 outline-none"
          rows={3}
          placeholder="Additional instructions or reminders"
          disabled={disabled}
        />
      </div>

      {/* Actions */}
      <div className="text-right mt-5">
        <motion.button
          type="submit"
          whileTap={{ scale: 0.98 }}
          className={`text-white px-6 py-2 rounded-xl font-semibold shadow focus:outline-none focus:ring-4 ${
            disabled
              ? "bg-gray-300 cursor-not-allowed focus:ring-gray-200"
              : "bg-rose-600 hover:bg-rose-700 focus:ring-rose-200/60"
          }`}
          disabled={disabled}
        >
          {initialValues ? "Update Plan" : "Save Plan"}
        </motion.button>
      </div>
    </motion.form>
  );
}