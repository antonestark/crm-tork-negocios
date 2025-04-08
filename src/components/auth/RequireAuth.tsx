
import React, { ReactNode, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from './AuthProvider';
import { useAuthState } from '@/hooks/use-auth-state';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface RequireAuthProps {
  children: ReactNode;
}

export function RequireAuth({ children }: RequireAuthProps) {
  const { user, isLoading } = useAuth();
  const { sessionExpired, refreshSession } = useAuthState();
  const [checkingDepartment, setCheckingDepartment] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && user) {
      // Check if user belongs to Operação department
      const checkUserDepartment = async () => {
        try {
          setCheckingDepartment(true);
          
          // Get Operação department ID
          const { data: departmentData } = await supabase
            .from('departments')
            .select('id')
            .eq('name', 'Operação')
            .single();
            
          if (departmentData) {
            // Check if user is in this department
            const { data: userData } = await supabase
              .from('users')
              .select('department_id')
              .eq('id', user.id)
              .single();
              
            if (userData && userData.department_id === departmentData.id) {
              // User is in Operação department, redirect to checklist
              if (location.pathname !== '/services/checklist') {
                navigate('/services/checklist');
              }
            }
          }
        } catch (error) {
          console.error('Error checking department:', error);
        } finally {
          setCheckingDepartment(false);
        }
      };
      
      checkUserDepartment();
    } else {
      setCheckingDepartment(false);
    }
  }, [user, isLoading, navigate, location.pathname]);

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        // Redirect to login page with return path
        navigate('/login', { state: { from: location.pathname } });
      } else if (sessionExpired) {
        // Try to refresh the session
        const tryRefresh = async () => {
          const success = await refreshSession();
          if (!success) {
            toast.error("Sessão expirada. Por favor, faça login novamente.");
            navigate('/login', { state: { from: location.pathname } });
          }
        };
        tryRefresh();
      }
    }
  }, [user, isLoading, sessionExpired, navigate, location, refreshSession]);

  if (isLoading || checkingDepartment) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="mt-2">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will be redirected by the useEffect
  }

  return <>{children}</>;
}
