
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Index from './pages/Index';
import Clients from './pages/Clients';
import Leads from './pages/Leads';
import Agendamento from './pages/Agendamento';
import NotFound from './pages/NotFound';
import AdminIndex from './pages/admin/Index';
import AdminUsers from './pages/admin/Users';
import AdminDepartments from './pages/admin/Departments';
import AdminPermissions from './pages/admin/Permissions';
import AdminAudit from './pages/admin/Audit';
import AdminReports from './pages/admin/Reports';
import AdminSettings from './pages/admin/Settings';
import ServicesIndex from './pages/services/Index';
import ServicesAreas from './pages/services/Areas';
import ServicesChecklist from './pages/services/Checklist';
import ServicesDemands from './pages/services/Demands';
import ServicesMaintenance from './pages/services/Maintenance';
import ServicesReports from './pages/services/Reports';
import Login from './pages/Login';
import Register from './pages/Register';
import { Toaster } from 'sonner';
import './App.css';
import { RequireAuth } from './components/auth/RequireAuth';
import { RequirePermission } from './components/auth/RequirePermission';
import { AuthProvider } from './components/auth/AuthProvider';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster richColors />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/leads" element={<Leads />} />
          <Route path="/agendamento" element={<Agendamento />} />

          {/* Admin Routes - Protected with Authentication and Permissions */}
          <Route path="/admin" element={
            <RequireAuth>
              <AdminIndex />
            </RequireAuth>
          } />
          <Route path="/admin/users" element={
            <RequireAuth>
              <RequirePermission permissionCode="admin:users:view">
                <AdminUsers />
              </RequirePermission>
            </RequireAuth>
          } />
          <Route path="/admin/departments" element={
            <RequireAuth>
              <RequirePermission permissionCode="admin:departments:view">
                <AdminDepartments />
              </RequirePermission>
            </RequireAuth>
          } />
          <Route path="/admin/permissions" element={
            <RequireAuth>
              <RequirePermission permissionCode="admin:permissions:view">
                <AdminPermissions />
              </RequirePermission>
            </RequireAuth>
          } />
          <Route path="/admin/audit" element={
            <RequireAuth>
              <AdminAudit />
            </RequireAuth>
          } />
          <Route path="/admin/reports" element={
            <RequireAuth>
              <AdminReports />
            </RequireAuth>
          } />
          <Route path="/admin/settings" element={
            <RequireAuth>
              <AdminSettings />
            </RequireAuth>
          } />

          {/* Services Routes - Protected with Authentication */}
          <Route path="/services" element={
            <RequireAuth>
              <ServicesIndex />
            </RequireAuth>
          } />
          <Route path="/services/areas" element={
            <RequireAuth>
              <ServicesAreas />
            </RequireAuth>
          } />
          <Route path="/services/checklist" element={
            <RequireAuth>
              <ServicesChecklist />
            </RequireAuth>
          } />
          <Route path="/services/demands" element={
            <RequireAuth>
              <ServicesDemands />
            </RequireAuth>
          } />
          <Route path="/services/maintenance" element={
            <RequireAuth>
              <ServicesMaintenance />
            </RequireAuth>
          } />
          <Route path="/services/reports" element={
            <RequireAuth>
              <ServicesReports />
            </RequireAuth>
          } />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
