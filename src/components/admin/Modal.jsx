// src/components/admin/Modal.jsx
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Modal({ open, title, children, onClose, footer }) {
  useEffect(() => {
    const closeOnEsc = (e) => e.key === 'Escape' && onClose?.();
    document.addEventListener('keydown', closeOnEsc);
    return () => document.removeEventListener('keydown', closeOnEsc);
  }, [onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/30 z-50 grid place-items-center p-4"
        >
          <motion.div
            initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }}
            className="bg-white rounded-2xl w-full max-w-2xl shadow-lg"
          >
            <div className="px-5 py-4 border-b flex items-center justify-between">
              <div className="text-lg font-semibold">{title}</div>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>
            <div className="p-5">{children}</div>
            {footer && <div className="px-5 py-4 border-t flex justify-end">{footer}</div>}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
