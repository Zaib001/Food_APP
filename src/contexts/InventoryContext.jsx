import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  getInventory,
  createInventory,
  updateInventory,
  deleteInventory,
  getGroupedInventory,
  exportInventoryCSV,
  getLowStockAlerts
} from '../api/inventory';

const InventoryContext = createContext();
export const useInventory = () => useContext(InventoryContext);

export const InventoryProvider = ({ children }) => {
  const [inventory, setInventory] = useState([]);
  const [grouped, setGrouped] = useState([]);
  const [lowStock, setLowStock] = useState([]);

  const fetchInventory = async () => {
    try {
      const res = await getInventory();
      setInventory(res.data);
    } catch (err) {
      console.error('Fetch failed', err);
    }
  };

  const addInventory = async (entry) => {
    const res = await createInventory(entry);
    setInventory(prev => [...prev, res.data]);
  };

  const updateOne = async (id, entry) => {
    const res = await updateInventory(id, entry);
    setInventory(prev => prev.map(i => i._id === id ? res.data : i));
  };

  const deleteOne = async (id) => {
    await deleteInventory(id);
    setInventory(prev => prev.filter(i => i._id !== id));
  };

  const fetchGrouped = async () => {
    const res = await getGroupedInventory();
    setGrouped(res.data);
  };

  const fetchLowStock = async (threshold = 5) => {
    const res = await getLowStockAlerts(threshold);
    setLowStock(res.data.items);
  };



  const downloadCSV = async () => {
    const res = await exportInventoryCSV();
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'inventory_summary.csv');
    document.body.appendChild(link);
    link.click();
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  return (
    <InventoryContext.Provider
      value={{
        inventory,
        addInventory,
        updateOne,
        deleteOne,
        grouped,
        fetchGrouped,
        lowStock,
        fetchLowStock,
        downloadCSV,
        
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};
