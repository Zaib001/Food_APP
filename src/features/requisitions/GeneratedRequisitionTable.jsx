import React, { useState } from 'react';
import { FaCheckCircle, FaUtensils, FaFlagCheckered, FaTimes } from 'react-icons/fa';

export default function GeneratedRequisitionTable({
  requisitions = [],
  onApprove,
  onBulkApprove,
  onComplete,
}) {
  const [completionModalOpen, setCompletionModalOpen] = useState(false);
  const [selectedRequisition, setSelectedRequisition] = useState(null);
  const [actualQuantities, setActualQuantities] = useState({});

  if (!requisitions || requisitions.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-6 text-sm">
        No requisitions generated from menus yet.
      </div>
    );
  }

  const isHeaderRow = (req) => Array.isArray(req?.items);

  const handleCompleteClick = (req) => {
    setSelectedRequisition(req);
    
    // Initialize actual quantities with requested quantities
    const initialQuantities = {};
    if (req.items) {
      req.items.forEach(item => {
        initialQuantities[item._id] = item.quantity || 0;
      });
    }
    setActualQuantities(initialQuantities);
    setCompletionModalOpen(true);
  };

  const handleQuantityChange = (itemId, value) => {
    setActualQuantities(prev => ({
      ...prev,
      [itemId]: parseFloat(value) || 0
    }));
  };

  const handleCompletionSubmit = () => {
    if (selectedRequisition && onComplete) {
      onComplete(selectedRequisition._id, {
        actualQuantities,
        completedBy: localStorage.getItem('userName') || 'User',
        notes: '' // You can add notes field if needed
      });
    }
    setCompletionModalOpen(false);
    setSelectedRequisition(null);
    setActualQuantities({});
  };

  const CompletionModal = () => {
    if (!selectedRequisition || !selectedRequisition.items) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FaFlagCheckered className="text-2xl" />
                <h2 className="text-xl font-bold">Complete Requisition</h2>
              </div>
              <button
                onClick={() => setCompletionModalOpen(false)}
                className="p-2 hover:bg-white/20 rounded-full transition"
              >
                <FaTimes />
              </button>
            </div>
            <p className="mt-2 text-green-100">
              {selectedRequisition.menuName} - {selectedRequisition.date} • {selectedRequisition.base}
            </p>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Enter Actual Quantities Received
              </h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-3 text-left">Item</th>
                      <th className="p-3 text-right">Requested Qty</th>
                      <th className="p-3 text-right">Actual Received</th>
                      <th className="p-3 text-right">Unit</th>
                      <th className="p-3 text-right">Difference</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedRequisition.items.map((item, index) => {
                      const requestedQty = item.quantity || 0;
                      const actualQty = actualQuantities[item._id] || 0;
                      const difference = actualQty - requestedQty;
                      
                      return (
                        <tr key={item._id} className={index % 2 ? 'bg-gray-50' : 'bg-white'}>
                          <td className="p-3 font-medium">{item.item}</td>
                          <td className="p-3 text-right text-gray-600">
                            {requestedQty}
                          </td>
                          <td className="p-3">
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={actualQuantities[item._id] || ''}
                              onChange={(e) => handleQuantityChange(item._id, e.target.value)}
                              className="w-full px-3 py-1 border border-gray-300 rounded text-right focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              placeholder="0.00"
                            />
                          </td>
                          <td className="p-3 text-right text-gray-600">
                            {item.unit}
                          </td>
                          <td className={`p-3 text-right font-medium ${
                            difference === 0 ? 'text-gray-600' :
                            difference > 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {difference > 0 ? '+' : ''}{difference}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2">Summary</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Total Requested: </span>
                  <strong>
                    {selectedRequisition.items.reduce((sum, item) => sum + (item.quantity || 0), 0)}
                  </strong>
                </div>
                <div>
                  <span className="text-gray-600">Total Received: </span>
                  <strong>
                    {Object.values(actualQuantities).reduce((sum, qty) => sum + (qty || 0), 0)}
                  </strong>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 p-6 flex justify-end gap-3">
            <button
              onClick={() => setCompletionModalOpen(false)}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleCompletionSubmit}
              className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition flex items-center gap-2"
            >
              <FaCheckCircle />
              Complete Requisition
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="mt-6 bg-white shadow-lg rounded-xl p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold flex items-center gap-2 text-gray-800">
            <FaUtensils className="text-rose-600" />
            Menu-Based Requisitions
          </h2>

          <div className="flex gap-2">
            {onBulkApprove && (
              <button
                onClick={() => onBulkApprove({})}
                className="px-3 py-2 rounded-lg bg-emerald-600 text-white text-sm hover:bg-emerald-700"
                title="Approve all listed requisitions"
              >
                Approve All Listed
              </button>
            )}
          </div>
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
                      <td className="p-3 border-b text-right space-x-2">
                        {onApprove && req._id && req.status !== 'approved' && req.status !== 'completed' && (
                          <button
                            onClick={() => onApprove(req._id)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs hover:bg-emerald-700"
                            title="Approve header"
                          >
                            <FaCheckCircle /> Approve
                          </button>
                        )}
                        {req.status === 'approved' && (
                          <button
                            onClick={() => handleCompleteClick(req)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-600 text-white text-xs hover:bg-green-700"
                            title="Complete (enter amounts)"
                          >
                            <FaFlagCheckered /> Complete
                          </button>
                        )}
                        {req.status === 'completed' && (
                          <span className="text-xs text-green-600 font-medium">Completed</span>
                        )}
                      </td>
                    </tr>
                  );
                }

                // Fallback: line-level legacy row
                return (
                  <tr
                    key={req._id || idx}
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
                    <td className="p-3 border-b text-right space-x-2">
                      {onApprove && req._id && req.status !== 'approved' && req.status !== 'completed' && (
                        <button
                          onClick={() => onApprove(req._id)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs hover:bg-emerald-700"
                          title="Approve"
                        >
                          <FaCheckCircle /> Approve
                        </button>
                      )}
                      {req.status === 'approved' && (
                        <button
                          onClick={() => handleCompleteClick(req)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-600 text-white text-xs hover:bg-green-700"
                          title="Complete (enter amounts)"
                        >
                          <FaFlagCheckered /> Complete
                        </button>
                      )}
                      {req.status === 'completed' && (
                        <span className="text-xs text-green-600 font-medium">Completed</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Completion Modal */}
      {completionModalOpen && <CompletionModal />}
    </>
  );
}

// StatusPill component with completed status
function StatusPill({ status }) {
  const s = String(status || '').toLowerCase();
  const map = {
    pending: 'bg-amber-50 text-amber-700 border-amber-200',
    approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    completed: 'bg-green-50 text-green-700 border-green-200',
    rejected: 'bg-red-50 text-red-700 border-red-200',
  };
  const cls = map[s] || 'bg-gray-50 text-gray-700 border-gray-200';
  const label = s ? s.charAt(0).toUpperCase() + s.slice(1) : '—';
  return <span className={`inline-flex items-center px-2 py-0.5 text-xs rounded-full border ${cls}`}>{label}</span>;
}