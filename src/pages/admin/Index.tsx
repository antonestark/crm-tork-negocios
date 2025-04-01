
import React from 'react';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { AdminLayout } from '@/components/admin/AdminLayout';

export default function AdminIndex() {
  return (
    <AdminLayout title="Dashboard">
      <AdminDashboard />
    </AdminLayout>
  );
}
