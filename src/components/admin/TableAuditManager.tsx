
import React, { useState, useEffect } from 'react';
import { 
  getAllDatabaseTables, 
  checkTableReferences, 
  scanCodeForTableUsage,
  deleteTable,
  setupDatabaseFunctions,
  type TableInfo
} from '@/utils/supabase-table-audit';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2, Trash2, RefreshCw, AlertTriangle, Check, Filter, Info } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export function TableAuditManager() {
  const [tables, setTables] = useState<TableInfo[]>([]);
  const [filteredTables, setFilteredTables] = useState<TableInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState<string | null>(null);
  const [deletingTable, setDeletingTable] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  
  // Load tables on component mount
  useEffect(() => {
    loadTables();
  }, []);
  
  // Filter tables when search term or risk filter changes
  useEffect(() => {
    filterTables();
  }, [tables, searchTerm, riskFilter]);
  
  const loadTables = async () => {
    setLoading(true);
    try {
      // Setup required database functions
      await setupDatabaseFunctions();
      
      // Get all tables
      let tablesData = await getAllDatabaseTables();
      
      // Check table references
      tablesData = await checkTableReferences(tablesData);
      
      // Scan code for table usage (mock implementation)
      tablesData = await scanCodeForTableUsage(tablesData);
      
      setTables(tablesData);
    } catch (error) {
      console.error('Error loading tables:', error);
      toast.error('Erro ao carregar tabelas do banco de dados');
    } finally {
      setLoading(false);
    }
  };
  
  const filterTables = () => {
    let filtered = [...tables];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(table => 
        table.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply risk filter
    if (riskFilter) {
      filtered = filtered.filter(table => table.riskLevel === riskFilter);
    }
    
    setFilteredTables(filtered);
  };
  
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadTables();
    setRefreshing(false);
  };
  
  const handleDeleteConfirm = async () => {
    if (!deletingTable) return;
    
    const success = await deleteTable(deletingTable);
    if (success) {
      // Refresh the table list
      await loadTables();
    }
    
    setDeletingTable(null);
  };
  
  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'high':
        return <Badge variant="destructive">Alto Risco</Badge>;
      case 'medium':
        return <Badge variant="default" className="bg-orange-500">Médio Risco</Badge>;
      case 'low':
        return <Badge variant="default" className="bg-yellow-500">Baixo Risco</Badge>;
      case 'safe':
        return <Badge variant="default" className="bg-green-500">Seguro</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-2 text-lg">Carregando tabelas...</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Auditoria de Tabelas</h2>
        <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
          {refreshing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
          Atualizar
        </Button>
      </div>
      
      <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Buscar tabelas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
          <Filter className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        </div>
        
        <div className="flex space-x-2">
          <Button 
            variant={riskFilter === 'high' ? "destructive" : "outline"} 
            size="sm"
            onClick={() => setRiskFilter(riskFilter === 'high' ? null : 'high')}
          >
            <AlertTriangle className="mr-1 h-4 w-4" />
            Alto Risco
          </Button>
          <Button 
            variant={riskFilter === 'medium' ? "default" : "outline"} 
            className={riskFilter === 'medium' ? "bg-orange-500" : ""}
            size="sm"
            onClick={() => setRiskFilter(riskFilter === 'medium' ? null : 'medium')}
          >
            <AlertTriangle className="mr-1 h-4 w-4" />
            Médio Risco
          </Button>
          <Button 
            variant={riskFilter === 'low' ? "default" : "outline"} 
            className={riskFilter === 'low' ? "bg-yellow-500" : ""}
            size="sm"
            onClick={() => setRiskFilter(riskFilter === 'low' ? null : 'low')}
          >
            <Info className="mr-1 h-4 w-4" />
            Baixo Risco
          </Button>
          <Button 
            variant={riskFilter === 'safe' ? "default" : "outline"} 
            className={riskFilter === 'safe' ? "bg-green-500" : ""}
            size="sm"
            onClick={() => setRiskFilter(riskFilter === 'safe' ? null : 'safe')}
          >
            <Check className="mr-1 h-4 w-4" />
            Seguro
          </Button>
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableCaption>Lista de tabelas no banco de dados</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Nome da Tabela</TableHead>
              <TableHead>Esquema</TableHead>
              <TableHead>Registros</TableHead>
              <TableHead>Referenciada</TableHead>
              <TableHead>Risco</TableHead>
              <TableHead>Recomendação</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTables.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  Nenhuma tabela encontrada
                </TableCell>
              </TableRow>
            ) : (
              filteredTables.map((table) => (
                <TableRow key={`${table.schema}.${table.name}`}>
                  <TableCell className="font-medium">{table.name}</TableCell>
                  <TableCell>{table.schema}</TableCell>
                  <TableCell>{table.rowCount}</TableCell>
                  <TableCell>
                    {table.isReferenced ? (
                      <Badge variant="outline" className="bg-blue-100">Sim</Badge>
                    ) : (
                      <Badge variant="outline">Não</Badge>
                    )}
                  </TableCell>
                  <TableCell>{getRiskBadge(table.riskLevel)}</TableCell>
                  <TableCell className="max-w-[250px] truncate" title={table.recommendation}>
                    {table.recommendation}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setDeletingTable(table.name)}
                      disabled={table.riskLevel === 'safe'}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      <AlertDialog open={!!deletingTable} onOpenChange={(open) => !open && setDeletingTable(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Você tem certeza que deseja excluir a tabela <strong>{deletingTable}</strong>?
              <br /><br />
              <span className="text-destructive font-semibold">
                Esta ação não pode ser desfeita e pode causar perda de dados.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
