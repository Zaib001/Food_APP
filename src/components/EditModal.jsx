import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function EditModal({ isOpen, title, initialValues, onSave, onClose, fields }) {
  const [formData, setFormData] = useState(initialValues || {});

  useEffect(() => {
    if (initialValues) setFormData(initialValues);
  }, [initialValues]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white w-full max-w-md rounded-lg shadow-xl p-6"
            initial={{ scale: 0.9, y: -20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-xl font-bold mb-4">{title || 'Edit Item'}</h2>
            <div className="space-y-4">
              {fields.map((field) => (
                <div key={field.name}>
                  <label className="block text-sm text-gray-700 mb-1">{field.label}</label>
                  <input
                    type={field.type || 'text'}
                    name={field.name}
                    value={formData[field.name] || ''}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
                  />
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end space-x-2">
              <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:text-gray-800">Cancel</button>
              <button onClick={handleSubmit} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                Save
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
