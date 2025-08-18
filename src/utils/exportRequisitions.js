// src/utils/exportRequisitions.js

// No types in JS, just plain object usage
const toCell = (v) => {
  if (v === null || v === undefined) return '';
  const s = String(v);
  // escape " and wrap if needed
  const needsWrap = /[",\n]/.test(s);
  const esc = s.replace(/"/g, '""');
  return needsWrap ? `"${esc}"` : esc;
};

export function exportRequisitionsToCSV(rows, filename) {
  if (!Array.isArray(rows) || rows.length === 0) {
    rows = [];
  }

  // Define the columns you want in the CSV (order matters)
  const headers = [
    { key: 'date',        label: 'Date' },
    { key: 'supplier',    label: 'Supplier' },
    { key: 'item',        label: 'Item' },
    { key: 'quantity',    label: 'Quantity' },
    { key: 'unit',        label: 'Unit' },
    { key: 'base',        label: 'Base' },
    { key: 'requestedBy', label: 'Requested By' },
    { key: 'status',      label: 'Status' },
    { key: '_id',         label: 'Requisition ID' },
    { key: 'plan',        label: 'Plan' },
    { key: 'notes',       label: 'Notes' },
    { key: 'createdAt',   label: 'Created At' },
    { key: 'updatedAt',   label: 'Updated At' },
  ];

  // Sort by supplier => date
  const sorted = [...rows].sort((a, b) => {
    const s1 = (a.supplier || '').localeCompare(b.supplier || '');
    if (s1 !== 0) return s1;
    return (a.date || '').localeCompare(b.date || '');
  });

  const headerLine = headers.map(h => toCell(h.label)).join(',');
  const bodyLines = sorted.map(r =>
    headers.map(h => toCell(r[h.key] ?? '')).join(',')
  );

  // Add UTF-8 BOM for Excel compatibility
  const csv = '\uFEFF' + [headerLine, ...bodyLines].join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename || `requisitions_${new Date().toISOString().slice(0,10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Optional: export one CSV per supplier (multiple downloads)
 */
export function exportPerSupplierCSVs(rows) {
  const bySupplier = {};
  for (const r of rows) {
    const key = r.supplier || 'Unknown';
    if (!bySupplier[key]) bySupplier[key] = [];
    bySupplier[key].push(r);
  }
  Object.entries(bySupplier).forEach(([supplier, list]) =>
    exportRequisitionsToCSV(list, `requisitions_${supplier}_${new Date().toISOString().slice(0,10)}.csv`)
  );
}
