
import { useState, useCallback, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { DemandCreate } from "@/hooks/use-demands";

interface UseDemandFormProps {
  fetchDemands: (statusFilter?: string | null) => Promise<void>;
  statusFilter: string | null;
  addDemand: (data: DemandCreate) => Promise<boolean>;
}

export function useDemandForm({ fetchDemands, statusFilter, addDemand }: UseDemandFormProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [formOpen, setFormOpen] = useState(false);

  // Handler to safely open the form
  const openDemandForm = useCallback(() => {
    console.log("Opening demand form");
    setFormOpen(true);
  }, []);

  // Handle navigation state
  useEffect(() => {
    // Check URL state parameter first
    if (location.state?.openDemandForm) {
      console.log("Opening form from navigation state");
      // Add a small delay to ensure all components are fully mounted
      setTimeout(() => {
        openDemandForm();
        // Clean up navigation state to prevent reopening on refresh
        navigate(location.pathname, { replace: true, state: {} });
      }, 100);
    }
  }, [location.state, navigate, location.pathname, openDemandForm]);

  // Also listen for localStorage changes (for when already on this page)
  useEffect(() => {
    const checkLocalStorage = () => {
      const shouldOpen = localStorage.getItem('openDemandForm');
      if (shouldOpen === 'true') {
        console.log("Opening form from localStorage");
        localStorage.removeItem('openDemandForm');
        // Delay to ensure render cycle completes
        setTimeout(() => {
          openDemandForm();
        }, 100);
      }
    };

    // Check on mount
    checkLocalStorage();
    
    // Also listen for storage events
    window.addEventListener('storage', checkLocalStorage);
    return () => {
      window.removeEventListener('storage', checkLocalStorage);
    };
  }, [openDemandForm]);

  // Safe form close handler with retries if needed
  const handleFormClose = (open: boolean) => {
    console.log("Form open state changing to:", open);
    setFormOpen(open);
    
    if (!open) {
      // Refresh data after closing
      console.log("Form closed, refreshing demands");
      fetchDemands(statusFilter);
    }
  };

  return {
    formOpen,
    openDemandForm,
    handleFormClose,
    addDemand
  };
}
