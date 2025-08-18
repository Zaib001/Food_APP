// src/components/admin/Toolbar.jsx
import React from 'react';

export default function Toolbar({ left, right }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
      <div className="flex items-center gap-2">{left}</div>
      <div className="flex items-center gap-2">{right}</div>
    </div>
  );
}
