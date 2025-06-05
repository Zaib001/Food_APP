import { createContext, useContext, useEffect, useState } from 'react';
import {
  getProductions,
  createProduction,
  updateProduction,
  deleteProduction
} from '../api/productionApi';
import toast from 'react-hot-toast';

const ProductionContext = createContext();
export const useProductions = () => useContext(ProductionContext);

export const ProductionProvider = ({ children }) => {
  const [productions, setProductions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProductions = async (filters = {}) => {
    try {
      const res = await getProductions(filters);
      setProductions(res.data);
    } catch (err) {
      toast.error('Failed to fetch production logs');
    } finally {
      setLoading(false);
    }
  };

  const addProduction = async (entry) => {
    const res = await createProduction(entry);
    setProductions(prev => [...prev, res.data]);
    toast.success('Production logged');
  };

  const updateOne = async (id, data) => {
    const res = await updateProduction(id, data);
    setProductions(prev => prev.map(p => (p._id === id ? res.data : p)));
    toast.success('Production updated');
  };

  const deleteOne = async (id) => {
    await deleteProduction(id);
    setProductions(prev => prev.filter(p => p._id !== id));
    toast.success('Production deleted');
  };

  useEffect(() => {
    fetchProductions();
  }, []);

  return (
    <ProductionContext.Provider
      value={{
        productions,
        loading,
        fetchProductions,
        addProduction,
        updateOne,
        deleteOne,
      }}
    >
      {children}
    </ProductionContext.Provider>
  );
};
