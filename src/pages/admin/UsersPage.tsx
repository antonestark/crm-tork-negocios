import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import UserGlobalPermissionsCard from '@/components/admin/UserGlobalPermissionsCard';

const UsersPage = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  useEffect(() => {
    async function fetchUsers() {
      const { data, error } = await supabase.from('users').select('*');
      if (error) console.error(error);
      else setUsers(data);
    }
    fetchUsers();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Usuários</h1>
      <ul className="space-y-2">
        {users.map((user) => (
          <li key={user.id} className="flex justify-between items-center border-b pb-2">
            <div>
              <div className="font-medium">{user.name}</div>
              <div className="text-sm">{user.email}</div>
            </div>
            <button
              className="btn btn-primary"
              onClick={() => setSelectedUser(user)}
            >
              Gerenciar Permissões
            </button>
          </li>
        ))}
      </ul>

      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg max-w-lg w-full">
            <h2 className="font-semibold mb-2">Permissões Globais</h2>
            <UserGlobalPermissionsCard userId={selectedUser.id} />
            <button onClick={() => setSelectedUser(null)} className="mt-4 btn btn-secondary">
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;
