import { useEffect, useState } from 'react';

export function useCheckPermission(_permissionCode: string) {
  const [loading, setLoading] = useState(false);
  const [hasPermission, setHasPermission] = useState(true);

  useEffect(() => {
    setLoading(false);
    setHasPermission(true);
  }, [_permissionCode]);

  return { hasPermission, loading };
}
