import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaCheck, FaBox, FaCalculator } from 'react-icons/fa';

export default function CompletionModal({ isOpen, onClose, requisition, onComplete }) {
  const isHeader = Array.isArray(requisition?.items) && requisition.items.length > 0;

  // form state
  const [completedBy, setCompletedBy] = useState('');
  const [notes, setNotes] = useState('');
  const [receivedDate, setReceivedDate] = useState(() =>
    new Date().toISOString().slice(0, 10)
  );

  // Line states (for header w/ items)
  // shape: { [id]: number }
  const [receivedQtyById, setReceivedQtyById] = useState({});
  const [unitPriceById, setUnitPriceById] = useState({});

  // Single-line states (if no items[])
  const [singleReceivedQty, setSingleReceivedQty] = useState(0);
  const [singleUnitPrice, setSingleUnitPrice] = useState(0);
  const singleLineTotal = useMemo(
    () => Number(singleReceivedQty || 0) * Number(singleUnitPrice || 0),
    [singleReceivedQty, singleUnitPrice]
  );

  useEffect(() => {
    if (!isOpen || !requisition) return;

    // defaults
    const userName =
      localStorage.getItem('userName') ||
      localStorage.getItem('name') ||
      'User';
    setCompletedBy(userName);
    setNotes(requisition.notes || '');

    // header items init
    if (isHeader) {
      const rq = {};
      const up = {};
      requisition.items.forEach((it) => {
        rq[it._id] = typeof it.receivedQty === 'number' ? it.receivedQty : it.quantity || 0;
        up[it._id] = typeof it.unitPrice === 'number' ? it.unitPrice : 0;
      });
      setReceivedQtyById(rq);
      setUnitPriceById(up);
    } else {
      // single line init
      setSingleReceivedQty(requisition?.receivedQty ?? requisition?.quantity ?? 0);
      setSingleUnitPrice(requisition?.unitPrice ?? 0);
    }
  }, [isOpen, requisition, isHeader]);

  // per-line totals (header version)
  const lineTotals = useMemo(() => {
    if (!isHeader) return {};
    const map = {};
    requisition.items.forEach((it) => {
      const r = Number(receivedQtyById[it._id] || 0);
      const p = Number(unitPriceById[it._id] || 0);
      map[it._id] = r * p;
    });
    return map;
  }, [isHeader, requisition, receivedQtyById, unitPriceById]);

  const grandTotal = useMemo(() => {
    if (isHeader) {
      return requisition.items.reduce((sum, it) => sum + Number(lineTotals[it._id] || 0), 0);
    }
    return singleLineTotal;
  }, [isHeader, requisition, lineTotals, singleLineTotal]);

  const handleChangeQty = (id, val) => {
    setReceivedQtyById((prev) => ({ ...prev, [id]: val === '' ? '' : Number(val) || 0 }));
  };
  const handleChangePrice = (id, val) => {
    setUnitPriceById((prev) => ({ ...prev, [id]: val === '' ? '' : Number(val) || 0 }));
  };

  const handleSubmit = () => {
    if (!completedBy.trim()) {
      alert('Please enter your name');
      return;
    }
    const payloadBase = {
      receivedDate,
      completedBy: completedBy.trim(),
      notes: (notes || '').trim(),
    };

    if (isHeader) {
      const lines = requisition.items.map((it) => ({
        lineId: it._id,
        item: it.item,
        unit: it.unit,
        requestedQty: it.quantity,
        receivedQty: Number(receivedQtyById[it._id] || 0),
        unitPrice: Number(unitPriceById[it._id] || 0),
        lineTotal: Number(lineTotals[it._id] || 0),
      }));
      onComplete?.(requisition._id, { ...payloadBase, lines, grandTotal: Number(grandTotal || 0) });
    } else {
      const single = {
        lineId: requisition._id,
        item: requisition.item,
        unit: requisition.unit,
        requestedQty: requisition.quantity,
        receivedQty: Number(singleReceivedQty || 0),
        unitPrice: Number(singleUnitPrice || 0),
        lineTotal: Number(singleLineTotal || 0),
      };
      onComplete?.(requisition._id, { ...payloadBase, lines: [single], grandTotal: Number(grandTotal || 0) });
    }

    onClose?.();
  };

  if (!isOpen || !requisition) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[1000] flex items-start justify-center pt-8 sm:pt-16 px-4"
          // page never scrolls to find the modal; the panel scrolls inside
        >
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 240, damping: 22 }}
            className="w-full max-w-3xl bg-white rounded-2xl shadow-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-rose-600 to-pink-600 p-5 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FaBox className="text-2xl" />
                  <h2 className="text-xl font-bold">Complete Requisition</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-full transition"
                  aria-label="Close"
                >
                  <FaTimes />
                </button>
              </div>
              <p className="mt-1 text-rose-100 text-sm">
                {requisition.menuName || requisition.item || 'Requisition'} • {requisition.date} • {requisition.base}
              </p>
            </div>

            {/* Body (self-scrolling) */}
            <div className="max-h-[70vh] overflow-y-auto p-5">
              {/* Row: Received date & Completed by */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Received Date *
                  </label>
                  <input
                    type="date"
                    value={receivedDate}
                    onChange={(e) => setReceivedDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Completed By *
                  </label>
                  <input
                    type="text"
                    value={completedBy}
                    onChange={(e) => setCompletedBy(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    placeholder="Your name"
                  />
                </div>
              </div>

              {/* Notes */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  placeholder="Any additional notes..."
                />
              </div>

              {/* Lines */}
              {isHeader ? (
                <>
                  <h3 className="text-base font-semibold text-gray-800 mb-3">
                    Enter Received Qty & Unit Price
                  </h3>
                  <div className="overflow-x-auto border rounded-lg">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="p-3 text-left">Item</th>
                          <th className="p-3 text-right">Requested</th>
                          <th className="p-3 text-right">Received</th>
                          <th className="p-3 text-right">Unit</th>
                          <th className="p-3 text-right">Unit Price</th>
                          <th className="p-3 text-right">Line Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {requisition.items.map((it, i) => (
                          <tr key={it._id} className={i % 2 ? 'bg-gray-50' : 'bg-white'}>
                            <td className="p-3">{it.item}</td>
                            <td className="p-3 text-right text-gray-600">{it.quantity}</td>
                            <td className="p-3 text-right">
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={receivedQtyById[it._id] ?? ''}
                                onChange={(e) => handleChangeQty(it._id, e.target.value)}
                                className="w-28 px-3 py-1 border border-gray-300 rounded text-right focus:ring-2 focus:ring-rose-500"
                                placeholder="0.00"
                              />
                            </td>
                            <td className="p-3 text-right text-gray-600">{it.unit}</td>
                            <td className="p-3 text-right">
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={unitPriceById[it._id] ?? ''}
                                onChange={(e) => handleChangePrice(it._id, e.target.value)}
                                className="w-28 px-3 py-1 border border-gray-300 rounded text-right focus:ring-2 focus:ring-rose-500"
                                placeholder="0.00"
                              />
                            </td>
                            <td className="p-3 text-right font-medium">
                              {Number(lineTotals[it._id] || 0).toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-gray-50">
                        <tr>
                          <td className="p-3" colSpan={5}>
                            <div className="inline-flex items-center gap-2 text-gray-600">
                              <FaCalculator /> Grand Total
                            </div>
                          </td>
                          <td className="p-3 text-right font-bold">
                            {Number(grandTotal || 0).toFixed(2)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-base font-semibold text-gray-800 mb-3">
                    Enter Amounts
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Received Qty ({requisition.unit})
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={singleReceivedQty}
                        onChange={(e) => setSingleReceivedQty(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500"
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Unit Price
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={singleUnitPrice}
                        onChange={(e) => setSingleUnitPrice(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500"
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Line Total
                      </label>
                      <input
                        type="number"
                        readOnly
                        value={Number(singleLineTotal || 0).toFixed(2)}
                        className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-lg text-right"
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-end text-sm text-gray-700">
                    <FaCalculator className="mr-2" />
                    <span className="font-semibold">Grand Total:</span>
                    <span className="ml-2 font-bold">{Number(grandTotal || 0).toFixed(2)}</span>
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="bg-gray-50 p-5 flex flex-col sm:flex-row sm:items-center gap-3 justify-end">
              <button
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-lg hover:from-emerald-700 hover:to-green-700 transition flex items-center gap-2"
              >
                <FaCheck />
                Complete Requisition
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
