import React from 'react';
import { useAllDepartmentPermissions } from '@/hooks/use-all-department-permissions';
import { Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface Props {
  departmentId: string;
}

export function DepartmentPermissionsCard({ departmentId }: Props) {
  const { permissions, loading } = useAllDepartmentPermissions(departmentId);

  const assignedPermissions = permissions.filter(p => p.assigned);

  const grouped = assignedPermissions.reduce((acc, perm) => {
    if (!acc[perm.resource]) acc[perm.resource] = [];
    acc[perm.resource].push(perm);
    return acc;
  }, {} as Record<string, typeof assignedPermissions>);

  return (
    <div className="rounded-lg border border-gray-700 bg-[#0b1120] p-4 shadow">
      <h3 className="text-lg font-semibold mb-3 text-white">Permissões</h3>
      {loading ? (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        </div>
      ) : assignedPermissions.length === 0 ? (
        <p className="text-sm text-gray-400">Nenhuma permissão vinculada.</p>
      ) : (
        <div className="space-y-4">
          {Object.entries(grouped).map(([resource, perms]) => (
            <div key={resource}>
              <h4 className="text-sm font-semibold text-gray-300 mb-1 capitalize">{resource}</h4>
              <Separator className="mb-2" />
              <ul className="space-y-1">
                {perms.map((perm) => (
                  <li key={`${perm.permission_id}-${perm.resource}-${perm.action}`} className="flex flex-wrap gap-2 text-sm text-gray-300">
                    <span>{perm.title}</span>
                    <span className="px-2 py-0.5 rounded-full bg-gray-600 text-xs">{perm.action}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
