import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthProvider'; // Assuming useAuth provides user role

interface RoleGuardProps {
  allowedRoles: string[];
  children: React.ReactNode;
  fallbackPath?: string; // Optional fallback path if role not allowed
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  allowedRoles,
  children,
  fallbackPath = '/login', // Default fallback to login
}) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    // Optional: Render a loading indicator while auth state is resolving
    return <div>Verificando acesso...</div>;
  }

  const userRole = user?.role; // Get user role from auth context

  if (!userRole || !allowedRoles.includes(userRole)) {
    // User role is not allowed or not available, redirect to fallback path
    // Pass the current location to redirect back after login if needed
    console.warn(`RoleGuard: Acesso negado para a rota ${location.pathname}. Role do usuário: ${userRole}. Roles permitidas: ${allowedRoles.join(', ')}`);
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  // User role is allowed, render the children components
  return <>{children}</>;
};
