import { createContext, useContext, useState, useEffect } from 'react';
import {
  getAllRequisitions,
  createRequisition,
  updateRequisition,
  deleteRequisition,
  importGeneratedRequisitions
} from '../api/requisitions';

const RequisitionContext = createContext();
export const useRequisitions = () => useContext(RequisitionContext);

export const RequisitionProvider = ({ children }) => {
  const [requisitions, setRequisitions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequisitions = async (filters = {}) => {
    try {
      const res = await getAllRequisitions(filters);
      setRequisitions(res.data);
    } catch (err) {
      console.error('Failed to fetch requisitions:', err);
    } finally {
      setLoading(false);
    }
  };

  const addRequisition = async (data) => {
    const res = await createRequisition(data);
    setRequisitions(prev => [...prev, res.data]);
  };

  const updateOne = async (id, data) => {
    const res = await updateRequisition(id, data);
    setRequisitions(prev => prev.map(r => r._id === id ? res.data : r));
  };

  const deleteOne = async (id) => {
    await deleteRequisition(id);
    setRequisitions(prev => prev.filter(r => r._id !== id));
  };

  const importBulk = async (generatedReqs) => {
    await importGeneratedRequisitions(generatedReqs);
    await fetchRequisitions(); // refresh after import
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
        setRequisitions
      }}
    >
      {children}
    </RequisitionContext.Provider>
  );
};
