
import { Link, useLocation } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { 
  LayoutGrid, 
  CheckSquare, 
  Wrench, 
  FileText, 
  MessageSquare,
  Grid3X3
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
    <Card className="p-2 mb-6">
      <div className="flex flex-wrap gap-2">
        {navItems.map((item) => (
          <Link 
            key={item.href}
            to={item.href}
            className={cn(
              "flex items-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-colors",
              isActive(item.href, item.exact) 
                ? "bg-primary text-primary-foreground" 
                : "hover:bg-muted"
            )}
          >
            <item.icon className="h-4 w-4" />
            <span>{item.title}</span>
          </Link>
        ))}
      </div>
    </Card>
  );
};
