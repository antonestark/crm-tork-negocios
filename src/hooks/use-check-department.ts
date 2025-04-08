
import { useState } from 'react';

export function useCheckDepartment(departmentName: string, role?: string | null) {
  // Simplesmente retorna true para qualquer departamento
  const isInDepartment = true;
  const loading = false;

  return { isInDepartment, loading };
}
