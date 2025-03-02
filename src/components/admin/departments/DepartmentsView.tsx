
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Plus, Users } from "lucide-react";
import { DepartmentFormDialog } from "./DepartmentFormDialog";
import { ConfirmDialog } from "@/components/admin/shared/ConfirmDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DepartmentTreeView } from "./DepartmentTreeView";
import { DepartmentMembersDialog } from "./DepartmentMembersDialog";

interface Department {
  id: string;
  name: string;
  description: string | null;
  level: number;
  parent_id: string | null;
  path: string;
  manager_id: string | null;
  manager?: {
    first_name: string;
    last_name: string;
  };
  _children?: Department[];
  _memberCount?: number;
}

interface DepartmentsViewProps {
  viewMode: "tree" | "list";
}

export function DepartmentsView({ viewMode }: DepartmentsViewProps) {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [hierarchicalDepartments, setHierarchicalDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showMembersDialog, setShowMembersDialog] = useState(false);
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchDepartments();
  }, []);

  async function fetchDepartments() {
    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('departments')
        .select(`
          *,
          manager:users(first_name, last_name)
        `)
        .order('name');
        
      if (error) throw error;
      
      const departmentsWithMembers = await Promise.all((data || []).map(async (dept) => {
        // Count members in each department
        const { count, error: countError } = await supabase
          .from('user_department_roles')
          .select('*', { count: 'exact', head: true })
          .eq('department_id', dept.id);
          
        if (countError) {
          console.error('Error counting members:', countError);
          return { ...dept, _memberCount: 0 };
        }
        
        return { ...dept, _memberCount: count || 0 };
      }));
      
      setDepartments(departmentsWithMembers);
      
      // Build hierarchical structure for tree view
      const hierarchy = buildDepartmentHierarchy(departmentsWithMembers);
      setHierarchicalDepartments(hierarchy);
      
      // Initially expand root nodes
      const expanded: Record<string, boolean> = {};
      hierarchy.forEach(dept => {
        expanded[dept.id] = true;
      });
      setExpandedNodes(expanded);
    } catch (error) {
      console.error('Error fetching departments:', error);
      toast({
        title: "Erro ao carregar departamentos",
        description: "Ocorreu um erro ao buscar os departamentos.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }

  const buildDepartmentHierarchy = (flatDepartments: Department[]): Department[] => {
    const deptMap: Record<string, Department> = {};
    const rootDepartments: Department[] = [];
    
    // First, create a map of all departments by ID
    flatDepartments.forEach(dept => {
      deptMap[dept.id] = { ...dept, _children: [] };
    });
    
    // Then, populate the children arrays and root departments
    flatDepartments.forEach(dept => {
      if (dept.parent_id && deptMap[dept.parent_id]) {
        if (!deptMap[dept.parent_id]._children) {
          deptMap[dept.parent_id]._children = [];
        }
        deptMap[dept.parent_id]._children!.push(deptMap[dept.id]);
      } else {
        rootDepartments.push(deptMap[dept.id]);
      }
    });
    
    return rootDepartments;
  };

  const handleDelete = async () => {
    if (!selectedDepartment) return;
    
    try {
      // Check if department has children
      const { count: childrenCount, error: childrenError } = await supabase
        .from('departments')
        .select('*', { count: 'exact', head: true })
        .eq('parent_id', selectedDepartment.id);
        
      if (childrenError) throw childrenError;
      
      if (childrenCount && childrenCount > 0) {
        toast({
          title: "Não é possível excluir",
          description: "Este departamento possui subdepartamentos. Remova-os primeiro.",
          variant: "destructive"
        });
        setShowDeleteDialog(false);
        return;
      }
      
      // Check if department has members
      const { count: membersCount, error: membersError } = await supabase
        .from('user_department_roles')
        .select('*', { count: 'exact', head: true })
        .eq('department_id', selectedDepartment.id);
        
      if (membersError) throw membersError;
      
      if (membersCount && membersCount > 0) {
        toast({
          title: "Não é possível excluir",
          description: "Este departamento possui membros associados. Remova-os primeiro.",
          variant: "destructive"
        });
        setShowDeleteDialog(false);
        return;
      }
      
      // Delete the department
      const { error } = await supabase
        .from('departments')
        .delete()
        .eq('id', selectedDepartment.id);
        
      if (error) throw error;
      
      toast({
        title: "Departamento excluído",
        description: "O departamento foi removido com sucesso."
      });
      
      // Refresh departments list
      fetchDepartments();
    } catch (error) {
      console.error('Error deleting department:', error);
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir o departamento.",
        variant: "destructive"
      });
    } finally {
      setShowDeleteDialog(false);
      setSelectedDepartment(null);
    }
  };

  const handleToggleNode = (deptId: string) => {
    setExpandedNodes({
      ...expandedNodes,
      [deptId]: !expandedNodes[deptId]
    });
  };

  const renderTableView = () => (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Nível</TableHead>
            <TableHead>Gerente</TableHead>
            <TableHead className="w-[100px]">Membros</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            // Loading skeleton
            Array(5).fill(0).map((_, index) => (
              <TableRow key={index}>
                <TableCell><Skeleton className="h-6 w-36" /></TableCell>
                <TableCell><Skeleton className="h-6 w-48" /></TableCell>
                <TableCell><Skeleton className="h-6 w-12" /></TableCell>
                <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                <TableCell><Skeleton className="h-6 w-12" /></TableCell>
                <TableCell className="text-right"><Skeleton className="h-10 w-28 ml-auto" /></TableCell>
              </TableRow>
            ))
          ) : departments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                Nenhum departamento encontrado
              </TableCell>
            </TableRow>
          ) : (
            departments.map((department) => (
              <TableRow key={department.id} className="group">
                <TableCell className="font-medium">
                  {department.name}
                </TableCell>
                <TableCell>
                  {department.description || '-'}
                </TableCell>
                <TableCell>
                  {department.level}
                </TableCell>
                <TableCell>
                  {department.manager 
                    ? `${department.manager.first_name} ${department.manager.last_name}`
                    : '-'}
                </TableCell>
                <TableCell>
                  {department._memberCount || 0}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedDepartment(department);
                        setShowMembersDialog(true);
                      }}
                    >
                      <Users className="h-4 w-4" />
                      <span className="sr-only">Membros</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedDepartment(department);
                        setShowEditDialog(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Editar</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedDepartment(department);
                        setShowDeleteDialog(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Excluir</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );

  const renderTreeView = () => (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Estrutura Organizacional</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-6 w-48" />
              </div>
            ))}
          </div>
        ) : hierarchicalDepartments.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            Nenhum departamento encontrado
          </div>
        ) : (
          <div className="tree-view">
            <DepartmentTreeView
              departments={hierarchicalDepartments}
              expandedNodes={expandedNodes}
              onToggleNode={handleToggleNode}
              onEdit={(dept) => {
                setSelectedDepartment(dept);
                setShowEditDialog(true);
              }}
              onDelete={(dept) => {
                setSelectedDepartment(dept);
                setShowDeleteDialog(true);
              }}
              onViewMembers={(dept) => {
                setSelectedDepartment(dept);
                setShowMembersDialog(true);
              }}
              onAddSubdepartment={(parentDept) => {
                setSelectedDepartment(parentDept);
                setShowEditDialog(true);
              }}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <>
      {viewMode === "list" ? renderTableView() : renderTreeView()}
      
      {/* Department Edit Dialog */}
      <DepartmentFormDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        department={selectedDepartment}
        parentDepartment={selectedDepartment}
        onSuccess={() => {
          fetchDepartments();
          setSelectedDepartment(null);
        }}
      />
      
      {/* Department Members Dialog */}
      {selectedDepartment && (
        <DepartmentMembersDialog
          open={showMembersDialog}
          onOpenChange={setShowMembersDialog}
          department={selectedDepartment}
        />
      )}
      
      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Excluir departamento"
        description={`Tem certeza que deseja excluir o departamento ${selectedDepartment?.name}? Esta ação não pode ser desfeita.`}
        onConfirm={handleDelete}
      />
    </>
  );
}
