
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CalendarIcon, ShieldCheck, Users, User, Activity } from "lucide-react";
import { format } from 'date-fns';

import { User as UserType, ActivityLog, UserPermission } from '@/types/admin';
import { useToast } from "@/hooks/use-toast";
import { supabase, userAdapter, activityLogsAdapter, mockUserPermissionData, extractEmail } from "@/integrations/supabase/client";

interface UserDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
}

const UserDetailsDialog = ({ open, onOpenChange, userId }: UserDetailsDialogProps) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [userPermissions, setUserPermissions] = useState<UserPermission[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("details");
  const { toast } = useToast();

  useEffect(() => {
    if (open && userId) {
      fetchUserDetails();
    }
  }, [open, userId]);

  const fetchUserDetails = async () => {
    try {
      setLoading(true);

      // Fetch user details with department
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*, departments:department_id(*)')
        .eq('id', userId)
        .single();

      if (userError) throw userError;

      const adaptedUser = userAdapter([userData])[0];
      setUser(adaptedUser);

      // Get user permissions (using mock data since table doesn't exist)
      const mockPermissionsData = mockUserPermissionData(userId);
      setUserPermissions(mockPermissionsData);

      // Fetch activity logs
      const { data: logsData, error: logsError } = await supabase
        .from('activity_logs')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (logsError) throw logsError;

      const adaptedLogs = activityLogsAdapter(logsData || []);
      setActivityLogs(adaptedLogs);
    } catch (error) {
      console.error('Error fetching user details:', error);
      toast({
        title: 'Error',
        description: 'Could not load user details',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPermissions = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) throw error;

      // Use mockUserPermissionData since the table doesn't exist yet
      const mockData = mockUserPermissionData(user?.id || '');
      setUserPermissions(mockData);
      
      // Use a valid toast variant
      toast({
        title: "Permissions loaded",
        description: "User permissions have been loaded successfully",
        variant: "default",
      });
    } catch (error) {
      console.error('Error fetching user permissions:', error);
      toast({
        title: "Error",
        description: "Failed to load user permissions",
        variant: "destructive",
      });
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleManagePermissions = () => {
    toast({
      title: 'Not implemented',
      description: 'Managing permissions is not yet implemented.',
    });
  };

  const DetailsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={user?.profile_image_url || ""} alt={user?.first_name} />
          <AvatarFallback>{user?.first_name?.[0]}{user?.last_name?.[0]}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-lg font-medium">{user?.first_name} {user?.last_name}</h3>
          <p className="text-sm text-muted-foreground">{user?.role}</p>
          {user?.status === 'active' ? (
            <Badge variant="outline">Active</Badge>
          ) : (
            <Badge variant="destructive">{user?.status}</Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="text-sm font-bold mb-2">Personal Information</div>
          <div className="text-muted-foreground">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>{user?.first_name} {user?.last_name}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>{user?.department?.name || 'No Department'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <CalendarIcon className="h-4 w-4" />
              <span>Last Login: {user?.last_login ? format(new Date(user.last_login), 'MMM dd, yyyy h:mm a') : 'Never'}</span>
            </div>
          </div>
        </div>

        <div>
          <div className="text-sm font-bold mb-2">Account Details</div>
          <div className="text-muted-foreground">
            <div>Email: {user?.metadata ? extractEmail(user.metadata) : 'N/A'}</div>
            <div>Phone: {user?.phone || 'N/A'}</div>
            <div>Status: {user?.status}</div>
          </div>
        </div>
      </div>
    </div>
  );

  const ActivityTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Activity Logs</h3>
      <ScrollArea className="h-[300px] w-full">
        <div className="space-y-4">
          {activityLogs.length === 0 ? (
            <p className="text-muted-foreground py-4">No activity logs found for this user.</p>
          ) : (
            activityLogs.map((log) => (
              <div key={log.id} className="border rounded-md p-3">
                <div className="font-medium">{log.action}</div>
                <div className="text-sm text-muted-foreground">
                  {log.entity_type} ID: {log.entity_id}
                </div>
                <div className="text-xs text-muted-foreground">
                  {format(new Date(log.created_at), 'MMM dd, yyyy h:mm a')}
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );

  const PermissionsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h3 className="text-lg font-medium">User Permissions</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={handleManagePermissions}
        >
          Manage Permissions
        </Button>
      </div>

      {userPermissions.length === 0 ? (
        <p className="text-muted-foreground py-4">This user has no specific permissions assigned.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {userPermissions.map((permObj) => (
            <div key={permObj.id} className="border rounded-md p-3">
              <div className="font-medium">{permObj.permission?.name}</div>
              <div className="text-sm text-muted-foreground">{permObj.permission?.module}:{permObj.permission?.code}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[825px]">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
          <DialogDescription>
            View detailed information about the selected user.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            Loading user details...
          </div>
        ) : (
          <Tabs defaultValue="details" className="space-y-4" onValueChange={handleTabChange}>
            <TabsList>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="permissions">Permissions</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="space-y-2">
              <DetailsTab />
            </TabsContent>
            <TabsContent value="activity" className="space-y-2">
              <ActivityTab />
            </TabsContent>
            <TabsContent value="permissions" className="space-y-2">
              <PermissionsTab />
            </TabsContent>
          </Tabs>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailsDialog;
