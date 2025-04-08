
import { useState } from 'react';

export function useCheckPermission(_permissionCode: string) {
  // Simplesmente retorna true para todas as permissões
  const hasPermission = true;
  const loading = false;

  return { hasPermission, loading };
}
