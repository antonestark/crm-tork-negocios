
import { Header } from "@/components/layout/Header";
import { AdminNav } from "@/components/admin/AdminNav";
import { UsersTable } from "@/components/admin/users/UsersTable";
import { Button } from "@/components/ui/button";
import { UserPlus, Filter, RefreshCw } from "lucide-react";
import { useState } from "react";
import { UserFormDialog } from "@/components/admin/users/UserFormDialog";
import { UserFilters } from "@/components/admin/users/UserFilters";
import { Helmet } from "react-helmet";

const UsersPage = () => {
  const [showNewUserDialog, setShowNewUserDialog] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: "all",
    department: "all",
    search: "",
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Helmet>
        <title>Usuários | Administração | Tork Negócios</title>
      </Helmet>
      <Header />
      <div className="flex-1 container mx-auto py-6 px-4 md:px-6">
        <div className="grid gap-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Usuários</h1>
              <p className="text-muted-foreground">
                Gerencie os usuários do sistema e suas permissões
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </Button>
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Atualizar
              </Button>
              <Button 
                size="sm" 
                onClick={() => setShowNewUserDialog(true)}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Novo Usuário
              </Button>
            </div>
          </div>
          <AdminNav />
          
          {showFilters && (
            <UserFilters 
              filters={filters} 
              setFilters={setFilters} 
              onClose={() => setShowFilters(false)}
            />
          )}
          
          <UsersTable filters={filters} />
          
          <UserFormDialog 
            open={showNewUserDialog}
            onOpenChange={setShowNewUserDialog}
          />
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
