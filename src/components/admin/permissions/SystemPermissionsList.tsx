import React from 'react';
import { SYSTEM_PERMISSIONS } from '../../../types/system-permissions';
import { PermissionCard } from './PermissionCard';

export function SystemPermissionsList() {
  const permissions = SYSTEM_PERMISSIONS ?? [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {Array.isArray(permissions) && permissions.length > 0 ? (
        permissions.map((perm) => (
          <PermissionCard
            key={perm.code}
            title={perm.title}
            description={perm.description}
            tags={['admin', perm.page]}
            actionTag={perm.action}
            code={perm.code}
          />
        ))
      ) : (
        <p className="text-gray-400">Nenhuma permissão disponível.</p>
      )}
    </div>
  );
}
