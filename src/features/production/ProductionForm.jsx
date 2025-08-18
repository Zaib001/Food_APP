// --- ProductionForm.jsx (drop-in replacement) ---
import React, { useEffect, useMemo, useState } from "react";
import Select from "react-select";
import { motion } from "framer-motion";
import { FaCheck, FaClipboardList } from "react-icons/fa";

export default function ProductionForm({ recipes = [], onSubmit, initialValues = null }) {
  const [form, setForm] = useState({ recipeId: "", quantity: "", date: "", base: "", handler: "" });

  // Apply initial values safely
  useEffect(() => {
    if (initialValues && Object.keys(initialValues).length) {
      setForm((prev) => ({
        ...prev,
        recipeId: initialValues.recipeId || initialValues.recipe?._id || "",
        quantity: String(initialValues.quantity ?? ""),
        date: initialValues.date || "",
        base: initialValues.base || "",
        handler: initialValues.handler || "",
      }));
    }
  }, [initialValues]);

  const recipeOptions = useMemo(
    () => (recipes || []).map((r) => ({ value: r._id || r.id, label: r.name })),
    [recipes]
  );

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSelectChange = (option) => setForm({ ...form, recipeId: option?.value || "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    const { recipeId, quantity, date, base, handler } = form;
    if (!recipeId || !quantity || !date || !base || !handler) return alert("Please fill all fields.");
    onSubmit({ ...form, quantity: Number(quantity) });
    setForm({ recipeId: "", quantity: "", date: "", base: "", handler: "" });
  };

  // react-select styling + portal to avoid clipping behind containers
  const selectStyles = {
    control: (base, state) => ({
      ...base,
      borderRadius: 12,
      borderColor: state.isFocused ? "#fb7185" : "#e5e7eb",
      boxShadow: state.isFocused ? "0 0 0 4px rgba(244,63,94,0.15)" : "none",
      padding: 2,
      minHeight: 42,
      ":hover": { borderColor: "#fb7185" },
      background: "white",
    }),
    valueContainer: (b) => ({ ...b, padding: "0 8px" }),
    menuPortal: (b) => ({ ...b, zIndex: 9999 }),
    menu: (b) => ({ ...b, zIndex: 9999 }),
  };

  const selectedRecipe = useMemo(() => {
    const id = form.recipeId;
    if (!id) return null;
    const match = (recipes || []).find((r) => (r._id || r.id) === id);
    return match ? { value: match._id || match.id, label: match.name } : null;
  }, [form.recipeId, recipes]);

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="bg-white/80 p-6 rounded-2xl shadow border border-gray-100 backdrop-blur-sm"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="flex items-center gap-3 mb-4 text-gray-800">
        <div className="grid place-items-center h-10 w-10 rounded-xl bg-rose-50 text-rose-600 border border-rose-100"><FaClipboardList /></div>
        <h2 className="text-xl font-bold">Log Production Batch</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Recipe Select */}
        <div>
          <label className="text-sm text-gray-600 block mb-1">Recipe</label>
          <div className="relative z-50">
            <Select
              options={recipeOptions}
              value={selectedRecipe}
              onChange={handleSelectChange}
              placeholder="Select Recipe"
              styles={selectStyles}
              classNamePrefix="prod"
              menuPortalTarget={typeof window !== "undefined" ? document.body : null}
              menuPosition="fixed"
              menuShouldScrollIntoView={false}
            />
          </div>
        </div>

        {/* Quantity */}
        <div>
          <label className="text-sm text-gray-600 block mb-1">Quantity Produced</label>
          <input
            type="number"
            name="quantity"
            value={form.quantity}
            onChange={handleChange}
            placeholder="e.g. 100"
            className="w-full border rounded-xl px-3 py-2 focus:border-rose-400 focus:ring-4 focus:ring-rose-200/50 outline-none"
            required
            min={0}
          />
        </div>

        {/* Date */}
        <div>
          <label className="text-sm text-gray-600 block mb-1">Production Date</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="w-full border rounded-xl px-3 py-2 focus:border-rose-400 focus:ring-4 focus:ring-rose-200/50 outline-none"
            required
          />
        </div>

        {/* Base */}
        <div>
          <label className="text-sm text-gray-600 block mb-1">Base / Location</label>
          <input
            type="text"
            name="base"
            value={form.base}
            onChange={handleChange}
            placeholder="e.g. Camp Alpha"
            className="w-full border rounded-xl px-3 py-2 focus:border-rose-400 focus:ring-4 focus:ring-rose-200/50 outline-none"
            required
          />
        </div>

        {/* Handler */}
        <div>
          <label className="text-sm text-gray-600 block mb-1">Handled By</label>
          <input
            type="text"
            name="handler"
            value={form.handler}
            onChange={handleChange}
            placeholder="Staff name"
            className="w-full border rounded-xl px-3 py-2 focus:border-rose-400 focus:ring-4 focus:ring-rose-200/50 outline-none"
            required
          />
        </div>
      </div>

      <motion.button
        type="submit"
        whileTap={{ scale: 0.98 }}
        className="bg-rose-600 text-white px-6 py-2 rounded-xl hover:bg-rose-700 shadow focus:outline-none focus:ring-4 focus:ring-rose-200/60 inline-flex items-center gap-2"
      >
        <FaCheck /> Save Production Log
      </motion.button>
    </motion.form>
  );
}