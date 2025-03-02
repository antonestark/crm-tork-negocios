
import { Header } from "@/components/layout/Header";
import { AdminNav } from "@/components/admin/AdminNav";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { Helmet } from "react-helmet";

const AdminIndex = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Helmet>
        <title>Administração | Tork Negócios</title>
      </Helmet>
      <Header />
      <div className="flex-1 container mx-auto py-6 px-4 md:px-6">
        <div className="grid gap-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Administração</h1>
              <p className="text-muted-foreground">
                Gerencie usuários, departamentos e permissões do sistema
              </p>
            </div>
          </div>
          <AdminNav />
          <AdminDashboard />
        </div>
      </div>
    </div>
  );
};

export default AdminIndex;
