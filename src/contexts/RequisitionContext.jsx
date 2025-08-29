import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  getAllRequisitions as apiGetAll,
  createRequisition as apiCreate,
  updateRequisition as apiUpdate,
  deleteRequisition as apiDelete,
  importGeneratedRequisitions as apiImport,
  approveRequisition as apiApprove,
  bulkApproveRequisitions as apiBulkApprove,
} from '../api/requisitions';

const RequisitionContext = createContext(null);
export const useRequisitions = () => {
  const ctx = useContext(RequisitionContext);
  if (!ctx) throw new Error('useRequisitions must be used within a RequisitionProvider');
  return ctx;
};

export const RequisitionProvider = ({ children }) => {
  const [requisitions, setRequisitions] = useState([]);
  const [loading, setLoading] = useState(true);

  /** Normalize top-level fields from items[0] so UI can read simply */
  const normalize = useCallback((arr) => {
    return (Array.isArray(arr) ? arr : []).map((r) => {
      const f = r?.items?.[0] || {};
      return {
        ...r,
        item: r.item ?? f.item,
        quantity: r.quantity ?? f.quantity,
        unit: r.unit ?? f.unit,
        supplier: r.supplier ?? f.supplier,
        ingredientId: r.ingredientId ?? f.ingredientId,
      };
    });
  }, []);

  const fetchRequisitions = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      const res = await apiGetAll(filters);
      const payload = Array.isArray(res.data) ? res.data : res.data?.data;
      setRequisitions(normalize(payload));
    } catch (err) {
      console.error('Failed to fetch requisitions:', err);
      setRequisitions([]);
    } finally {
      setLoading(false);
    }
  }, [normalize]);

  const addRequisition = useCallback(async (data) => {
    const res = await apiCreate(data);
    setRequisitions((prev) => [...prev, ...normalize([res.data])]);
  }, [normalize]);

  const updateOne = useCallback(async (id, data) => {
    const res = await apiUpdate(id, data);
    const norm = normalize([res.data])[0];
    setRequisitions((prev) => prev.map((r) => (r._id === id ? norm : r)));
  }, [normalize]);

  const deleteOne = useCallback(async (id) => {
    await apiDelete(id);
    setRequisitions((prev) => prev.filter((r) => r._id !== id));
  }, []);

  const importBulk = useCallback(async (generatedReqs) => {
    await apiImport(generatedReqs);
    await fetchRequisitions();
  }, [fetchRequisitions]);

  const approveOne = useCallback(async (id) => {
    await apiApprove(id);
    setRequisitions((prev) => prev.map((r) => (r._id === id ? { ...r, status: 'approved' } : r)));
  }, []);

  const bulkApprove = useCallback(async (filter = {}) => {
    await apiBulkApprove(filter);
    await fetchRequisitions();
  }, [fetchRequisitions]);

  useEffect(() => {
    fetchRequisitions();
  }, [fetchRequisitions]);

  const value = useMemo(() => ({
    requisitions,
    loading,
    fetchRequisitions,
    addRequisition,
    updateOne,
    deleteOne,
    importBulk,
    approveOne,
    bulkApprove,
    setRequisitions,
  }), [
    requisitions, loading,
    fetchRequisitions, addRequisition, updateOne, deleteOne,
    importBulk, approveOne, bulkApprove,
  ]);

  return (
    <RequisitionContext.Provider value={value}>
      {children}
    </RequisitionContext.Provider>
  );
};
