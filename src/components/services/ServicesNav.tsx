
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutGrid, 
  CheckSquare, 
  Wrench, 
  FileText, 
  MessageSquare,
  Grid3X3,
  User
} from "lucide-react";

const navItems = [
  {
    title: "Dashboard",
    icon: LayoutGrid,
    href: "/services",
    exact: true
  },
  {
    title: "Áreas",
    icon: Grid3X3,
    href: "/services/areas"
  },
  {
    title: "Checklist",
    icon: CheckSquare,
    href: "/services/checklist"
  },
  {
    title: "Meus Itens",
    icon: User,
    href: "/services/my-checklist"
  },
  {
    title: "Manutenções",
    icon: Wrench,
    href: "/services/maintenance"
  },
  {
    title: "Demandas",
    icon: MessageSquare,
    href: "/services/demands"
  },
  {
    title: "Relatórios",
    icon: FileText,
    href: "/services/reports"
  }
];

export const ServicesNav = () => {
  const location = useLocation();
  
  const isActive = (path: string, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };
  
  return (
    <div className="bg-slate-900/50 backdrop-blur-md border border-blue-900/40 rounded-lg p-2 mb-6">
      <div className="flex flex-wrap gap-2">
        {navItems.map((item) => (
          <Link 
            key={item.href}
            to={item.href}
            className={cn(
              "flex items-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-all duration-300",
              isActive(item.href, item.exact) 
                ? "bg-gradient-to-r from-blue-600/80 to-indigo-600/80 text-white shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                : "text-slate-300 hover:bg-blue-900/20 hover:text-blue-300"
            )}
          >
            <item.icon className="h-4 w-4" />
            <span>{item.title}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};
