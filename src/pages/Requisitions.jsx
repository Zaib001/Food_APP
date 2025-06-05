import React, { useState, useEffect } from 'react';
import RequisitionList from '../features/requisitions/RequisitionList';
import EditModal from '../components/EditModal';
import SupplierBarChart from '../components/SupplierBarChart';
import { exportRequisitionsToCSV } from '../components/exportRecipesToPDF';
import GeneratedRequisitionTable from '../features/requisitions/GeneratedRequisitionTable';
import { useRequisitions } from '../contexts/RequisitionContext';
import { useMenus } from '../contexts/MenuContext'; // ✅

export default function Requisitions() {
  const {
    requisitions,
    fetchRequisitions,
    addRequisition,
    updateOne,
    deleteOne,
    loading,
  } = useRequisitions();

  const { generatedRequisitions } = useMenus(); // ✅ use generated data from menus

  const [modalOpen, setModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [filter, setFilter] = useState('all');
  const [supplierFilter, setSupplierFilter] = useState('all');

  const handleAdd = async (newItem) => await addRequisition(newItem);

  const handleUpdate = async (updated) => {
    const id = requisitions[editIndex]._id;
    await updateOne(id, updated);
  };

  const handleDelete = async (index) => {
    const id = requisitions[index]._id;
    await deleteOne(id);
  };

  useEffect(() => {
    fetchRequisitions({ status: filter, supplier: supplierFilter });
  }, [filter, supplierFilter]);

  const filteredData = requisitions;
  const uniqueSuppliers = ['all', ...new Set(requisitions.map((r) => r.supplier || ''))];

  const grouped = filteredData.reduce((acc, r) => {
    acc[r.supplier] = (acc[r.supplier] || 0) + Number(r.quantity || 0);
    return acc;
  }, {});

  return (
    <div className="p-6">
      {/* Header Filters */}
      <div className="flex flex-wrap justify-end items-center gap-4 mb-4">
        <div className="flex gap-2 flex-wrap">
          {['all', 'pending', 'approved', 'completed'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded text-sm capitalize ${
                filter === f ? 'bg-red-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {f}
            </button>
          ))}

          <select
            onChange={(e) => setSupplierFilter(e.target.value)}
            value={supplierFilter}
            className="px-3 py-1 text-sm rounded border border-gray-300"
          >
            {uniqueSuppliers.map((s, i) => (
              <option key={i} value={s}>
                {s === 'all' ? 'All Suppliers' : s}
              </option>
            ))}
          </select>

          <button
            onClick={() => exportRequisitionsToCSV(filteredData)}
            className="bg-green-600 text-white px-3 py-1.5 rounded text-sm hover:bg-green-700"
          >
            Export CSV
          </button>

          <button
            onClick={() => {
              setEditIndex(null);
              setModalOpen(true);
            }}
            className="bg-red-600 text-white px-3 py-1.5 rounded text-sm hover:bg-red-700"
          >
            + New Requisition
          </button>
        </div>
      </div>

      {/* Manual Requisition Table */}
      <RequisitionList
        data={filteredData}
        onEdit={(i) => {
          setEditIndex(i);
          setModalOpen(true);
        }}
        onDelete={handleDelete}
      />

      {/* Summary */}
      <div className="mt-6 bg-white p-4 rounded-xl shadow">
        <h3 className="text-md font-semibold mb-2 text-gray-700">Grouped by Supplier:</h3>
        <ul className="list-disc pl-6 text-sm text-gray-700">
          {Object.entries(grouped).map(([supplier, qty]) => (
            <li key={supplier}>
              {supplier}: <strong>{qty}</strong>
            </li>
          ))}
        </ul>
      </div>

      {/* Auto-Generated Requisitions */}
      {generatedRequisitions?.length > 0 && (
        <div className="mt-10">
          <h2 className="text-lg font-bold mb-3 text-gray-800">Auto-Generated Requisitions from Menus</h2>
          <GeneratedRequisitionTable requisitions={generatedRequisitions} />
        </div>
      )}

      {/* Chart */}
      <SupplierBarChart data={filteredData} />

      {/* Add/Edit Modal */}
      <EditModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={editIndex === null ? handleAdd : handleUpdate}
        initialValues={editIndex !== null ? requisitions[editIndex] : {}}
        title={editIndex !== null ? 'Edit Requisition' : 'New Requisition'}
        fields={[
          { name: 'date', label: 'Date', type: 'date' },
          { name: 'requestedBy', label: 'Requested By' },
          { name: 'item', label: 'Item' },
          { name: 'quantity', label: 'Quantity', type: 'number' },
          { name: 'unit', label: 'Unit' },
          { name: 'supplier', label: 'Supplier' },
          { name: 'status', label: 'Status' },
        ]}
      />
    </div>
  );
}
