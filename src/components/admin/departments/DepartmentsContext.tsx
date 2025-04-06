
import React, { createContext, useContext } from 'react';
import { DepartmentsContextType } from './types';
import { useDepartmentOperations } from './useDepartmentOperations';

export const DepartmentsContext = createContext<DepartmentsContextType | undefined>(undefined);

export const DepartmentsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const departmentOperations = useDepartmentOperations();
  
  return (
    <DepartmentsContext.Provider value={departmentOperations}>
      {children}
    </DepartmentsContext.Provider>
  );
};

// Custom hook to use the context
export const useDepartmentsContext = () => {
  const context = useContext(DepartmentsContext);
  if (context === undefined) {
    throw new Error('useDepartmentsContext must be used within a DepartmentsProvider');
  }
  return context;
};
