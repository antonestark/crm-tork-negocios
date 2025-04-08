import React, { useEffect, useState } from 'react';
import {
  fetchUserGlobalPermissions,
  addGlobalPermissionToUser,
  removeGlobalPermissionFromUser,
} from '@/hooks/use-user-permissions';

const UserGlobalPermissionsCard = ({ userId }: { userId: string }) => {
  const [permissions, setPermissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const loadPermissions = async () => {
    setLoading(true);
    const perms = await fetchUserGlobalPermissions(userId);
    setPermissions(perms);
    setLoading(false);
  };

  useEffect(() => {
    loadPermissions();
  }, [userId]);

  const handleAdd = async () => {
    const permissionId = prompt('Digite o ID da permissão para adicionar:');
    if (!permissionId) return;
    setLoading(true);
    try {
      await addGlobalPermissionToUser(userId, permissionId);
      await loadPermissions();
    } catch {
      alert('Erro ao adicionar permissão');
    }
    setLoading(false);
  };

  const handleRemove = async (permissionId: string) => {
    setLoading(true);
    try {
      await removeGlobalPermissionFromUser(userId, permissionId);
      await loadPermissions();
    } catch {
      alert('Erro ao remover permissão');
    }
    setLoading(false);
  };

  return (
    <div className="border rounded-lg p-4">
      <h3 className="font-semibold mb-2">Permissões Globais do Usuário</h3>
      {loading ? (
        <p>Carregando...</p>
      ) : permissions.length === 0 ? (
        <p>Este usuário não possui permissões globais.</p>
      ) : (
        <ul className="space-y-2">
          {permissions.map((perm) => (
            <li key={perm.id} className="flex justify-between items-center border-b pb-1">
              <div>
                <div className="font-medium">{perm.name}</div>
                <div className="text-sm text-muted-foreground">{perm.code}</div>
              </div>
              <button
                disabled={loading}
                onClick={() => handleRemove(perm.id)}
                className="text-red-500 hover:underline"
              >
                Remover
              </button>
            </li>
          ))}
        </ul>
      )}
      <button disabled={loading} onClick={handleAdd} className="mt-4 btn btn-primary">
        Adicionar Permissão
      </button>
    </div>
  );
};

export default UserGlobalPermissionsCard;
