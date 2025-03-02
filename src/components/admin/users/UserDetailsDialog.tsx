import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Briefcase, 
  Phone, 
  Mail, 
  Clock, 
  Shield, 
  CheckCircle, 
  XCircle 
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useEffect, useState } from "react";
import { supabase, activityLogsAdapter, mockPermissionData } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ActivityLog, User, UserPermission } from "@/types/admin";

interface UserDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User;
}

export function UserDetailsDialog({ 
  open, 
  onOpenChange, 
  user
}: UserDetailsDialogProps) {
  const [permissions, setPermissions] = useState<UserPermission[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserDetails() {
      if (!open || !user) return;
      
      setLoading(true);
      
      try {
        // For user_permissions table, we'll use mock data until the table exists
        // This would normally be a Supabase query
        const mockPermissionsData = mockPermissionData();
        setPermissions(mockPermissionsData);
        
        // Fetch user activity logs
        const { data: logsData, error: logsError } = await supabase
          .from('activity_logs')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10);
          
        if (logsError) throw logsError;
        
        // Apply adapter to add missing fields
        setActivityLogs(activityLogsAdapter(logsData || []));
      } catch (error) {
        console.error('Error fetching user details:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchUserDetails();
  }, [open, user]);

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  };

  const formatDateTime = (dateString: string) => {
    return format(new Date(dateString), "dd/MM/yyyy HH:mm", { locale: ptBR });
  };

  const getSeverityBadge = (severity: string | null) => {
    switch (severity) {
      case 'high':
        return <Badge variant="outline" className="text-danger border-danger">Alta</Badge>;
      case 'medium':
        return <Badge variant="outline" className="text-warning border-warning">Média</Badge>;
      case 'low':
        return <Badge variant="outline" className="text-info border-info">Baixa</Badge>;
      default:
        return <Badge variant="outline">Normal</Badge>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>Detalhes do Usuário</span>
            {user.active ? (
              <Badge variant="default" className="bg-success ml-2">Ativo</Badge>
            ) : (
              <Badge variant="outline" className="text-muted-foreground ml-2">Inativo</Badge>
            )}
          </DialogTitle>
          <DialogDescription>
            Informações completas sobre o usuário
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            <Avatar className="w-24 h-24">
              <AvatarImage 
                src={user.profile_image_url || undefined} 
                alt={`${user.first_name} ${user.last_name}`} 
              />
              <AvatarFallback className="text-2xl">{`${user.first_name.charAt(0)}${user.last_name.charAt(0)}`}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-3">
              <h3 className="text-2xl font-semibold text-center md:text-left">
                {user.first_name} {user.last_name}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {user.role} {user.department_id && `- Department ID: ${user.department_id}`}
                  </span>
                </div>
                
                {user.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{user.phone}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Criado em {formatDate(user.created_at)}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {user.last_login 
                      ? `Último acesso em ${formatDate(user.last_login)}` 
                      : 'Nunca acessou'}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <span>{permissions.length} permissões atribuídas</span>
                </div>
                
                <div className="flex items-center gap-2">
                  {user.active 
                    ? <CheckCircle className="h-4 w-4 text-success" />
                    : <XCircle className="h-4 w-4 text-danger" />
                  }
                  <span>{user.active ? 'Conta ativa' : 'Conta inativa'}</span>
                </div>
              </div>
            </div>
          </div>
          
          <Tabs defaultValue="permissions" className="w-full mt-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="permissions">Permissões</TabsTrigger>
              <TabsTrigger value="activity">Atividade Recente</TabsTrigger>
            </TabsList>
            
            <TabsContent value="permissions" className="mt-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Permissões Atribuídas</CardTitle>
                  <CardDescription>
                    Lista de permissões concedidas ao usuário
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[200px] overflow-y-auto pr-4">
                    {loading ? (
                      <div className="text-center py-8 text-muted-foreground">
                        Carregando permissões...
                      </div>
                    ) : permissions.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        Nenhuma permissão específica atribuída
                      </div>
                    ) : (
                      <ul className="space-y-2">
                        {permissions.map((permission) => (
                          <li key={permission.id} className="flex items-center gap-2 p-2 rounded-md hover:bg-muted">
                            <Shield className="h-4 w-4 text-primary" />
                            <div>
                              <p className="font-medium">{permission.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {permission.module} - {permission.code}
                              </p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="activity" className="mt-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Atividade Recente</CardTitle>
                  <CardDescription>
                    Últimas ações realizadas pelo usuário
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[200px] overflow-y-auto pr-4">
                    {loading ? (
                      <div className="text-center py-8 text-muted-foreground">
                        Carregando atividades...
                      </div>
                    ) : activityLogs.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        Nenhuma atividade registrada
                      </div>
                    ) : (
                      <ul className="space-y-2">
                        {activityLogs.map((log) => (
                          <li key={log.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted">
                            <div className="flex-1">
                              <p className="font-medium">{log.action}</p>
                              <p className="text-sm text-muted-foreground">
                                {log.entity_type} - {formatDateTime(log.created_at)}
                              </p>
                            </div>
                            <div>
                              {getSeverityBadge(log.severity)}
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
