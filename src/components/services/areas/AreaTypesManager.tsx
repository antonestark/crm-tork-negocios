
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Save, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export interface AreaType {
  id: string;
  name: string;
  code: string;
}

export const AreaTypesManager = () => {
  const [areaTypes, setAreaTypes] = useState<AreaType[]>([]);
  const [loading, setLoading] = useState(true);
  const [newType, setNewType] = useState({ name: '', code: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchAreaTypes();
  }, []);

  const fetchAreaTypes = async () => {
    try {
      setLoading(true);
      // Use a type assertion - this is why we're getting the error
      const { data, error } = await supabase
        .from('area_types' as any)
        .select('id, name, code')
        .order('name');

      if (error) throw error;
      
      // Add type assertion to ensure TypeScript knows the data structure
      setAreaTypes((data || []) as AreaType[]);
    } catch (error) {
      console.error('Error fetching area types:', error);
      toast.error('Erro ao carregar tipos de áreas');
    } finally {
      setLoading(false);
    }
  };

  const handleAddType = async () => {
    if (!newType.name.trim() || !newType.code.trim()) {
      toast.error('Nome e código são obrigatórios');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const { data, error } = await supabase
        .from('area_types' as any)
        .insert([{ name: newType.name, code: newType.code }])
        .select();

      if (error) throw error;
      
      toast.success('Tipo de área adicionado com sucesso');
      setNewType({ name: '', code: '' });
      fetchAreaTypes();
    } catch (error) {
      console.error('Error adding area type:', error);
      toast.error('Erro ao adicionar tipo de área');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateType = async (id: string, data: Partial<AreaType>) => {
    try {
      setIsSubmitting(true);
      
      const { error } = await supabase
        .from('area_types' as any)
        .update(data)
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Tipo de área atualizado com sucesso');
      setEditingId(null);
      fetchAreaTypes();
    } catch (error) {
      console.error('Error updating area type:', error);
      toast.error('Erro ao atualizar tipo de área');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteType = async (id: string) => {
    try {
      setIsSubmitting(true);
      
      // First check if the area type is in use
      const { count, error: countError } = await supabase
        .from('service_areas')
        .select('id', { count: 'exact', head: true })
        .eq('type', id);

      if (countError) throw countError;
      
      if (count && count > 0) {
        toast.error('Este tipo está sendo usado em áreas existentes e não pode ser excluído');
        return;
      }
      
      const { error } = await supabase
        .from('area_types' as any)
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Tipo de área excluído com sucesso');
      fetchAreaTypes();
    } catch (error) {
      console.error('Error deleting area type:', error);
      toast.error('Erro ao excluir tipo de área');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gerenciar Tipos de Áreas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex gap-2">
          <Input 
            placeholder="Nome do tipo" 
            value={newType.name} 
            onChange={(e) => setNewType(prev => ({ ...prev, name: e.target.value }))}
            disabled={isSubmitting}
          />
          <Input 
            placeholder="Código (slug)" 
            value={newType.code} 
            onChange={(e) => setNewType(prev => ({ ...prev, code: e.target.value.toLowerCase().replace(/\s+/g, '_') }))}
            disabled={isSubmitting}
          />
          <Button onClick={handleAddType} disabled={isSubmitting}>
            <Plus className="h-4 w-4 mr-2" />
            Adicionar
          </Button>
        </div>

        {loading ? (
          <div className="py-4 text-center text-muted-foreground">Carregando tipos de áreas...</div>
        ) : areaTypes.length === 0 ? (
          <div className="py-4 text-center text-muted-foreground">Nenhum tipo de área cadastrado</div>
        ) : (
          <div className="space-y-2">
            {areaTypes.map((type) => (
              <div key={type.id} className="flex items-center gap-2 p-2 border rounded">
                {editingId === type.id ? (
                  <>
                    <Input 
                      value={type.name}
                      onChange={(e) => setAreaTypes(prev => 
                        prev.map(t => t.id === type.id ? { ...t, name: e.target.value } : t)
                      )}
                      className="flex-1"
                    />
                    <Input 
                      value={type.code}
                      onChange={(e) => setAreaTypes(prev => 
                        prev.map(t => t.id === type.id ? { ...t, code: e.target.value.toLowerCase().replace(/\s+/g, '_') } : t)
                      )}
                      className="flex-1"
                    />
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => handleUpdateType(type.id, { 
                        name: type.name,
                        code: type.code
                      })}
                      disabled={isSubmitting}
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => setEditingId(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <>
                    <span className="flex-1">{type.name}</span>
                    <span className="text-sm text-muted-foreground">{type.code}</span>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => setEditingId(type.id)}
                      disabled={isSubmitting}
                    >
                      Editar
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive" 
                      onClick={() => handleDeleteType(type.id)}
                      disabled={isSubmitting}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
