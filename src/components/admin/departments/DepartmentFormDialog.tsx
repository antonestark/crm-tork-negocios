
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Department, User } from '@/types/admin';

export interface DepartmentFormDialogProps {
  open: boolean;  // Changed from isOpen to open
  onOpenChange: (open: boolean) => void;
  onSave: (formData: Department) => Promise<void> | void;
  department?: Department | null;
  departments?: Department[];
  users?: User[];
  isEditing?: boolean;
}

const DepartmentFormDialog: React.FC<DepartmentFormDialogProps> = ({
  open,  // Changed from isOpen to open
  onOpenChange,
  onSave,
  department,
  departments = [], 
  users = [],
  isEditing = false
}) => {
  const [formData, setFormData] = useState<Partial<Department>>({
    name: department?.name || '',
    description: department?.description || '',
    parent_id: department?.parent_id || null,
    manager_id: department?.manager_id || null,
    // Add other fields as needed
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Casting formData to Department as required by onSave
      await onSave(formData as Department);
      onOpenChange(false);
    } catch (error) {
      console.error('Error submitting department form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Department' : 'Create Department'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
              rows={3}
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DepartmentFormDialog;
