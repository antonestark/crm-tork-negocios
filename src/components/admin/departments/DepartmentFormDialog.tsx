
import { useState, useEffect } from 'react';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Department, User } from '@/types/admin';
import { supabase } from "@/integrations/supabase/client";

interface DepartmentFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  department?: Department; // If provided, we're editing. Otherwise, creating new.
  departments: Department[]; // All departments for parent selection
}

const DepartmentFormDialog: React.FC<DepartmentFormDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  department,
  departments
}) => {
  const [formData, setFormData] = useState<Partial<Department>>({
    name: '',
    description: '',
    parent_id: null,
    manager_id: null
  });
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Initialize form when editing an existing department
  useEffect(() => {
    if (department) {
      setFormData({
        name: department.name,
        description: department.description,
        parent_id: department.parent_id,
        manager_id: department.manager_id
      });
    } else {
      // Reset form when creating a new department
      setFormData({
        name: '',
        description: '',
        parent_id: null,
        manager_id: null
      });
    }
  }, [department, isOpen]);

  // Load users for manager selection
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('id, first_name, last_name, role')
          .eq('active', true)
          .order('first_name', { ascending: true });
        
        if (error) throw error;
        
        // Transformar os dados para corresponder à interface User
        const transformedUsers = (data || []).map(user => ({
          ...user,
          profile_image_url: null,
          department_id: null,
          phone: null,
          active: true,
          status: 'active' as const,
          last_login: null,
          settings: {},
          metadata: {},
          created_at: '',
          updated_at: ''
        }));
        
        setUsers(transformedUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast({
          title: 'Error',
          description: 'Failed to load users data',
          variant: 'destructive',
        });
      }
    };

    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen, toast]);

  const handleChange = (key: keyof Department, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      if (!formData.name) {
        toast({
          title: 'Validation Error',
          description: 'Department name is required',
          variant: 'destructive',
        });
        return;
      }

      // Create new department or update existing one
      const operation = department ? 
        supabase.from('departments').update({
          name: formData.name,
          description: formData.description,
          parent_id: formData.parent_id || null,
          manager_id: formData.manager_id || null
        }).eq('id', department.id) :
        supabase.from('departments').insert({
          name: formData.name,
          description: formData.description,
          parent_id: formData.parent_id || null,
          manager_id: formData.manager_id || null
        });

      const { error } = await operation;
      
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: `Department ${department ? 'updated' : 'created'} successfully`,
      });
      
      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving department:', error);
      toast({
        title: 'Error',
        description: `Failed to ${department ? 'update' : 'create'} department`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter out the current department and its children from parent options
  // to prevent circular references
  const validParentOptions = department ? 
    departments.filter(dept => 
      dept.id !== department.id && 
      !dept.path?.includes(department.id)
    ) : 
    departments;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {department ? 'Edit Department' : 'Create New Department'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Name</Label>
            <Input
              id="name"
              value={formData.name || ''}
              onChange={(e) => handleChange('name', e.target.value)}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">Description</Label>
            <Textarea
              id="description"
              value={formData.description || ''}
              onChange={(e) => handleChange('description', e.target.value)}
              className="col-span-3"
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="parent" className="text-right">Parent Department</Label>
            <Select
              value={formData.parent_id || ''}
              onValueChange={(value) => handleChange('parent_id', value || null)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="None (Top Level)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">None (Top Level)</SelectItem>
                {validParentOptions.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="manager" className="text-right">Manager</Label>
            <Select
              value={formData.manager_id || ''}
              onValueChange={(value) => handleChange('manager_id', value || null)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a manager" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">No manager assigned</SelectItem>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.first_name} {user.last_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Saving...' : department ? 'Update' : 'Create'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DepartmentFormDialog;
