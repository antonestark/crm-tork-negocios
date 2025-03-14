
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Permission } from '@/types/admin';
import { Loader2 } from 'lucide-react';

interface NewPermissionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (permission: Partial<Permission>) => Promise<void>;
  permission: Permission | null;
}

export function NewPermissionDialog({
  open,
  onOpenChange,
  onSave,
  permission
}: NewPermissionDialogProps) {
  const [formData, setFormData] = useState<Partial<Permission>>({
    name: '',
    description: '',
    module: 'admin',
    code: '',
    resource_type: '',
    actions: []
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionInput, setActionInput] = useState('');

  // Update form data when permission changes
  useEffect(() => {
    if (permission) {
      setFormData({
        name: permission.name,
        description: permission.description,
        module: permission.module,
        code: permission.code,
        resource_type: permission.resource_type,
        actions: permission.actions
      });
    } else {
      // Reset form when creating new permission
      setFormData({
        name: '',
        description: '',
        module: 'admin',
        code: '',
        resource_type: '',
        actions: []
      });
    }
  }, [permission]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddAction = () => {
    if (actionInput.trim() && !formData.actions?.includes(actionInput.trim())) {
      setFormData(prev => ({ ...prev, actions: [...(prev.actions || []), actionInput.trim()] }));
      setActionInput('');
    }
  };

  const handleRemoveAction = (action: string) => {
    setFormData(prev => ({ 
      ...prev, 
      actions: prev.actions?.filter(a => a !== action) || [] 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.code || !formData.resource_type || !formData.actions?.length) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    
    try {
      setIsSubmitting(true);
      await onSave(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {permission ? 'Editar Permissão' : 'Nova Permissão'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome*</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="module">Módulo*</Label>
              <Input
                id="module"
                name="module"
                value={formData.module}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="code">Código*</Label>
            <Input
              id="code"
              name="code"
              value={formData.code}
              onChange={handleInputChange}
              placeholder="admin:resource:action"
              required
              disabled={!!permission} // Can't change code for existing permissions
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="resource_type">Tipo de Recurso*</Label>
            <Input
              id="resource_type"
              name="resource_type"
              value={formData.resource_type}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description || ''}
              onChange={handleInputChange}
              rows={2}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Ações*</Label>
            <div className="flex space-x-2">
              <Input
                value={actionInput}
                onChange={(e) => setActionInput(e.target.value)}
                placeholder="create, read, update, delete, etc."
              />
              <Button type="button" onClick={handleAddAction} variant="outline">
                Adicionar
              </Button>
            </div>
            
            {formData.actions && formData.actions.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.actions.map(action => (
                  <div key={action} className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full flex items-center">
                    <span>{action}</span>
                    <button
                      type="button"
                      className="ml-2 text-secondary-foreground/70 hover:text-secondary-foreground"
                      onClick={() => handleRemoveAction(action)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                'Salvar'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
