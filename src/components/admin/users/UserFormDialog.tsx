
import { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Department {
  id: string;
  name: string;
}

interface User {
  id: string;
  first_name: string;
  last_name: string;
  role: string;
  department_id: string | null;
  phone: string | null;
  profile_image_url: string | null;
  active: boolean;
}

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: User;
  onUserUpdated?: (user: User) => void;
}

export function UserFormDialog({ 
  open, 
  onOpenChange, 
  user,
  onUserUpdated
}: UserFormDialogProps) {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    first_name: '',
    last_name: '',
    role: 'user',
    department_id: '',
    phone: '',
    profile_image_url: '',
    active: true
  });

  useEffect(() => {
    // If user is provided, populate form with user data
    if (user) {
      setFormData({
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
        department_id: user.department_id || '',
        phone: user.phone || '',
        profile_image_url: user.profile_image_url || '',
        active: user.active
      });
    } else {
      // Reset form for new user
      setFormData({
        id: '',
        first_name: '',
        last_name: '',
        role: 'user',
        department_id: '',
        phone: '',
        profile_image_url: '',
        active: true
      });
    }
  }, [user, open]);

  useEffect(() => {
    async function fetchDepartments() {
      try {
        const { data, error } = await supabase
          .from('departments')
          .select('id, name')
          .order('name');
          
        if (error) throw error;
        setDepartments(data || []);
      } catch (error) {
        console.error('Error fetching departments:', error);
        toast({
          title: "Erro ao carregar departamentos",
          description: "Não foi possível carregar a lista de departamentos.",
          variant: "destructive"
        });
      }
    }

    if (open) {
      fetchDepartments();
    }
  }, [open]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    
    try {
      if (user) {
        // Update existing user
        const { data, error } = await supabase
          .from('users')
          .update({
            first_name: formData.first_name,
            last_name: formData.last_name,
            role: formData.role,
            department_id: formData.department_id || null,
            phone: formData.phone || null,
            profile_image_url: formData.profile_image_url || null,
            active: formData.active,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id)
          .select(`
            *,
            department:departments(name)
          `)
          .single();
          
        if (error) throw error;
        
        if (data && onUserUpdated) {
          onUserUpdated(data);
        }
        
        toast({
          title: "Usuário atualizado",
          description: "As informações do usuário foram atualizadas com sucesso."
        });
      } else {
        // Create new user with UUID
        const { data, error } = await supabase
          .from('users')
          .insert({
            id: crypto.randomUUID(),
            first_name: formData.first_name,
            last_name: formData.last_name,
            role: formData.role,
            department_id: formData.department_id || null,
            phone: formData.phone || null,
            profile_image_url: formData.profile_image_url || null,
            active: formData.active
          })
          .select(`
            *,
            department:departments(name)
          `)
          .single();
          
        if (error) throw error;
        
        toast({
          title: "Usuário criado",
          description: "O novo usuário foi criado com sucesso."
        });
        
        if (data && onUserUpdated) {
          onUserUpdated(data);
        }
      }
      
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving user:', error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar as informações do usuário.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const renderBasicInfoTab = () => (
    <TabsContent value="basic" className="space-y-4 py-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 space-y-2">
          <Label htmlFor="first_name">Nome</Label>
          <Input
            id="first_name"
            name="first_name"
            value={formData.first_name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="flex-1 space-y-2">
          <Label htmlFor="last_name">Sobrenome</Label>
          <Input
            id="last_name"
            name="last_name"
            value={formData.last_name}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 space-y-2">
          <Label htmlFor="role">Função</Label>
          <Select
            value={formData.role}
            onValueChange={(value) => handleSelectChange('role', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione a função" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Administrador</SelectItem>
              <SelectItem value="manager">Gerente</SelectItem>
              <SelectItem value="supervisor">Supervisor</SelectItem>
              <SelectItem value="user">Usuário</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1 space-y-2">
          <Label htmlFor="department_id">Departamento</Label>
          <Select
            value={formData.department_id}
            onValueChange={(value) => handleSelectChange('department_id', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o departamento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Nenhum</SelectItem>
              {departments.map((department) => (
                <SelectItem key={department.id} value={department.id}>
                  {department.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phone">Telefone</Label>
        <Input
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          placeholder="(00) 00000-0000"
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch
          checked={formData.active}
          onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
          id="active"
        />
        <Label htmlFor="active">Usuário ativo</Label>
      </div>
    </TabsContent>
  );

  const renderProfileTab = () => (
    <TabsContent value="profile" className="space-y-4 py-4">
      <div className="flex flex-col items-center gap-4">
        <Avatar className="h-24 w-24">
          <AvatarImage 
            src={formData.profile_image_url || undefined} 
            alt={`${formData.first_name} ${formData.last_name}`} 
          />
          <AvatarFallback className="text-2xl">{`${formData.first_name.charAt(0)}${formData.last_name.charAt(0)}`}</AvatarFallback>
        </Avatar>
        
        <div className="w-full space-y-2">
          <Label htmlFor="profile_image_url">URL da Imagem de Perfil</Label>
          <Input
            id="profile_image_url"
            name="profile_image_url"
            value={formData.profile_image_url}
            onChange={handleInputChange}
            placeholder="https://exemplo.com/imagem.jpg"
          />
          <p className="text-sm text-muted-foreground">
            Insira a URL de uma imagem para o perfil do usuário
          </p>
        </div>
      </div>
    </TabsContent>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {user ? 'Editar Usuário' : 'Novo Usuário'}
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basic">Informações Básicas</TabsTrigger>
            <TabsTrigger value="profile">Perfil</TabsTrigger>
          </TabsList>
          
          {renderBasicInfoTab()}
          {renderProfileTab()}
        </Tabs>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={loading || !formData.first_name || !formData.last_name}
          >
            {loading ? "Salvando..." : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
