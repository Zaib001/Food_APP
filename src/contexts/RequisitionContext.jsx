// src/contexts/RequisitionContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
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
  if (!ctx) {
    // Helpful error if the provider isn't wrapping this subtree
    throw new Error('useRequisitions must be used within a RequisitionProvider');
  }
  return ctx;
};

export const RequisitionProvider = ({ children }) => {
  const [requisitions, setRequisitions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequisitions = async (filters = {}) => {
    try {
      setLoading(true);
      const res = await apiGetAll(filters);
      // API may return a paginated shape { data, total, page, pages }
      const payload = Array.isArray(res.data) ? res.data : res.data?.data;
      setRequisitions(Array.isArray(payload) ? payload : []);
    } catch (err) {
      console.error('Failed to fetch requisitions:', err);
      setRequisitions([]); // keep state consistent
    } finally {
      setLoading(false);
    }
  };

  const addRequisition = async (data) => {
    const res = await apiCreate(data);
    setRequisitions(prev => [...prev, res.data]);
  };

  const updateOne = async (id, data) => {
    const res = await apiUpdate(id, data);
    setRequisitions(prev => prev.map(r => (r._id === id ? res.data : r)));
  };

  const deleteOne = async (id) => {
    await apiDelete(id);
    setRequisitions(prev => prev.filter(r => r._id !== id));
  };

  const importBulk = async (generatedReqs) => {
    await apiImport(generatedReqs);
    await fetchRequisitions(); // refresh after import
  };

  // NEW: header approvals
  const approveOne = async (id) => {
    await apiApprove(id);
    // optimistic client update
    setRequisitions(prev => prev.map(r => (r._id === id ? { ...r, status: 'approved' } : r)));
  };

  const bulkApprove = async (filter = {}) => {
    await apiBulkApprove(filter);
    // lightweight refresh
    await fetchRequisitions();
  };

  useEffect(() => {
    fetchRequisitions();
  }, []);

  return (
    <RequisitionContext.Provider
      value={{
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
      }}
    >
      {children}
    </RequisitionContext.Provider>
  );
};
