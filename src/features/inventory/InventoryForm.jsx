// --- InventoryForm.jsx (drop-in replacement) ---
import React, { useEffect, useMemo, useState } from "react";
import Select from "react-select";
import { motion } from "framer-motion";
import { FaWarehouse, FaSave } from "react-icons/fa";

export default function InventoryForm({ ingredients = [], initialData = {}, onSave, suppliers = [] }) {
  const [form, setForm] = useState({
    ingredientId: "",
    supplier: "",
    quantity: "",
    unit: "",
    date: "",
    notes: "",
  });

  const ingredientOptions = useMemo(
    () =>
      ingredients.map((i) => ({
        value: i._id ?? i.id, // support either shape
        label: i.name,
      })),
    [ingredients]
  );

  useEffect(() => {
    if (initialData && Object.keys(initialData).length) {
      setForm((prev) => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSelect = (field, selected) => setForm({ ...form, [field]: selected?.value || "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave?.(form);
    setForm({ ingredientId: "", supplier: "", quantity: "", unit: "", date: "", notes: "" });
  };

  // react-select styling + portal to avoid clipping behind modals/overflow
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

  const selectedIngredient = useMemo(() => {
    const id = form.ingredientId;
    if (!id) return null;
    const match = ingredients.find((i) => (i._id ?? i.id) === id);
    return match ? { value: match._id ?? match.id, label: match.name } : null;
  }, [form.ingredientId, ingredients]);

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="bg-white/80 p-6 rounded-2xl shadow border border-gray-100 backdrop-blur-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="flex items-center gap-3 mb-4 text-gray-800">
        <div className="grid place-items-center h-10 w-10 rounded-xl bg-rose-50 text-rose-600 border border-rose-100">
          <FaWarehouse />
        </div>
        <h2 className="text-xl font-bold">Add / Update Inventory</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Ingredient */}
        <div>
          <label className="block text-sm text-gray-700 mb-1">Ingredient</label>
          <div className="relative z-50">
            <Select
              options={ingredientOptions}
              value={selectedIngredient}
              onChange={(opt) => handleSelect("ingredientId", opt)}
              placeholder="Select ingredient"
              styles={selectStyles}
              classNamePrefix="inv"
              menuPortalTarget={typeof window !== "undefined" ? document.body : null}
              menuPosition="fixed"
              menuShouldScrollIntoView={false}
            />
          </div>
        </div>

        {/* Supplier (with suggestions via datalist) */}
        <div>
          <label className="block text-sm text-gray-700 mb-1">Supplier</label>
          <input
            type="text"
            name="supplier"
            value={form.supplier}
            onChange={handleChange}
            placeholder="Enter supplier name"
            list="supplier-suggestions"
            className="border rounded-xl px-3 py-2 w-full focus:border-rose-400 focus:ring-4 focus:ring-rose-200/50 outline-none"
          />
          <datalist id="supplier-suggestions">
            {suppliers.map((s) => (
              <option key={s} value={s} />
            ))}
          </datalist>
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-sm text-gray-700 mb-1">Quantity</label>
          <input
            type="number"
            name="quantity"
            min="0"
            value={form.quantity}
            onChange={handleChange}
            className="border rounded-xl px-3 py-2 w-full focus:border-rose-400 focus:ring-4 focus:ring-rose-200/50 outline-none"
            required
          />
        </div>

        {/* Unit */}
        <div>
          <label className="block text-sm text-gray-700 mb-1">Unit</label>
          <input
            type="text"
            name="unit"
            placeholder="e.g. kg, jug"
            value={form.unit}
            onChange={handleChange}
            className="border rounded-xl px-3 py-2 w-full focus:border-rose-400 focus:ring-4 focus:ring-rose-200/50 outline-none"
          />
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm text-gray-700 mb-1">Delivery Date</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="border rounded-xl px-3 py-2 w-full focus:border-rose-400 focus:ring-4 focus:ring-rose-200/50 outline-none"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm text-gray-700 mb-1">Notes (optional)</label>
          <input
            type="text"
            name="notes"
            value={form.notes}
            onChange={handleChange}
            className="border rounded-xl px-3 py-2 w-full focus:border-rose-400 focus:ring-4 focus:ring-rose-200/50 outline-none"
          />
        </div>
      </div>

      <motion.button
        type="submit"
        whileTap={{ scale: 0.98 }}
        className="mt-6 inline-flex items-center gap-2 bg-rose-600 text-white px-6 py-2 rounded-xl hover:bg-rose-700 shadow focus:outline-none focus:ring-4 focus:ring-rose-200/60"
      >
        <FaSave /> Save Entry
      </motion.button>
    </motion.form>
  );
}