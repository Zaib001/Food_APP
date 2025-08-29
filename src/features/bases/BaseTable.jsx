import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaEdit, FaTrash, FaMapMarkerAlt, FaClock } from "react-icons/fa";
import BaseEditModal from "./BaseEditModal";

export default function BaseTable({ bases = [], onEdit, onDelete }) {
    const [editing, setEditing] = useState(null);

    if (!bases.length) {
        return (
            <div className="text-center py-12 text-gray-500">
                No bases yet. Add one above to get started.
            </div>
        );
    }

    return (
        <>
            <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-50">
                        <tr className="text-left">
                            <th className="px-4 py-3">Name</th>
                            <th className="px-4 py-3">Code</th>
                            <th className="px-4 py-3">
                                <div className="inline-flex items-center gap-2">
                                    <FaMapMarkerAlt /> Location
                                </div>
                            </th>
                            <th className="px-4 py-3">Contact</th>
                            <th className="px-4 py-3">
                                <div className="inline-flex items-center gap-2">
                                    <FaClock /> Updated
                                </div>
                            </th>
                            <th className="px-4 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bases.map((b) => (
                            <tr key={b._id} className="border-t">
                                <td className="px-4 py-3 font-medium text-gray-900">{b.name}</td>
                                <td className="px-4 py-3">{b.code || "—"}</td>
                                <td className="px-4 py-3">{b.location || "—"}</td>
                                <td className="px-4 py-3">{b.contact || "—"}</td>
                                <td className="px-4 py-3 text-gray-500">
                                    {b.updatedAt ? new Date(b.updatedAt).toLocaleString() : "—"}
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <motion.button
                                            whileTap={{ scale: 0.96 }}
                                            onClick={() => setEditing(b)}
                                            className="px-3 py-1.5 rounded-lg border text-xs hover:bg-gray-50"
                                        >
                                            <FaEdit />
                                        </motion.button>
                                        <motion.button
                                            whileTap={{ scale: 0.96 }}
                                            onClick={() => onDelete(b._id)}
                                            className="px-3 py-1.5 rounded-lg border text-xs text-red-600 border-red-200 hover:bg-red-50"
                                        >
                                            <FaTrash />
                                        </motion.button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <BaseEditModal
                open={!!editing}
                base={editing}
                onClose={() => setEditing(null)}
                onSave={(updated) => {
                    onEdit(updated);  
                    setEditing(null);
                }}
            />


        </>
    );
}
