import React from 'react';
import { FaTruck } from 'react-icons/fa';

export default function GeneratedRequisitionTable({ requisitions }) {
  if (!requisitions || requisitions.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-6 text-sm">
        No requisitions generated from menus yet.
      </div>
    );
  }

  return (
    <div className="mt-10 bg-white shadow-lg rounded-xl p-6 border border-gray-100">
      <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-800">
        <FaTruck className="text-red-600" /> Menu-Based Requisitions
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border border-gray-200">
          <thead className="bg-gray-100 text-gray-700 font-medium">
            <tr>
              <th className="p-3 border-b">Date</th>
              <th className="p-3 border-b">Item</th>
              <th className="p-3 border-b">Unit</th>
              <th className="p-3 border-b">Base</th>
              <th className="p-3 border-b">Status</th>
            </tr>
          </thead>
          <tbody>
            {requisitions.map((req, idx) => (
              <tr
                key={idx}
                className={`transition-all ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-red-50`}
              >
                <td className="p-3 border-b">{req.date}</td>
                <td className="p-3 border-b">{req.item}</td>
                <td className="p-3 border-b">{req.unit}</td>
                <td className="p-3 border-b">{req.base}</td>
                <td className="p-3 border-b text-red-600 font-medium">{req.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
