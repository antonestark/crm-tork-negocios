
import { useState, useCallback, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { DemandCreate } from "@/types/demands";

interface UseDemandFormProps {
  fetchDemands: (statusFilter?: string | null) => Promise<void>;
  statusFilter: string | null;
  addDemand: (data: DemandCreate) => Promise<boolean>;
}

export function useDemandForm({ fetchDemands, statusFilter, addDemand }: UseDemandFormProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [formOpen, setFormOpen] = useState(false);

  const openDemandForm = useCallback(() => {
    console.log("Opening demand form");
    setFormOpen(true);
  }, []);

  const handleFormClose = useCallback((open: boolean) => {
    console.log("Form open state changing to:", open);
    setFormOpen(open);
    
    if (!open) {
      console.log("Form closed, refreshing demands");
      fetchDemands(statusFilter);
    }
  }, [fetchDemands, statusFilter]);

  useEffect(() => {
    console.log("Location state changed:", location.state);
    if (location.state?.openDemandForm) {
      console.log("Opening form from navigation state");
      setTimeout(() => {
        openDemandForm();
        navigate(location.pathname, { replace: true, state: {} });
      }, 100);
    }
  }, [location.state, navigate, location.pathname, openDemandForm]);

  useEffect(() => {
    const checkLocalStorage = () => {
      const shouldOpen = localStorage.getItem('openDemandForm');
      console.log("Checking localStorage for openDemandForm:", shouldOpen);
      if (shouldOpen === 'true') {
        console.log("Opening form from localStorage");
        localStorage.removeItem('openDemandForm');
        setTimeout(() => {
          openDemandForm();
        }, 100);
      }
    };

    checkLocalStorage();
    window.addEventListener('storage', checkLocalStorage);
    return () => {
      window.removeEventListener('storage', checkLocalStorage);
    };
  }, [openDemandForm]);

  return {
    formOpen,
    openDemandForm,
    handleFormClose,
    addDemand
  };
}
