
import { Bell, User, Settings, LogOut, Menu, FileText, Calendar, LayoutDashboard, Users, LayoutGrid, Target, CreditCard } from "lucide-react";
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

export const Header = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  }
  
  return (
    <header className="w-full px-6 py-4 bg-slate-900/50 backdrop-blur-md border-b border-blue-900/40 flex items-center justify-between animate-fade-in">
      <div className="flex items-center space-x-6">
        <h1 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]">Tork Negócios</h1>
        <nav className="hidden md:flex items-center space-x-4">
          <Button 
            variant={isActive('/dashboard') ? "default" : "ghost"} 
            size="sm" 
            className={`flex items-center ${isActive('/dashboard') ? 'bg-gradient-to-r from-blue-600/80 to-indigo-600/80 text-white shadow-[0_0_10px_rgba(59,130,246,0.3)]' : 'text-slate-300'}`} 
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
            className={`flex items-center ${isActive('/clients') ? 'bg-gradient-to-r from-blue-600/80 to-indigo-600/80 text-white shadow-[0_0_10px_rgba(59,130,246,0.3)]' : 'text-slate-300'}`}
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
            className={`flex items-center ${isActive('/leads') ? 'bg-gradient-to-r from-blue-600/80 to-indigo-600/80 text-white shadow-[0_0_10px_rgba(59,130,246,0.3)]' : 'text-slate-300'}`}
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
            className={`flex items-center ${isActive('/agendamento') ? 'bg-gradient-to-r from-blue-600/80 to-indigo-600/80 text-white shadow-[0_0_10px_rgba(59,130,246,0.3)]' : 'text-slate-300'}`}
            asChild
          >
            <Link to="/agendamento">
              <Calendar className="h-4 w-4 mr-2" />
              Agenda
            </Link>
          </Button>
          <Button 
            variant={isActive('/services') ? "default" : "ghost"} 
            size="sm" 
            className={`flex items-center ${isActive('/services') ? 'bg-gradient-to-r from-blue-600/80 to-indigo-600/80 text-white shadow-[0_0_10px_rgba(59,130,246,0.3)]' : 'text-slate-300'}`}
            asChild
          >
            <Link to="/services">
              <LayoutGrid className="h-4 w-4 mr-2" />
              Serviços
            </Link>
          </Button>
          <Button 
            variant={isActive('/services/reports') ? "default" : "ghost"} 
            size="sm" 
            className={`flex items-center ${isActive('/services/reports') ? 'bg-gradient-to-r from-blue-600/80 to-indigo-600/80 text-white shadow-[0_0_10px_rgba(59,130,246,0.3)]' : 'text-slate-300'}`}
            asChild
          >
            <Link to="/services/reports">
              <FileText className="h-4 w-4 mr-2" />
              Relatórios
            </Link>
          </Button>
          <Button 
            variant={isActive('/planos') ? "default" : "ghost"} 
            size="sm" 
            className={`flex items-center ${isActive('/planos') ? 'bg-gradient-to-r from-blue-600/80 to-indigo-600/80 text-white shadow-[0_0_10px_rgba(59,130,246,0.3)]' : 'text-slate-300'}`}
            asChild
          >
            <Link to="/planos">
              <CreditCard className="h-4 w-4 mr-2" />
              Planos
            </Link>
          </Button>
        </nav>
      </div>
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" className="relative text-slate-300 hover:text-blue-400 hover:bg-blue-900/20">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 bg-blue-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">
            3
          </span>
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full border border-blue-500/30 hover:border-blue-400 hover:bg-blue-900/20 overflow-hidden">
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://github.com/shadcn.png" alt="Avatar" />
                <AvatarFallback className="bg-blue-900/50 text-blue-200">CS</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-slate-900 border border-blue-900/40 shadow-lg shadow-blue-900/20" align="end" forceMount>
            <DropdownMenuLabel className="font-normal text-slate-300">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none text-slate-100">Carlos Silva</p>
                <p className="text-xs leading-none text-slate-400">
                  carlos@tork.com.br
                </p>
              </div>
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
            <DropdownMenuItem className="text-red-400 focus:bg-red-900/40 focus:text-red-300">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
