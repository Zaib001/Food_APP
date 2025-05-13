import { createContext, useContext, useState } from 'react';

const RequisitionContext = createContext();

export const useRequisitions = () => useContext(RequisitionContext);

export const RequisitionProvider = ({ children }) => {
  const [requisitions, setRequisitions] = useState([]);

  return (
    <RequisitionContext.Provider value={{ requisitions, setRequisitions }}>
      {children}
    </RequisitionContext.Provider>
  );
};
