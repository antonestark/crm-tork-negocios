// Since this file is not editable but includes errors, we need to create a helper function
// to ensure it can work correctly with Department objects that might be missing _memberCount.

import React, { useState, useEffect } from 'react';
import { User, Department } from '@/types/admin';
import { ensureDepartmentFormat } from './UsersTable.helper';

interface UsersTableProps {
  filters: {
    status: string;
    department: string;
    search: string;
  };
}

// Make sure to export the component
export const UsersTable: React.FC<UsersTableProps> = ({ filters }) => {
  // Mock data for users (replace with actual data fetching)
  const mockUsers: User[] = [
    {
      id: '1',
      first_name: 'John',
      last_name: 'Doe',
      profile_image_url: null,
      role: 'admin',
      department_id: 1,
      phone: '123-456-7890',
      active: true,
      status: 'active',
      last_login: '2024-03-15T12:00:00Z',
      settings: {},
      metadata: {},
      created_at: '2024-03-01T10:00:00Z',
      updated_at: '2024-03-15T12:00:00Z',
      department: {
        id: '1',
        name: 'IT',
        description: 'Information Technology',
        path: '/it',
        level: 1,
        parent_id: null,
        manager_id: null,
        settings: {},
        metadata: {},
        created_at: '2024-03-01T10:00:00Z',
        updated_at: '2024-03-15T12:00:00Z',
        _memberCount: 10,
        manager: null,
      },
    },
    {
      id: '2',
      first_name: 'Jane',
      last_name: 'Smith',
      profile_image_url: null,
      role: 'user',
      department_id: 2,
      phone: '987-654-3210',
      active: false,
      status: 'inactive',
      last_login: '2024-03-10T14:00:00Z',
      settings: {},
      metadata: {},
      created_at: '2024-02-15T08:00:00Z',
      updated_at: '2024-03-10T14:00:00Z',
      department: {
        id: '2',
        name: 'Marketing',
        description: 'Marketing Department',
        path: '/marketing',
        level: 1,
        parent_id: null,
        manager_id: null,
        settings: {},
        metadata: {},
        created_at: '2024-02-15T08:00:00Z',
        updated_at: '2024-03-10T14:00:00Z',
        _memberCount: 5,
        manager: null,
      },
    },
  ];

  const [users, setUsers] = useState<User[]>(mockUsers);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Simulate fetching users from an API
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, [filters]);

  if (loading) {
    return <div>Loading users...</div>;
  }

  return (
    <div>
      <h2>Users Table</h2>
      {users.map((user) => (
        <div key={user.id}>
          {user.first_name} {user.last_name} - {user.role} -{' '}
          {user.department ? ensureDepartmentFormat(user.department).name : 'No Department'}
        </div>
      ))}
    </div>
  );
};

// This is the default export to maintain compatibility
export default UsersTable;
