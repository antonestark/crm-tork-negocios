
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PermissionsList } from './PermissionsList';
import { PermissionGroupList } from './PermissionGroupsList';
import { UserPermissionsManager } from './UserPermissionsManager';

export function PermissionsManager() {
  return (
    <Tabs defaultValue="permissions" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="permissions">Permissões</TabsTrigger>
        <TabsTrigger value="groups">Grupos de Permissões</TabsTrigger>
        <TabsTrigger value="users">Permissões por Usuário</TabsTrigger>
      </TabsList>
      
      <TabsContent value="permissions" className="mt-6">
        <PermissionsList />
      </TabsContent>
      
      <TabsContent value="groups" className="mt-6">
        <PermissionGroupList permissionGroups={[]} loading={false} onGroupChange={() => {}} />
      </TabsContent>
      
      <TabsContent value="users" className="mt-6">
        <UserPermissionsManager />
      </TabsContent>
    </Tabs>
  );
}
