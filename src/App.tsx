
import React from 'react';
import './App.css';
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Clients from '@/pages/Clients';
import Leads from '@/pages/Leads';
import Agendamento from '@/pages/Agendamento';
import AdminIndex from '@/pages/admin/Index';
import Users from '@/pages/admin/Users';
import Departments from '@/pages/admin/Departments';
import Permissions from '@/pages/admin/Permissions';
import Audit from '@/pages/admin/Audit';
import AdminReports from '@/pages/admin/Reports';
import AdminSettings from '@/pages/admin/Settings';
import ServicesIndex from '@/pages/services/Index';
import Areas from '@/pages/services/Areas';
import Demands from '@/pages/services/Demands';
import Checklist from '@/pages/services/Checklist';
import Maintenance from '@/pages/services/Maintenance';
import ServiceReports from '@/pages/services/Reports';
import NotFound from '@/pages/NotFound';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { QueryClientProvider } from '@/providers/QueryClientProvider';

// Route related imports
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { RequireAuth } from './components/auth/RequireAuth';

// Pages
import TableAudit from './pages/admin/TableAudit';

function App() {
  return (
    <QueryClientProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected routes */}
            <Route path="/clients" element={<RequireAuth><Clients /></RequireAuth>} />
            <Route path="/leads" element={<RequireAuth><Leads /></RequireAuth>} />
            <Route path="/agendamento" element={<RequireAuth><Agendamento /></RequireAuth>} />
            
            {/* Admin routes */}
            <Route path="/admin" element={<RequireAuth><AdminIndex /></RequireAuth>} />
            <Route path="/admin/users" element={<RequireAuth><Users /></RequireAuth>} />
            <Route path="/admin/departments" element={<RequireAuth><Departments /></RequireAuth>} />
            <Route path="/admin/permissions" element={<RequireAuth><Permissions /></RequireAuth>} />
            <Route path="/admin/audit" element={<RequireAuth><Audit /></RequireAuth>} />
            <Route path="/admin/reports" element={<RequireAuth><AdminReports /></RequireAuth>} />
            <Route path="/admin/settings" element={<RequireAuth><AdminSettings /></RequireAuth>} />
            <Route path="/admin/table-audit" element={<RequireAuth><TableAudit /></RequireAuth>} />
            
            {/* Services routes */}
            <Route path="/services" element={<RequireAuth><ServicesIndex /></RequireAuth>} />
            <Route path="/services/areas" element={<RequireAuth><Areas /></RequireAuth>} />
            <Route path="/services/demands" element={<RequireAuth><Demands /></RequireAuth>} />
            <Route path="/services/checklist" element={<RequireAuth><Checklist /></RequireAuth>} />
            <Route path="/services/maintenance" element={<RequireAuth><Maintenance /></RequireAuth>} />
            <Route path="/services/reports" element={<RequireAuth><ServiceReports /></RequireAuth>} />
            
            {/* Fallback route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
