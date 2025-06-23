import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Reusable input component
const InputField = ({ label, tooltip, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
      {tooltip && <span title={tooltip} className="text-gray-400 ml-1 cursor-help">ℹ️</span>}
    </label>
    <input
      {...props}
      className="w-full border border-gray-300 rounded-md px-4 py-2"
    />
  </div>
);

// Reusable select component
const SelectField = ({ label, tooltip, options = [], ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
      {tooltip && <span title={tooltip} className="text-gray-400 ml-1 cursor-help">ℹ️</span>}
    </label>
    <select
      {...props}
      className="w-full border border-gray-300 rounded-md px-4 py-2"
    >
      <option value="">Select</option>
      {options.map(opt => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  </div>
);

export default function EditModal({ isOpen, title, initialValues = {}, onSave, onClose, fields = [] }) {
  const [formData, setFormData] = useState(initialValues);
  const [errors, setErrors] = useState({});

  useEffect(() => {
  if (isOpen) {
    setFormData(initialValues || {});
    setErrors({});
  }
}, [isOpen]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    fields.forEach(field => {
      const val = formData[field.name];
      if (field.required && !val) newErrors[field.name] = `${field.label} is required`;

      if (field.type === 'number') {
        const num = parseFloat(val);
        if (isNaN(num)) {
          newErrors[field.name] = `${field.label} must be a number`;
        } else if (field.min !== undefined && num < field.min) {
          newErrors[field.name] = `${field.label} must be at least ${field.min}`;
        } else if (field.max !== undefined && num > field.max) {
          newErrors[field.name] = `${field.label} must be at most ${field.max}`;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
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
                  {field.type === 'select' ? (
                    <SelectField
                      label={field.label}
                      name={field.name}
                      value={formData[field.name] || ''}
                      onChange={handleChange}
                      tooltip={field.tooltip}
                      options={field.options || []}
                    />
                  ) : (
                    <InputField
                      label={field.label}
                      name={field.name}
                      type={field.type || 'text'}
                      value={formData[field.name] || ''}
                      onChange={handleChange}
                      tooltip={field.tooltip}
                    />
                  )}
                  {errors[field.name] && (
                    <p className="text-sm text-red-500 mt-1">{errors[field.name]}</p>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end space-x-2">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Save
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
