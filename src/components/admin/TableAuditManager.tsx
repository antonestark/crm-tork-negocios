
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Database, FilterX, AlertCircle, CheckCircle, HelpCircle, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { TableInfo, getAllDatabaseTables, checkTableReferences, scanCodeForTableUsage, deleteTable } from '@/utils/supabase-table-audit';

export function TableAuditManager() {
  const [tables, setTables] = useState<TableInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ table: string, confirm: string } | null>(null);

  useEffect(() => {
    loadTables();
  }, []);

  const loadTables = async () => {
    try {
      setLoading(true);
      // First, fetch all tables
      let tableData = await getAllDatabaseTables();
      
      // Then check for references between tables
      tableData = await checkTableReferences(tableData);
      
      // Finally, scan code for usage patterns
      tableData = await scanCodeForTableUsage(tableData);
      
      setTables(tableData);
    } catch (err) {
      console.error('Error loading tables:', err);
      setError(err as Error);
      toast.error('Falha ao carregar informações das tabelas');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTable = async (tableName: string) => {
    try {
      const success = await deleteTable(tableName);
      if (success) {
        // Remove the table from the list
        setTables(prev => prev.filter(t => t.name !== tableName));
        toast.success(`Solicitação para remover a tabela ${tableName} foi enviada`);
      }
      // Clear the confirmation
      setDeleteConfirmation(null);
    } catch (err) {
      console.error('Error deleting table:', err);
      toast.error(`Erro ao remover tabela ${tableName}`);
    }
  };

  const getRiskBadge = (riskLevel: 'high' | 'medium' | 'low' | 'safe') => {
    switch (riskLevel) {
      case 'high':
        return <Badge variant="destructive" className="bg-red-500">Alto Risco</Badge>;
      case 'medium':
        return <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">Médio Risco</Badge>;
      case 'low':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">Baixo Risco</Badge>;
      case 'safe':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Seguro</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  const getRiskIcon = (riskLevel: 'high' | 'medium' | 'low' | 'safe') => {
    switch (riskLevel) {
      case 'high':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'medium':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'low':
        return <HelpCircle className="h-5 w-5 text-blue-500" />;
      case 'safe':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <HelpCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  // Filter tables based on risk level and search term
  const filteredTables = tables.filter(table => {
    const matchesRisk = filter === 'all' || table.riskLevel === filter;
    const matchesSearch = searchTerm === '' || 
      table.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      table.schema.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRisk && matchesSearch;
  });

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-800">Erro ao analisar tabelas</CardTitle>
          <CardDescription className="text-red-600">
            Ocorreu um erro ao tentar analisar as tabelas do banco de dados.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-red-700">{error.message}</p>
          <Button 
            variant="outline" 
            className="mt-4 border-red-300 text-red-700 hover:bg-red-100"
            onClick={() => loadTables()}
          >
            Tentar novamente
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Auditoria de Tabelas</h2>
          <p className="text-muted-foreground">
            Verifique e gerencie tabelas potencialmente não utilizadas no banco de dados.
          </p>
        </div>
        <Button onClick={() => loadTables()} disabled={loading}>
          {loading ? 'Analisando...' : 'Analisar Tabelas'}
        </Button>
      </div>

      <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
        <div className="relative w-full md:w-64">
          <Input
            placeholder="Buscar tabelas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-full md:w-40">
            <SelectValue placeholder="Filtrar por risco" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="high">Alto Risco</SelectItem>
            <SelectItem value="medium">Médio Risco</SelectItem>
            <SelectItem value="low">Baixo Risco</SelectItem>
            <SelectItem value="safe">Seguro</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="mr-2 h-5 w-5" />
            Tabelas do Banco de Dados
          </CardTitle>
          <CardDescription>
            Análise de tabelas baseada em uso e dependências.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tabela</TableHead>
                    <TableHead>Schema</TableHead>
                    <TableHead>Registros</TableHead>
                    <TableHead>Nível de Risco</TableHead>
                    <TableHead>Recomendação</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTables.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        Nenhuma tabela encontrada.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTables.map((table) => (
                      <TableRow key={`${table.schema}.${table.name}`}>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            {getRiskIcon(table.riskLevel)}
                            <span className="ml-2">{table.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{table.schema}</TableCell>
                        <TableCell>
                          {table.rowCount === -1 ? (
                            <span className="text-muted-foreground">N/A</span>
                          ) : (
                            table.rowCount
                          )}
                        </TableCell>
                        <TableCell>{getRiskBadge(table.riskLevel)}</TableCell>
                        <TableCell className="max-w-xs">
                          <div className="truncate" title={table.recommendation}>
                            {table.recommendation}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          {deleteConfirmation?.table === table.name ? (
                            <div className="flex items-center justify-end space-x-2">
                              <Input
                                placeholder={`Digite "${table.name}" para confirmar`}
                                value={deleteConfirmation.confirm}
                                onChange={(e) => setDeleteConfirmation({
                                  ...deleteConfirmation,
                                  confirm: e.target.value
                                })}
                                className="w-48 text-xs"
                              />
                              <Button
                                variant="destructive"
                                size="sm"
                                disabled={deleteConfirmation.confirm !== table.name}
                                onClick={() => handleDeleteTable(table.name)}
                              >
                                Confirmar
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setDeleteConfirmation(null)}
                              >
                                Cancelar
                              </Button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-end space-x-2">
                              {table.riskLevel !== 'safe' && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-red-500 border-red-200 hover:bg-red-50"
                                  onClick={() => setDeleteConfirmation({
                                    table: table.name,
                                    confirm: ''
                                  })}
                                >
                                  Remover
                                </Button>
                              )}
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            Total: {filteredTables.length} tabelas encontradas.
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
