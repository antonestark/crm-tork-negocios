
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Users, ShieldCheck, Layers, LineChart, 
  Settings, ClipboardList, Database
} from 'lucide-react';

export function AdminNav() {
  return (
    <nav className="space-y-1">
      <NavLink
        to="/admin"
        className={({ isActive }) =>
          `flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
            isActive
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          }`
        }
        end
      >
        <Layers className="mr-2 h-4 w-4" />
        Dashboard
      </NavLink>
      
      <NavLink
        to="/admin/users"
        className={({ isActive }) =>
          `flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
            isActive
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          }`
        }
      >
        <Users className="mr-2 h-4 w-4" />
        Usuários
      </NavLink>
      
      <NavLink
        to="/admin/departments"
        className={({ isActive }) =>
          `flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
            isActive
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          }`
        }
      >
        <Layers className="mr-2 h-4 w-4" />
        Departamentos
      </NavLink>
      
      <NavLink
        to="/admin/permissions"
        className={({ isActive }) =>
          `flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
            isActive
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          }`
        }
      >
        <ShieldCheck className="mr-2 h-4 w-4" />
        Permissões
      </NavLink>
      
      <NavLink
        to="/admin/audit"
        className={({ isActive }) =>
          `flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
            isActive
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          }`
        }
      >
        <ClipboardList className="mr-2 h-4 w-4" />
        Logs de Auditoria
      </NavLink>
      
      <NavLink
        to="/admin/table-audit"
        className={({ isActive }) =>
          `flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
            isActive
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          }`
        }
      >
        <Database className="mr-2 h-4 w-4" />
        Auditoria de Tabelas
      </NavLink>
      
      <NavLink
        to="/admin/reports"
        className={({ isActive }) =>
          `flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
            isActive
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          }`
        }
      >
        <LineChart className="mr-2 h-4 w-4" />
        Relatórios
      </NavLink>
      
      <NavLink
        to="/admin/settings"
        className={({ isActive }) =>
          `flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
            isActive
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          }`
        }
      >
        <Settings className="mr-2 h-4 w-4" />
        Configurações
      </NavLink>
    </nav>
  );
}
