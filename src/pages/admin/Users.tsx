
import { useEffect } from 'react';
import { AdminNav } from '@/components/admin/AdminNav';
import { UsersTable } from '@/components/admin/users/UsersTable';
import { Helmet } from 'react-helmet';

const UsersPage = () => {
  // Default filter values
  const defaultFilters = {
    status: 'all',
    department: 'all',
    search: ''
  };

  useEffect(() => {
    document.title = "Users | Admin";
  }, []);

  return (
    <div className="container mx-auto py-6">
      <Helmet>
        <title>Users | Admin</title>
      </Helmet>
      <AdminNav />
      <div className="mt-6">
        <UsersTable filters={defaultFilters} />
      </div>
    </div>
  );
};

export default UsersPage;
