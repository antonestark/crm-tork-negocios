
import React from 'react';
import './App.css';
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Clients from '@/pages/Clients';
import Leads from '@/pages/Leads';
import Agendamento from '@/pages/Agendamento';
import AdminIndex from '@/pages/admin/Index';
import UsersPage from '@/pages/admin/Users';
import Departments from '@/pages/admin/Departments';
import Permissions from '@/pages/admin/Permissions';
import Audit from '@/pages/admin/Audit';
import TableAudit from '@/pages/admin/TableAudit';
import AdminReports from '@/pages/admin/Reports';
import AdminSettings from '@/pages/admin/Settings';
import ServicesIndex from '@/pages/services/Index';
import Areas from '@/pages/services/Areas';
import Demands from '@/pages/services/Demands';
import Checklist from '@/pages/services/Checklist';
import MyChecklist from '@/pages/services/MyChecklist';
import Maintenance from '@/pages/services/Maintenance';
import ServiceReports from '@/pages/services/Reports';
import Dashboard from '@/pages/Dashboard';
import NotFound from '@/pages/NotFound';
import Planos from '@/pages/Planos';
import AgendamentoExternoPage from '@/pages/AgendamentoExterno';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { QueryClientProvider } from '@/providers/QueryClientProvider';
import { Toaster } from "@/components/ui/sonner";
import { UserAccessProvider } from '@/providers/UserAccessProvider';

// Route related imports
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { RequireAuth } from './components/auth/RequireAuth';
import { DepartmentGuard } from './components/auth/DepartmentGuard';

function App() {
  return (
    <QueryClientProvider>
      <AuthProvider>
        <UserAccessProvider>
          <BrowserRouter>
            <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/planos" element={<Planos />} />
            <Route path="/agendamento-externo" element={<AgendamentoExternoPage />} />
            
            {/* Protected routes */}
            <Route path="/dashboard" element={
              <RequireAuth>
                <DepartmentGuard 
                  allowedDepartments={['Admin', 'Gestão']}
                  fallbackPath="/services/checklist"
                >
                  <Dashboard />
                </DepartmentGuard>
              </RequireAuth>
            } />
            
            <Route path="/clients" element={
              <RequireAuth>
                <DepartmentGuard 
                  allowedDepartments={['Admin', 'Gestão', 'Comercial']}
                  fallbackPath="/services/checklist"
                >
                  <Clients />
                </DepartmentGuard>
              </RequireAuth>
            } />
            
            <Route path="/leads" element={
              <RequireAuth>
                <DepartmentGuard 
                  allowedDepartments={['Admin', 'Gestão', 'Comercial']}
                  fallbackPath="/services/checklist"
                >
                  <Leads />
                </DepartmentGuard>
              </RequireAuth>
            } />
            
            <Route path="/agendamento" element={
              <RequireAuth>
                <DepartmentGuard 
                  allowedDepartments={['Admin', 'Gestão', 'Comercial', 'Atendimento']}
                  fallbackPath="/services/checklist"
                >
                  <Agendamento />
                </DepartmentGuard>
              </RequireAuth>
            } />
            
            {/* Admin routes */}
            <Route path="/admin" element={
              <RequireAuth>
                <DepartmentGuard 
                  allowedDepartments={['Admin']}
                  fallbackPath="/services/checklist"
                >
                  <AdminIndex />
                </DepartmentGuard>
              </RequireAuth>
            } />
            
            <Route path="/admin/users" element={
              <RequireAuth>
                <DepartmentGuard 
                  allowedDepartments={['Admin']}
                  fallbackPath="/services/checklist"
                >
                  <UsersPage />
                </DepartmentGuard>
              </RequireAuth>
            } />
            
            <Route path="/admin/departments" element={
              <RequireAuth>
                <DepartmentGuard 
                  allowedDepartments={['Admin']}
                  fallbackPath="/services/checklist"
                >
                  <Departments />
                </DepartmentGuard>
              </RequireAuth>
            } />
            
            <Route path="/admin/permissions" element={
              <RequireAuth>
                <DepartmentGuard 
                  allowedDepartments={['Admin']}
                  fallbackPath="/services/checklist"
                >
                  <Permissions />
                </DepartmentGuard>
              </RequireAuth>
            } />
            
            <Route path="/admin/audit" element={
              <RequireAuth>
                <DepartmentGuard 
                  allowedDepartments={['Admin']}
                  fallbackPath="/services/checklist"
                >
                  <Audit />
                </DepartmentGuard>
              </RequireAuth>
            } />
            
            <Route path="/admin/table-audit" element={
              <RequireAuth>
                <DepartmentGuard 
                  allowedDepartments={['Admin']}
                  fallbackPath="/services/checklist"
                >
                  <TableAudit />
                </DepartmentGuard>
              </RequireAuth>
            } />
            
            <Route path="/admin/reports" element={
              <RequireAuth>
                <DepartmentGuard 
                  allowedDepartments={['Admin', 'Gestão']}
                  fallbackPath="/services/checklist"
                >
                  <AdminReports />
                </DepartmentGuard>
              </RequireAuth>
            } />
            
            <Route path="/admin/settings" element={
              <RequireAuth>
                <DepartmentGuard 
                  allowedDepartments={['Admin']}
                  fallbackPath="/services/checklist"
                >
                  <AdminSettings />
                </DepartmentGuard>
              </RequireAuth>
            } />
            
            {/* Services routes */}
            <Route path="/services" element={
              <RequireAuth>
                <DepartmentGuard 
                  allowedDepartments={['Admin', 'Gestão', 'Manutenção']}
                  fallbackPath="/services/checklist"
                >
                  <ServicesIndex />
                </DepartmentGuard>
              </RequireAuth>
            } />
            
            <Route path="/services/areas" element={
              <RequireAuth>
                <DepartmentGuard 
                  allowedDepartments={['Admin', 'Gestão', 'Manutenção']}
                  fallbackPath="/services/checklist"
                >
                  <Areas />
                </DepartmentGuard>
              </RequireAuth>
            } />
            
            <Route path="/services/demands" element={
              <RequireAuth>
                <DepartmentGuard 
                  allowedDepartments={['Admin', 'Gestão', 'Manutenção']}
                  fallbackPath="/services/checklist"
                >
                  <Demands />
                </DepartmentGuard>
              </RequireAuth>
            } />
            
            {/* Checklist page is accessible to all, but with different views based on department */}
            <Route path="/services/checklist" element={
              <RequireAuth>
                <Checklist />
              </RequireAuth>
            } />
            
            {/* My Checklist page shows only items assigned to the current user */}
            <Route path="/services/my-checklist" element={
              <RequireAuth>
                <MyChecklist />
              </RequireAuth>
            } />
            
            <Route path="/services/maintenance" element={
              <RequireAuth>
                <DepartmentGuard 
                  allowedDepartments={['Admin', 'Gestão', 'Manutenção']}
                  fallbackPath="/services/checklist"
                >
                  <Maintenance />
                </DepartmentGuard>
              </RequireAuth>
            } />
            
            <Route path="/services/reports" element={
              <RequireAuth>
                <DepartmentGuard 
                  allowedDepartments={['Admin', 'Gestão']}
                  fallbackPath="/services/checklist"
                >
                  <ServiceReports />
                </DepartmentGuard>
              </RequireAuth>
            } />
            
            {/* Fallback route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <Toaster position="top-right" />
        </UserAccessProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
