import React from 'react';

export const InputField = ({ label, tooltip, error, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
      {tooltip && <span title={tooltip} className="text-gray-400 ml-1 cursor-help">ℹ️</span>}
    </label>
    <input
      {...props}
      className={`w-full border px-4 py-2 rounded-md ${
        error ? 'border-red-500' : 'border-gray-300'
      }`}
    />
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

export const SelectField = ({ label, options, error, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <select
      {...props}
      className={`w-full border px-4 py-2 rounded-md ${
        error ? 'border-red-500' : 'border-gray-300'
      }`}
    >
      <option value="">Select</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);
