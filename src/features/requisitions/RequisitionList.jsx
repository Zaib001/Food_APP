import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

export default function RequisitionList({ data, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">Requisition List</h2>
      <table className="w-full text-sm">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-2">Date</th>
            <th className="p-2">Requested By</th>
            <th className="p-2">Item</th>
            <th className="p-2">Qty</th>
            <th className="p-2">Unit</th>
            <th className="p-2">Supplier</th>
            <th className="p-2">Status</th>
            <th className="p-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((req, idx) => (
            <tr key={idx} className="border-b hover:bg-gray-50">
              <td className="p-2">{req.date}</td>
              <td className="p-2">{req.requestedBy}</td>
              <td className="p-2">{req.item}</td>
              <td className="p-2">{req.quantity}</td>
              <td className="p-2">{req.unit}</td>
              <td className="p-2">{req.supplier}</td>
              <td className="p-2 capitalize">{req.status}</td>
              <td className="p-2 text-center">
                <button onClick={() => onEdit(idx)} className="text-blue-600 hover:text-blue-800 mr-2">
                  <FaEdit />
                </button>
                <button onClick={() => onDelete(idx)} className="text-red-600 hover:text-red-800">
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
