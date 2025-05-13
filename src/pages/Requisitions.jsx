import React, { useState } from 'react';
import RequisitionList from '../features/requisitions/RequisitionList';
import EditModal from '../components/EditModal';
import SupplierBarChart from '../components/SupplierBarChart';
import { exportRequisitionsToCSV } from '../components/exportRecipesToPDF';
import { useRequisitions } from '../contexts/RequisitionContext';

export default function Requisitions() {
  const { requisitions, setRequisitions } = useRequisitions();
  const [modalOpen, setModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [filter, setFilter] = useState('all');
  const [supplierFilter, setSupplierFilter] = useState('all');

  const handleAdd = (newItem) => setRequisitions((prev) => [...prev, newItem]);

  const handleUpdate = (updated) => {
    const copy = [...requisitions];
    copy[editIndex] = updated;
    setRequisitions(copy);
  };

  const handleDelete = (index) => {
    const copy = [...requisitions];
    copy.splice(index, 1);
    setRequisitions(copy);
  };

  const filteredData = requisitions.filter((r) =>
    filter === 'all' ? true : r.status === filter
  );

  const finalFilteredData = filteredData.filter((r) =>
    supplierFilter === 'all' ? true : r.supplier === supplierFilter
  );

  const uniqueSuppliers = ['all', ...new Set(requisitions.map((r) => r.supplier))];

  const grouped = finalFilteredData.reduce((acc, r) => {
    acc[r.supplier] = (acc[r.supplier] || 0) + Number(r.quantity);
    return acc;
  }, {});

  return (
    <div className="p-6">
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
            onClick={() => exportRequisitionsToCSV(finalFilteredData)}
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

      <RequisitionList
        data={finalFilteredData}
        onEdit={(i) => {
          setEditIndex(i);
          setModalOpen(true);
        }}
        onDelete={handleDelete}
      />

      {/* Grouped Summary */}
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

      {/* Bar Chart */}
      <SupplierBarChart data={finalFilteredData} />

      {/* Modal */}
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
