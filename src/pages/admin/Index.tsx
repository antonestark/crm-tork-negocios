import React from 'react';
import { Helmet } from 'react-helmet';
import { AdminNav } from '@/components/admin/AdminNav';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { BaseLayout } from '@/components/layout/BaseLayout'; // Import BaseLayout

export default function AdminIndex() {
  return (
    // Use BaseLayout
    <BaseLayout>
      <Helmet>
        <title>Admin Dashboard</title>
      </Helmet>
      
      {/* Removed old header and separator */}
      
      {/* Adjusted layout: Flex container for nav and main content */}
      {/* Added py-6 from BaseLayout standard, removed p-8 from original root div */}
      <div className="flex h-full py-6"> 
        {/* Admin Navigation */}
        <div className="w-64 mr-8 px-4"> {/* Added padding */}
          <AdminNav />
        </div>
        
        {/* Main Content Area */}
        <div className="flex-1 px-4"> {/* Added padding */}
          {/* Removed old header div */}
          <AdminDashboard />
        </div>
      </div>
    </BaseLayout>
  );
}
