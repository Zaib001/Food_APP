// src/components/EditModal.jsx
import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { createPortal } from 'react-dom';

/**
 * EditModal
 * Props:
 * - isOpen: boolean
 * - onClose: () => void
 * - onSave: (form) => Promise|void
 * - title?: string
 * - fields?: Array<{ name, label, type?, options? }>
 * - initialValues?: object
 * - onValidate?: (form) => ({ [field]: string } | null)  // return errors map or null
 * - busy?: boolean                                      // externally control busy state (optional)
 * - saveLabel?: string
 * - cancelLabel?: string
 */
export default function EditModal({
  isOpen,
  onClose,
  onSave,
  title = 'Edit',
  fields = [],
  initialValues = {},
  onValidate,
  busy: busyProp,
  saveLabel = 'Save',
  cancelLabel = 'Cancel',
}) {
  const [form, setForm] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [busyLocal, setBusyLocal] = useState(false);

  const busy = busyProp ?? busyLocal;

  const modalRef = useRef(null);
  const lastFocusedRef = useRef(null);

  // Sync initial values when opened
  useEffect(() => {
    if (isOpen) {
      setForm(initialValues || {});
      setErrors({});
    }
  }, [initialValues, isOpen]);

  // Lock body scroll + focus management
  useEffect(() => {
    if (!isOpen) return;

    lastFocusedRef.current = document.activeElement;

    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';

    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
      if (e.key === 'Tab') trapFocus(e);
    };
    window.addEventListener('keydown', onKey);

    // focus the first focusable in modal
    requestAnimationFrame(() => {
      const el = modalRef.current;
      if (!el) return;
      const focusables = getFocusables(el);
      if (focusables.length) focusables[0].focus();
    });

    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener('keydown', onKey);
      // restore focus to trigger
      lastFocusedRef.current?.focus?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const getFocusables = (root) =>
    root.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

  const trapFocus = (e) => {
    const el = modalRef.current;
    if (!el) return;
    const focusables = getFocusables(el);
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

  const handleChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (typeof onValidate === 'function') {
      const errs = onValidate(form) || {};
      setErrors(errs);
      if (Object.keys(errs).length > 0) return;
    }

    try {
      if (busyProp === undefined) setBusyLocal(true);
      const maybePromise = onSave?.(form);
      if (maybePromise && typeof maybePromise.then === 'function') {
        await maybePromise;
      }
      onClose?.();
    } catch (err) {
      // Keep modal open, surface error in console
      // (You can add a toast system here if you use one)
      console.error('[EditModal] onSave failed:', err);
    } finally {
      if (busyProp === undefined) setBusyLocal(false);
    }
  };

  const renderField = (f) => {
    const { name, label, type = 'text', options = [] } = f;
    const value = form?.[name] ?? '';
    const error = errors?.[name];

    if (type === 'select') {
      return (
        <div key={name} className="flex flex-col gap-1">
          <label className="text-sm text-gray-700">{label}</label>
          <select
            value={value}
            onChange={(e) => handleChange(name, e.target.value)}
            className={`border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-300 ${
              error ? 'border-rose-400' : 'border-gray-300'
            }`}
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
          {error && <p className="text-xs text-rose-600">{error}</p>}
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
          className={`border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-300 ${
            error ? 'border-rose-400' : 'border-gray-300'
          }`}
        />
        {error && <p className="text-xs text-rose-600">{error}</p>}
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
        onClick={busy ? undefined : onClose} // disable backdrop close while busy
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
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">{title}</h3>
            <button
              onClick={onClose}
              disabled={busy}
              className="px-2 py-1 rounded text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-rose-300 disabled:opacity-50"
            >
              Close
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fields.map(renderField)}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={busy}
                className="px-4 py-2 rounded border hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-rose-300 disabled:opacity-50"
              >
                {cancelLabel}
              </button>
              <button
                type="submit"
                disabled={busy}
                className="px-4 py-2 rounded bg-rose-600 text-white hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-300 disabled:opacity-50"
              >
                {busy ? 'Saving…' : saveLabel}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );

  // Use a portal so the modal is not constrained by parent stacking contexts/transforms.
  return createPortal(content, document.body);
}
