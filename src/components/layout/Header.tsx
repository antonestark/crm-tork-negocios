
import { Bell, User, Settings, LogOut, Menu, FileText, Calendar, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  return (
    <header className="w-full px-6 py-4 bg-white border-b flex items-center justify-between animate-fade-in">
      <div className="flex items-center space-x-6">
        <h1 className="text-2xl font-semibold text-primary">Tork Negócios</h1>
        <nav className="hidden md:flex items-center space-x-4">
          <Button variant="ghost" size="sm" className="flex items-center">
            <Home className="h-4 w-4 mr-2" />
            Início
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            Agenda
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            Relatórios
          </Button>
        </nav>
      </div>
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 bg-danger text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">
            3
          </span>
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://github.com/shadcn.png" alt="Avatar" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Carlos Silva</p>
                <p className="text-xs leading-none text-muted-foreground">
                  carlos@tork.com.br
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Configurações</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-danger">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
