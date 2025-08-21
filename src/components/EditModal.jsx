// src/components/EditModal.jsx
import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { createPortal } from 'react-dom';

export default function EditModal({
  isOpen,
  onClose,
  onSave,
  title = 'Edit',
  fields = [],
  initialValues = {},
}) {
  const [form, setForm] = useState(initialValues);
  const modalRef = useRef(null);
  const lastFocusedRef = useRef(null);

  useEffect(() => setForm(initialValues || {}), [initialValues, isOpen]);

  // === Lock body scroll + restore focus ===
  useEffect(() => {
    if (!isOpen) return;
    // remember last focused element
    lastFocusedRef.current = document.activeElement;
    // lock scroll
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';

    // ESC to close
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
      if (e.key === 'Tab') trapFocus(e);
    };
    window.addEventListener('keydown', onKey);

    // focus the first focusable in modal
    requestAnimationFrame(() => {
      const el = modalRef.current;
      if (!el) return;
      const focusables = el.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusables.length) focusables[0].focus();
    });

    return () => {
      // restore scroll + focus
      document.body.style.overflow = overflow;
      window.removeEventListener('keydown', onKey);
      lastFocusedRef.current?.focus?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const trapFocus = (e) => {
    const el = modalRef.current;
    if (!el) return;
    const focusables = el.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const handleChange = (name, value) => setForm((prev) => ({ ...prev, [name]: value }));

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
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-300"
          >
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
          onChange={(e) =>
            handleChange(name, type === 'number' ? Number(e.target.value) : e.target.value)
          }
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-300"
        />
      </div>
    );
  };

  if (!isOpen) return null;

  const content = (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        // click on backdrop closes
        onClick={onClose}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Panel */}
        <motion.div
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-label={title}
          className="relative bg-white rounded-xl w-full max-w-xl max-h-[85vh] overflow-auto p-5 shadow-2xl border border-rose-100"
          initial={{ y: 30, opacity: 0, scale: 0.98 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 30, opacity: 0, scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 260, damping: 24 }}
          // prevent backdrop click from closing when clicking inside panel
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">{title}</h3>
            <button
              onClick={onClose}
              className="px-2 py-1 rounded text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-rose-300"
            >
              Close
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{fields.map(renderField)}</div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded border hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-rose-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded bg-rose-600 text-white hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-300"
              >
                Save
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );

  // PORTAL ensures the modal is pinned to <body>, not a transformed ancestor.
  return createPortal(content, document.body);
}
