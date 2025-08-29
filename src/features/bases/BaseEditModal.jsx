// BaseEditModal.jsx
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaSave } from "react-icons/fa";

export default function BaseEditModal({ open, onClose, base, onSave }) {
  const [form, setForm] = useState({
    name: "",
    code: "",
    location: "",
    contact: "",
    notes: "",
  });

  // Prefill
  useEffect(() => {
    if (base) {
      setForm({
        name: base.name || "",
        code: base.code || "",
        location: base.location || "",
        contact: base.contact || "",
        notes: base.notes || "",
      });
    } else {
      setForm({ name: "", code: "", location: "", contact: "", notes: "" });
    }
  }, [base]);

  // Lock background scroll + Esc to close
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const handleChange = (k, v) => setForm((p) => ({ ...p, [k]: v }));
  const handleSubmit = (e) => {
    e?.preventDefault?.();
    onSave?.({ ...base, ...form });
    onClose?.();
  };

  const modal = (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/50"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Centered dialog */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Edit Base"
            className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-rose-100 overflow-hidden"
            initial={{ opacity: 0, scale: 0.96, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 6 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="border-b bg-gradient-to-r from-rose-600 via-rose-500 to-pink-500 text-white">
              <div className="px-5 py-4 flex items-center justify-between">
                <h2 className="text-lg font-bold">
                  Edit Base{base?.name ? ` – ${base.name}` : ""}
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full bg-white/15 hover:bg-white/25 focus:outline-none focus:ring-2 focus:ring-white/60"
                  aria-label="Close"
                  title="Close"
                >
                  <FaTimes />
                </button>
              </div>
            </div>

            {/* Content (scrolls inside modal if tall) */}
            <form onSubmit={handleSubmit} className="max-h-[70vh] overflow-y-auto p-5 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="text-sm">
                  <span className="mb-1 block font-medium text-gray-700">Base Name *</span>
                  <input
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:border-rose-400 focus:ring-4 focus:ring-rose-200/50 outline-none"
                    placeholder="e.g. Camp Alpha"
                    required
                  />
                </label>

                <label className="text-sm">
                  <span className="mb-1 block font-medium text-gray-700">Code</span>
                  <input
                    value={form.code}
                    onChange={(e) => handleChange("code", e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:border-rose-400 focus:ring-4 focus:ring-rose-200/50 outline-none"
                    placeholder="e.g. ALP"
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="text-sm">
                  <span className="mb-1 block font-medium text-gray-700">Location</span>
                  <input
                    value={form.location}
                    onChange={(e) => handleChange("location", e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:border-rose-400 focus:ring-4 focus:ring-rose-200/50 outline-none"
                    placeholder="City / Coordinates"
                  />
                </label>

                <label className="text-sm">
                  <span className="mb-1 block font-medium text-gray-700">Contact</span>
                  <input
                    value={form.contact}
                    onChange={(e) => handleChange("contact", e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:border-rose-400 focus:ring-4 focus:ring-rose-200/50 outline-none"
                    placeholder="Name / Phone / Email"
                  />
                </label>
              </div>

              <label className="text-sm block">
                <span className="mb-1 block font-medium text-gray-700">Notes</span>
                <textarea
                    value={form.notes}
                    onChange={(e) => handleChange("notes", e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:border-rose-400 focus:ring-4 focus:ring-rose-200/50 outline-none"
                    placeholder="Operational notes, access rules, etc."
                />
              </label>
            </form>

            {/* Footer */}
            <div className="border-t bg-white px-5 py-3 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white font-semibold shadow hover:bg-rose-700 flex items-center gap-2"
              >
                <FaSave /> Save
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Render OUTSIDE any transformed/overflow ancestors
  return open ? createPortal(modal, document.body) : null;
}
