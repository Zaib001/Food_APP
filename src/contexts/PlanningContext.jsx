import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  getAllPlans,
  createPlan,
  updatePlan,
  deletePlan
} from '../api/planningApi';

const PlanningContext = createContext();
export const usePlanning = () => useContext(PlanningContext);

export const PlanningProvider = ({ children }) => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await getAllPlans();
      setPlans(res.data);
    } catch (err) {
      console.error('Failed to fetch plans:', err);
    } finally {
      setLoading(false);
    }
  };

  const addPlan = async (newPlan) => {
    try {
      const res = await createPlan(newPlan);
      setPlans((prev) => [...prev, res.data]);
    } catch (err) {
      console.error('Failed to create plan:', err);
    }
  };

  const editPlan = async (id, updatedPlan) => {
    try {
      const res = await updatePlan(id, updatedPlan);
      setPlans((prev) =>
        prev.map((p) => (p._id === id ? res.data : p))
      );
    } catch (err) {
      console.error('Failed to update plan:', err);
    }
  };

  const removePlan = async (id) => {
    try {
      await deletePlan(id);
      setPlans((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error('Failed to delete plan:', err);
    }
  };

  return (
    <PlanningContext.Provider
      value={{
        plans,
        addPlan,
        editPlan,
        removePlan,
        loading
      }}
    >
      {children}
    </PlanningContext.Provider>
  );
};
