
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { mockPermissionData } from '@/integrations/supabase/mockData';
import { Permission } from '@/types/admin';

export function PermissionsList() {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch permissions
    const fetchPermissions = async () => {
      try {
        setLoading(true);
        // In a real app, this would be a call to the Supabase API
        const data = mockPermissionData();
        setPermissions(data);
      } catch (error) {
        console.error('Failed to fetch permissions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();
  }, []);

  const handleEdit = (permission: Permission) => {
    // In a real app, this would open a modal or navigate to an edit page
    console.log('Edit permission:', permission);
  };

  const handleDelete = (permission: Permission) => {
    // In a real app, this would show a confirmation dialog
    console.log('Delete permission:', permission);
  };

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">Permissões do Sistema</h2>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" /> Nova Permissão
        </Button>
      </div>

      {loading ? (
        <p>Carregando permissões...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {permissions.map((permission) => (
            <Card key={permission.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{permission.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {permission.code}
                    </p>
                    {permission.description && (
                      <p className="text-sm mt-2">{permission.description}</p>
                    )}
                    <div className="mt-2">
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {permission.module}
                      </span>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded ml-2">
                        {permission.actions.join(', ')}
                      </span>
                    </div>
                  </div>
                  <div className="flex">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(permission)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(permission)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
