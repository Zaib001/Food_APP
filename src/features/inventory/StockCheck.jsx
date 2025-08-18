import React, { useMemo, useState } from "react";
import InventoryForm from "./InventoryForm";
import { InventoryTable } from "./InventoryTable";
import { motion } from "framer-motion";
import { FaBoxes } from "react-icons/fa";

export default function StockCheck() {
  const [inventory, setInventory] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  // Sample static data (replace with API/context)
  const ingredients = [
    { id: "1", name: "Potato", unit: "kg" },
    { id: "2", name: "Carrot", unit: "kg" },
    { id: "3", name: "Chicken", unit: "kg" },
  ];
  const suppliers = ["Supplier A", "Supplier B", "Supplier C"];

  const handleSave = (item) => {
    const itemWithName = {
      ...item,
      ingredientName: ingredients.find((i) => (i._id ?? i.id) === item.ingredientId)?.name || item.ingredientId,
    };
    if (editIndex !== null) {
      const updated = [...inventory];
      updated[editIndex] = itemWithName;
      setInventory(updated);
      setEditIndex(null);
    } else {
      setInventory((prev) => [...prev, itemWithName]);
    }
  };

  const handleEdit = (index) => setEditIndex(index);
  const handleDelete = (index) => setInventory((prev) => prev.filter((_, i) => i !== index));

  const stats = useMemo(() => {
    const totalItems = inventory.length;
    const totalQty = inventory.reduce((s, r) => s + Number(r.quantity || 0), 0);
    const low = inventory.filter((r) => Number(r.quantity) < 5).length;
    return { totalItems, totalQty, low };
  }, [inventory]);

  return (
    <div className="p-6 relative overflow-hidden">
      {/* header */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-2xl border border-rose-100 shadow bg-white mb-6">
        <div className="absolute inset-0 bg-gradient-to-r from-rose-600 via-rose-500 to-pink-500 opacity-95" />
        <div className="absolute inset-0 backdrop-blur-[1px]" />
        <div className="relative p-6 text-white flex items-center gap-3 justify-between">
          <div className="flex items-center gap-3">
            <div className="grid place-items-center h-10 w-10 rounded-xl bg-white/20"><FaBoxes /></div>
            <div>
              <h1 className="text-2xl font-bold">Inventory Management</h1>
              <p className="text-white/80 text-sm">Capture deliveries and track stock health.</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-white/15 border border-white/20 p-3 text-center"><div className="text-[11px] text-white/80">Items</div><div className="text-lg font-extrabold">{stats.totalItems}</div></div>
            <div className="rounded-xl bg-white/15 border border-white/20 p-3 text-center"><div className="text-[11px] text-white/80">Total Qty</div><div className="text-lg font-extrabold">{stats.totalQty}</div></div>
            <div className="rounded-xl bg-white/15 border border-white/20 p-3 text-center"><div className="text-[11px] text-white/80">Low Stock</div><div className="text-lg font-extrabold">{stats.low}</div></div>
          </div>
        </div>
      </motion.div>

      <InventoryForm ingredients={ingredients} suppliers={suppliers} onSave={handleSave} initialData={editIndex !== null ? inventory[editIndex] : {}} />

      <InventoryTable data={inventory} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
}
