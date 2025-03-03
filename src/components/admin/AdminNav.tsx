
import { useLocation, Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Users, FolderKanban, Shield, FileText, Activity, Settings, BarChart } from "lucide-react";

export function AdminNav() {
  const location = useLocation();

  const navItems = [
    {
      title: "Visão Geral",
      href: "/admin",
      icon: <FileText className="h-4 w-4 mr-2" />,
      exact: true
    },
    {
      title: "Usuários",
      href: "/admin/users",
      icon: <Users className="h-4 w-4 mr-2" />
    },
    {
      title: "Departamentos",
      href: "/admin/departments",
      icon: <FolderKanban className="h-4 w-4 mr-2" />
    },
    {
      title: "Permissões",
      href: "/admin/permissions",
      icon: <Shield className="h-4 w-4 mr-2" />
    },
    {
      title: "Auditoria",
      href: "/admin/audit",
      icon: <Activity className="h-4 w-4 mr-2" />
    },
    {
      title: "Configurações",
      href: "/admin/settings",
      icon: <Settings className="h-4 w-4 mr-2" />
    },
    {
      title: "Relatórios",
      href: "/admin/reports",
      icon: <BarChart className="h-4 w-4 mr-2" />
    }
  ];

  const isActive = (path: string, exact = false) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="flex space-x-2 lg:space-x-4 overflow-auto pb-2">
      {navItems.map((item) => (
        <Link
          key={item.href}
          to={item.href}
          className={cn(
            "flex items-center justify-center md:justify-start rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted",
            isActive(item.href, item.exact) 
              ? "bg-primary text-primary-foreground" 
              : "bg-transparent hover:text-primary"
          )}
        >
          {item.icon}
          {item.title}
        </Link>
      ))}
    </nav>
  );
}
