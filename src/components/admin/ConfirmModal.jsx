// src/components/admin/ConfirmModal.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ConfirmModal({ open, title="Confirm", message, onCancel, onConfirm }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/30 z-50 grid place-items-center px-4"
        >
          <motion.div
            initial={{ scale: .95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: .95, opacity: 0 }}
            className="bg-white rounded-2xl p-6 w-full max-w-md shadow-lg"
          >
            <div className="text-lg font-semibold text-gray-800">{title}</div>
            <p className="text-sm text-gray-600 mt-2">{message}</p>
            <div className="mt-5 flex justify-end gap-2">
              <button onClick={onCancel} className="px-4 py-2 rounded border hover:bg-gray-50">Cancel</button>
              <button onClick={onConfirm} className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700">Confirm</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
