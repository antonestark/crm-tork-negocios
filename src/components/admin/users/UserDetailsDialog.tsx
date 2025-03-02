import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { User } from '@/types/admin';
import { extractEmail } from '@/integrations/supabase/utils';

interface UserDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userData: User; // This should be 'userData' to match how it's used in UsersTable
}

const UserDetailsDialog: React.FC<UserDetailsDialogProps> = ({
  open,
  onOpenChange,
  userData
}) => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString();
  };

  const email = extractEmail(userData.metadata);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 gap-4 py-4">
          <div className="flex items-center space-x-4">
            {userData.profile_image_url ? (
              <img 
                src={userData.profile_image_url} 
                alt={`${userData.first_name} ${userData.last_name}`}
                className="h-16 w-16 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <span className="text-xl font-medium">
                  {userData.first_name.charAt(0)}{userData.last_name.charAt(0)}
                </span>
              </div>
            )}
            
            <div>
              <h3 className="text-lg font-medium">
                {userData.first_name} {userData.last_name}
              </h3>
              <p className="text-sm text-muted-foreground">{email}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Role</h4>
              <p>{userData.role}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Department</h4>
              <p>{userData.department?.name || 'None'}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Status</h4>
              <p className={`inline-flex px-2 py-1 rounded-full text-xs ${
                userData.status === 'active' ? 'bg-green-100 text-green-800' : 
                userData.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                userData.status === 'blocked' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {userData.status}
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Phone</h4>
              <p>{userData.phone || 'Not provided'}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Created</h4>
              <p>{formatDate(userData.created_at)}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Last Login</h4>
              <p>{formatDate(userData.last_login)}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailsDialog;
