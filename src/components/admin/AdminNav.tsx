
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Building2, 
  Network, 
  ShieldCheck, 
  FileSearch, 
  BarChart2, 
  Settings, 
  Database 
} from "lucide-react";
import { useLocation, Link } from "react-router-dom";

const navItems = [
  {
    title: "Visão Geral",
    href: "/admin",
    icon: <BarChart2 className="h-5 w-5 mr-2" />,
  },
  {
    title: "Usuários",
    href: "/admin/users",
    icon: <Users className="h-5 w-5 mr-2" />,
  },
  {
    title: "Empresas",
    href: "/admin/companies",
    icon: <Building2 className="h-5 w-5 mr-2" />,
  },
  {
    title: "Departamentos",
    href: "/admin/departments",
    icon: <Network className="h-5 w-5 mr-2" />,
  },
  {
    title: "Permissões",
    href: "/admin/permissions",
    icon: <ShieldCheck className="h-5 w-5 mr-2" />,
  },
  {
    title: "Auditoria",
    href: "/admin/audit",
    icon: <FileSearch className="h-5 w-5 mr-2" />,
  },
  {
    title: "Auditoria de Tabelas",
    href: "/admin/table-audit",
    icon: <Database className="h-5 w-5 mr-2" />,
  },
  {
    title: "Relatórios",
    href: "/admin/reports",
    icon: <BarChart2 className="h-5 w-5 mr-2" />,
  },
  {
    title: "Configurações",
    href: "/admin/settings",
    icon: <Settings className="h-5 w-5 mr-2" />,
  },
];

interface AdminNavProps extends React.HTMLAttributes<HTMLElement> {}

export function AdminNav({ className, ...props }: AdminNavProps) {
  const location = useLocation();

  return (
    <nav className={cn("grid gap-1", className)} {...props}>
      {navItems.map((item) => (
        <Button
          key={item.href}
          variant={location.pathname === item.href ? "default" : "ghost"}
          className={cn("justify-start", 
            location.pathname === item.href 
              ? "bg-primary text-primary-foreground" 
              : "text-muted-foreground hover:text-foreground"
          )}
          asChild
        >
          <Link to={item.href}>
            {item.icon}
            {item.title}
          </Link>
        </Button>
      ))}
    </nav>
  );
}
