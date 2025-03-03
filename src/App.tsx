
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Clients from "./pages/Clients";
import NotFound from "./pages/NotFound";
import Agendamento from "./pages/Agendamento";
import ServicesIndex from "./pages/services/Index";
import AreasPage from "./pages/services/Areas";
import ChecklistPage from "./pages/services/Checklist";
import MaintenancePage from "./pages/services/Maintenance";
import DemandsPage from "./pages/services/Demands";
import ReportsPage from "./pages/services/Reports";
import AdminIndex from "./pages/admin/Index";
import UsersPage from "./pages/admin/Users";
import DepartmentsPage from "./pages/admin/Departments";
import PermissionsPage from "./pages/admin/Permissions";
import AuditPage from "./pages/admin/Audit";
import SettingsPage from "./pages/admin/Settings";
import AdminReportsPage from "./pages/admin/Reports";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/agendamento" element={<Agendamento />} />
          <Route path="/services" element={<ServicesIndex />} />
          <Route path="/services/areas" element={<AreasPage />} />
          <Route path="/services/checklist" element={<ChecklistPage />} />
          <Route path="/services/maintenance" element={<MaintenancePage />} />
          <Route path="/services/demands" element={<DemandsPage />} />
          <Route path="/services/reports" element={<ReportsPage />} />
          <Route path="/admin" element={<AdminIndex />} />
          <Route path="/admin/users" element={<UsersPage />} />
          <Route path="/admin/departments" element={<DepartmentsPage />} />
          <Route path="/admin/permissions" element={<PermissionsPage />} />
          <Route path="/admin/audit" element={<AuditPage />} />
          <Route path="/admin/settings" element={<SettingsPage />} />
          <Route path="/admin/reports" element={<AdminReportsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
