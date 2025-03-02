
import { Header } from "@/components/layout/Header";
import { AdminNav } from "@/components/admin/AdminNav";
import { AuditLogs } from "@/components/admin/audit/AuditLogs";
import { Helmet } from "react-helmet";

const AuditPage = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Helmet>
        <title>Auditoria | Administração | Tork Negócios</title>
      </Helmet>
      <Header />
      <div className="flex-1 container mx-auto py-6 px-4 md:px-6">
        <div className="grid gap-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Auditoria</h1>
              <p className="text-muted-foreground">
                Visualize logs de atividades e alterações no sistema
              </p>
            </div>
          </div>
          <AdminNav />
          
          <AuditLogs />
        </div>
      </div>
    </div>
  );
};

export default AuditPage;
