
import { Header } from "@/components/layout/Header";
import { AdminNav } from "@/components/admin/AdminNav";
import { DepartmentsView } from "@/components/admin/departments/DepartmentsView";
import { Button } from "@/components/ui/button";
import { FolderPlus, List, Network } from "lucide-react";
import { useState } from "react";
import { DepartmentFormDialog } from "@/components/admin/departments/DepartmentFormDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Helmet } from "react-helmet";

const DepartmentsPage = () => {
  const [showNewDepartmentDialog, setShowNewDepartmentDialog] = useState(false);
  const [viewMode, setViewMode] = useState<"tree" | "list">("tree");

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Helmet>
        <title>Departamentos | Administração | Tork Negócios</title>
      </Helmet>
      <Header />
      <div className="flex-1 container mx-auto py-6 px-4 md:px-6">
        <div className="grid gap-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Departamentos</h1>
              <p className="text-muted-foreground">
                Gerencie a estrutura organizacional da empresa
              </p>
            </div>
            <div className="flex gap-2">
              <Tabs defaultValue="tree" className="w-[200px]">
                <TabsList>
                  <TabsTrigger value="tree" onClick={() => setViewMode("tree")}>
                    <Network className="h-4 w-4 mr-2" />
                    Árvore
                  </TabsTrigger>
                  <TabsTrigger value="list" onClick={() => setViewMode("list")}>
                    <List className="h-4 w-4 mr-2" />
                    Lista
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              <Button 
                size="sm" 
                onClick={() => setShowNewDepartmentDialog(true)}
              >
                <FolderPlus className="h-4 w-4 mr-2" />
                Novo Departamento
              </Button>
            </div>
          </div>
          <AdminNav />
          
          <DepartmentsView viewMode={viewMode} />
          
          <DepartmentFormDialog 
            open={showNewDepartmentDialog}
            onOpenChange={setShowNewDepartmentDialog}
          />
        </div>
      </div>
    </div>
  );
};

export default DepartmentsPage;
