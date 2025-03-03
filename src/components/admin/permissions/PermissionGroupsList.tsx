
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { mockPermissionGroupData } from '@/integrations/supabase/mockData';
import { PermissionGroup } from '@/types/admin';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

export function PermissionGroupsList() {
  const [groups, setGroups] = useState<PermissionGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Fetch permission groups
    const fetchGroups = async () => {
      try {
        setLoading(true);
        // In a real app, this would be a call to the Supabase API
        const data = mockPermissionGroupData();
        setGroups(data);
      } catch (error) {
        console.error('Failed to fetch permission groups:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  const toggleGroup = (groupId: string) => {
    setOpenGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };

  const handleEdit = (group: PermissionGroup) => {
    // In a real app, this would open a modal or navigate to an edit page
    console.log('Edit group:', group);
  };

  const handleDelete = (group: PermissionGroup) => {
    // In a real app, this would show a confirmation dialog
    console.log('Delete group:', group);
  };

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">Grupos de Permissões</h2>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" /> Novo Grupo
        </Button>
      </div>

      {loading ? (
        <p>Carregando grupos de permissões...</p>
      ) : (
        <div className="space-y-4">
          {groups.map((group) => (
            <Card key={group.id}>
              <CardContent className="p-4">
                <Collapsible
                  open={openGroups[group.id]}
                  onOpenChange={() => toggleGroup(group.id)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{group.name}</h3>
                      {group.description && (
                        <p className="text-sm text-muted-foreground">
                          {group.description}
                        </p>
                      )}
                      {group.is_system && (
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                          Sistema
                        </span>
                      )}
                    </div>
                    <div className="flex items-center">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(group)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(group)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="icon">
                          {openGroups[group.id] ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </CollapsibleTrigger>
                    </div>
                  </div>
                  <CollapsibleContent className="mt-4">
                    <div className="border-t pt-4">
                      <h4 className="text-sm font-medium mb-2">Permissões incluídas:</h4>
                      {group.permissions && group.permissions.length > 0 ? (
                        <ul className="space-y-1">
                          {group.permissions.map((permission) => (
                            <li key={permission.id} className="text-sm">
                              • {permission.name}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          Este grupo não tem permissões associadas.
                        </p>
                      )}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
