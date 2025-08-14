// src/components/EditModal.jsx
import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export default function EditModal({
  isOpen,
  onClose,
  onSave,
  title = 'Edit',
  fields = [],
  initialValues = {},
}) {
  const [form, setForm] = useState(initialValues);

  useEffect(() => setForm(initialValues || {}), [initialValues, isOpen]);

  const handleChange = (name, value) => {
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
    onClose();
  };

  const renderField = (f) => {
    const { name, label, type = 'text', options = [] } = f;
    const value = form?.[name] ?? '';

    if (type === 'select') {
      return (
        <div key={name} className="flex flex-col gap-1">
          <label className="text-sm text-gray-700">{label}</label>
          <select
            value={value}
            onChange={(e) => handleChange(name, e.target.value)}
            className="border rounded px-3 py-2"
          >
            {/* Placeholder if empty */}
            <option value="" disabled>
              Select {label}
            </option>
            {options.map((opt, i) => (
              <option key={`${name}-${i}`} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      );
    }

    return (
      <div key={name} className="flex flex-col gap-1">
        <label className="text-sm text-gray-700">{label}</label>
        <input
          type={type}
          value={value}
          onChange={(e) => handleChange(name, type === 'number' ? Number(e.target.value) : e.target.value)}
          className="border rounded px-3 py-2"
        />
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-white rounded-xl w-full max-w-xl p-5"
          initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">{title}</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">Close</button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fields.map(renderField)}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={onClose} className="px-4 py-2 rounded border">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700">
                Save
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
