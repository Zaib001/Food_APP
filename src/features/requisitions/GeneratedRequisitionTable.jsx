import React from 'react';
import { FaCheckCircle, FaTruck, FaUtensils } from 'react-icons/fa';

export default function GeneratedRequisitionTable({
  requisitions = [],
  onApprove,        // (id) => void
  onBulkApprove,    // (filter) => void  e.g. { date, base }
}) {
  if (!requisitions || requisitions.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-6 text-sm">
        No requisitions generated from menus yet.
      </div>
    );
  }

  const isHeaderRow = (req) => Array.isArray(req?.items); // header-level if items array exists

  return (
    <div className="mt-6 bg-white shadow-lg rounded-xl p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold flex items-center gap-2 text-gray-800">
          <FaUtensils className="text-rose-600" />
          Menu-Based Requisitions
        </h2>

        {onBulkApprove && (
          <div className="flex gap-2">
            {/* Example bulk: approve all visible */}
            <button
              onClick={() => onBulkApprove({})}
              className="px-3 py-2 rounded-lg bg-emerald-600 text-white text-sm hover:bg-emerald-700"
              title="Approve all listed requisitions"
            >
              Approve All Listed
            </button>
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border border-gray-200">
          <thead className="bg-gray-100 text-gray-700 font-medium">
            <tr>
              <th className="p-3 border-b">Date</th>
              <th className="p-3 border-b">Base</th>
              <th className="p-3 border-b">Meal</th>
              <th className="p-3 border-b">Items / Item</th>
              <th className="p-3 border-b">Qty / Total</th>
              <th className="p-3 border-b">Unit</th>
              <th className="p-3 border-b">Status</th>
              <th className="p-3 border-b text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {requisitions.map((req, idx) => {
              if (isHeaderRow(req)) {
                const itemsCount = req.items?.length || 0;
                // Optional total quantity across items (if quantities exist)
                const totalQty = req.items?.reduce((s, it) => s + (Number(it.quantity) || 0), 0) || 0;

                return (
                  <tr
                    key={req._id || idx}
                    className={`transition-all ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-rose-50`}
                  >
                    <td className="p-3 border-b">{req.date || '—'}</td>
                    <td className="p-3 border-b">{req.base || '—'}</td>
                    <td className="p-3 border-b capitalize">{req.mealType || '—'}</td>
                    <td className="p-3 border-b">{itemsCount} item{itemsCount === 1 ? '' : 's'}</td>
                    <td className="p-3 border-b">{totalQty || '—'}</td>
                    <td className="p-3 border-b">—</td>
                    <td className="p-3 border-b">
                      <StatusPill status={req.status} />
                    </td>
                    <td className="p-3 border-b text-right">
                      {onApprove && req._id && req.status !== 'approved' && (
                        <button
                          onClick={() => onApprove(req._id)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs hover:bg-emerald-700"
                          title="Approve header"
                        >
                          <FaCheckCircle /> Approve
                        </button>
                      )}
                    </td>
                  </tr>
                );
              }

              // Fallback: line-level legacy row
              return (
                <tr
                  key={idx}
                  className={`transition-all ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-rose-50`}
                >
                  <td className="p-3 border-b">{req.date}</td>
                  <td className="p-3 border-b">{req.base}</td>
                  <td className="p-3 border-b">—</td>
                  <td className="p-3 border-b">{req.item}</td>
                  <td className="p-3 border-b">{req.quantity}</td>
                  <td className="p-3 border-b">{req.unit}</td>
                  <td className="p-3 border-b">
                    <StatusPill status={req.status} />
                  </td>
                  <td className="p-3 border-b text-right">—</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusPill({ status }) {
  const s = String(status || '').toLowerCase();
  const map = {
    pending: 'bg-amber-50 text-amber-700 border-amber-200',
    approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    completed: 'bg-sky-50 text-sky-700 border-sky-200',
  };
  const cls = map[s] || 'bg-gray-50 text-gray-700 border-gray-200';
  const label = s ? s.charAt(0).toUpperCase() + s.slice(1) : '—';
  return <span className={`inline-flex items-center px-2 py-0.5 text-xs rounded-full border ${cls}`}>{label}</span>;
}
