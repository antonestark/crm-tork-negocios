import { Bell, User, Settings, LogOut, Menu, FileText, Calendar, LayoutDashboard, Users, LayoutGrid, Target, CreditCard, ChevronDown } from "lucide-react"; // Added ChevronDown
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/components/auth/AuthProvider"; // Import useAuth
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton for loading state
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export const Header = () => {
  const location = useLocation();
  const { user, isLoading, signOut } = useAuth(); // Use the auth hook
  
  const isActive = (path: string) => {
    // Check for exact match or if the current path starts with the given path + '/'
    // Also handle the base '/services' path specifically for the trigger button styling
    if (path === '/services') {
      return location.pathname.startsWith('/services');
    }
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  }
  
  return (
    <header className="w-full px-6 py-4 bg-background/50 backdrop-blur-md border-b border-border/40 flex items-center justify-between animate-fade-in">
      <div className="flex items-center space-x-6">
        <h1 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]">Tork Negócios</h1>
        <nav className="hidden md:flex items-center space-x-4">
          <Button 
            variant={isActive('/dashboard') ? "default" : "ghost"} 
            size="sm" 
            className={`flex items-center ${isActive('/dashboard') ? 'bg-gradient-to-r from-[var(--highlight)] to-[var(--secondary)] text-foreground shadow-[0_0_10px_rgba(59,130,246,0.3)]' : 'text-foreground'}`} 
            asChild
          >
            <Link to="/dashboard">
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Dashboard
            </Link>
          </Button>
          <Button 
            variant={isActive('/clients') ? "default" : "ghost"} 
            size="sm" 
            className={`flex items-center ${isActive('/clients') ? 'bg-gradient-to-r from-[var(--highlight)] to-[var(--secondary)] text-foreground shadow-[0_0_10px_rgba(59,130,246,0.3)]' : 'text-foreground'}`}
            asChild
          >
            <Link to="/clients">
              <Users className="h-4 w-4 mr-2" />
              Clientes
            </Link>
          </Button>
          <Button 
            variant={isActive('/leads') ? "default" : "ghost"} 
            size="sm" 
            className={`flex items-center ${isActive('/leads') ? 'bg-gradient-to-r from-[var(--highlight)] to-[var(--secondary)] text-foreground shadow-[0_0_10px_rgba(59,130,246,0.3)]' : 'text-foreground'}`}
            asChild
          >
            <Link to="/leads">
              <Target className="h-4 w-4 mr-2" />
              Leads
            </Link>
          </Button>
          <Button 
            variant={isActive('/agendamento') ? "default" : "ghost"} 
            size="sm" 
            className={`flex items-center ${isActive('/agendamento') ? 'bg-gradient-to-r from-[var(--highlight)] to-[var(--secondary)] text-foreground shadow-[0_0_10px_rgba(59,130,246,0.3)]' : 'text-foreground'}`}
            asChild
          >
            <Link to="/agendamento">
              <Calendar className="h-4 w-4 mr-2" />
              Agenda
            </Link>
          </Button>
          {/* Services Dropdown Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant={isActive('/services') ? "default" : "ghost"} 
                size="sm" 
                className={`flex items-center ${isActive('/services') ? 'bg-gradient-to-r from-[var(--highlight)] to-[var(--secondary)] text-foreground shadow-[0_0_10px_rgba(59,130,246,0.3)]' : 'text-foreground'}`}
              >
                <LayoutGrid className="h-4 w-4 mr-2" />
                Serviços
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-slate-900 border border-blue-900/40 shadow-lg shadow-blue-900/20" align="start">
              {/* Submenu Items */}
              <DropdownMenuItem asChild className="text-slate-300 focus:bg-blue-900/40 focus:text-blue-100">
                <Link to="/services/demands">Demandas</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="text-slate-300 focus:bg-blue-900/40 focus:text-blue-100">
                <Link to="/services/areas">Áreas</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="text-slate-300 focus:bg-blue-900/40 focus:text-blue-100">
                <Link to="/services/maintenance">Manutenção</Link>
              </DropdownMenuItem>
              {/* Removed Reports link from dropdown */}
            </DropdownMenuContent>
          </DropdownMenu>
          {/* Removed Reports Button */}
          {/* Removed Planos Button */}
        </nav>
      </div>
      <div className="flex items-center space-x-4">
        <ThemeToggle />
        
        <Button variant="ghost" size="icon" className="relative text-foreground hover:text-highlight hover:bg-highlight/20">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 bg-blue-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">
            3
          </span>
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full border border-blue-500/30 hover:border-blue-400 hover:bg-blue-900/20 overflow-hidden">
              <Avatar className="h-8 w-8">
                {/* Use real avatar URL or fallback */}
                <AvatarImage src={user?.user_metadata?.avatar_url || ''} alt="Avatar" /> 
                <AvatarFallback className="bg-blue-900/50 text-blue-200">
                  {/* Generate initials from name or use default */}
                  {user?.user_metadata?.full_name ? user.user_metadata.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase() : 
                   user?.email ? user.email[0].toUpperCase() : 'U'}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-slate-900 border border-blue-900/40 shadow-lg shadow-blue-900/20" align="end" forceMount>
            <DropdownMenuLabel className="font-normal text-slate-300">
              {isLoading ? (
                <div className="space-y-1">
                  <Skeleton className="h-4 w-24 bg-slate-700" />
                  <Skeleton className="h-3 w-32 bg-slate-700" />
                </div>
              ) : user ? (
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none text-slate-100">
                    {/* Use real name or fallback */}
                    {user.user_metadata?.full_name || user.email || 'Usuário'} 
                  </p>
                  <p className="text-xs leading-none text-slate-400">
                    {user.email}
                  </p>
                </div>
              ) : (
                 <p className="text-xs leading-none text-slate-400">Não autenticado</p>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-blue-900/40" />
            <DropdownMenuItem asChild className="text-slate-300 focus:bg-blue-900/40 focus:text-blue-100">
              <Link to="/admin">
                <Settings className="mr-2 h-4 w-4" />
                <span>Painel Administrativo</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="text-slate-300 focus:bg-blue-900/40 focus:text-blue-100">
              <Link to="/planos">
                <CreditCard className="mr-2 h-4 w-4" />
                <span>Gerenciar Assinatura</span>
              </Link>
            </DropdownMenuItem>
            {/* Use signOut function from useAuth */}
            <DropdownMenuItem className="text-red-400 focus:bg-red-900/40 focus:text-red-300" onClick={signOut}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
