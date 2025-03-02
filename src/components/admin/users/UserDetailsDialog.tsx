
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Department, User } from '@/types/admin';

export interface UserDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userData: User;
}

const UserDetailsDialog: React.FC<UserDetailsDialogProps> = ({
  open,
  onOpenChange,
  userData
}) => {
  if (!userData) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
          <DialogDescription>
            Detailed information about this user.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Basic Information</h3>
            <Separator className="my-2" />
            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm font-medium">Name:</div>
              <div className="text-sm">{userData.first_name} {userData.last_name}</div>
              
              <div className="text-sm font-medium">Role:</div>
              <div className="text-sm">{userData.role}</div>
              
              <div className="text-sm font-medium">Status:</div>
              <div className="text-sm">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  userData.status === 'active' ? 'bg-green-100 text-green-800' : 
                  userData.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                  userData.status === 'blocked' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {userData.status}
                </span>
              </div>
              
              <div className="text-sm font-medium">Phone:</div>
              <div className="text-sm">{userData.phone || '-'}</div>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">System Information</h3>
            <Separator className="my-2" />
            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm font-medium">User ID:</div>
              <div className="text-sm text-xs font-mono">{userData.id}</div>
              
              <div className="text-sm font-medium">Last Login:</div>
              <div className="text-sm">{userData.last_login ? new Date(userData.last_login).toLocaleString() : 'Never'}</div>
              
              <div className="text-sm font-medium">Created At:</div>
              <div className="text-sm">{new Date(userData.created_at).toLocaleString()}</div>
              
              <div className="text-sm font-medium">Updated At:</div>
              <div className="text-sm">{new Date(userData.updated_at).toLocaleString()}</div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailsDialog;
