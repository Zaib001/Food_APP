// src/utils/exportRequisitions.js

/** Convert any value to a safe CSV cell */
const toCell = (v) => {
  if (v === null || v === undefined) return "";

  // JSON-stringify plain objects/arrays to keep the CSV structure intact
  if (typeof v === "object") {
    try {
      v = JSON.stringify(v);
    } catch {
      v = String(v);
    }
  }

  const s = String(v);

  // Excel is happier without commas in date locales; keep ISO without commas
  // (we don't inject commas anyway, so this is fine)

  // Escape quotes and wrap if contains comma, quote, or newline
  const needsWrap = /[",\n\r]/.test(s);
  const esc = s.replace(/"/g, '""');
  return needsWrap ? `"${esc}"` : esc;
};

/** Get a field either from the requisition header OR fallback to items[0] */
const getField = (r, key) => {
  if (r == null) return "";
  if (r[key] !== undefined && r[key] !== null && r[key] !== "") return r[key];
  const first = Array.isArray(r.items) && r.items.length ? r.items[0] : null;
  if (first && first[key] !== undefined && first[key] !== null && first[key] !== "") {
    return first[key];
  }
  return "";
};

/** Normalize/format date/time safely for CSV */
const fmtDate = (v) => {
  if (!v) return "";
  // If it's already YYYY-MM-DD or similar, keep it
  if (typeof v === "string") return v;
  try {
    const d = new Date(v);
    if (!isNaN(d.getTime())) return d.toISOString();
  } catch {}
  return String(v);
};

/** CSV headers (order matters) */
const HEADERS = [
  { key: "date",        label: "Date",        format: fmtDate },
  { key: "supplier",    label: "Supplier" },
  { key: "item",        label: "Item" },
  { key: "quantity",    label: "Quantity" },
  { key: "unit",        label: "Unit" },
  { key: "base",        label: "Base" },
  { key: "requestedBy", label: "Requested By" },
  { key: "status",      label: "Status" },
  { key: "_id",         label: "Requisition ID" },
  { key: "plan",        label: "Plan" },
  { key: "notes",       label: "Notes" },
  { key: "createdAt",   label: "Created At",  format: fmtDate },
  { key: "updatedAt",   label: "Updated At",  format: fmtDate },
];

/** Build a single CSV line from an object */
const lineFromRow = (r) =>
  HEADERS.map((h) => {
    const raw = getField(r, h.key);
    const val = h.format ? h.format(raw) : raw;
    return toCell(val);
  }).join(",");

/** Export all requisitions to a single CSV download */
export function exportRequisitionsToCSV(rows, filename) {
  const list = Array.isArray(rows) ? rows.slice() : [];

  // Sort by supplier then date (using fallbacks)
  list.sort((a, b) => {
    const sa = String(getField(a, "supplier") || "").localeCompare(String(getField(b, "supplier") || ""));
    if (sa !== 0) return sa;
    return String(getField(a, "date") || "").localeCompare(String(getField(b, "date") || ""));
  });

  // Excel separator hint + UTF-8 BOM + CRLF line endings
  const headerLine = HEADERS.map((h) => toCell(h.label)).join(",");
  const bodyLines = list.map(lineFromRow);

  // Important: CRLF so Excel splits rows correctly on Windows
  const CRLF = "\r\n";
  const csvBody = [headerLine, ...bodyLines].join(CRLF);

  // Prepend "sep=," line so Excel knows the delimiter, then add BOM
  const csv = "\uFEFF" + "sep=," + CRLF + csvBody + CRLF;

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename || `requisitions_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/** Export one CSV per supplier (multiple downloads) */
export function exportPerSupplierCSVs(rows) {
  const list = Array.isArray(rows) ? rows : [];
  const bySupplier = {};

  for (const r of list) {
    const key = getField(r, "supplier") || "Unknown";
    if (!bySupplier[key]) bySupplier[key] = [];
    bySupplier[key].push(r);
  }

  Object.entries(bySupplier).forEach(([supplier, subset]) =>
    exportRequisitionsToCSV(subset, `requisitions_${supplier}_${new Date().toISOString().slice(0, 10)}.csv`)
  );
}
