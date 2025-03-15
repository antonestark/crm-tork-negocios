
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Types for table information
type TableInfo = {
  name: string;
  schema: string;
  references: string[];
  isReferenced: boolean;
  rowCount: number;
  lastAccessed?: Date | null;
  riskLevel: 'high' | 'medium' | 'low' | 'safe';
  recommendation: string;
};

// Known tables that should never be deleted
const PROTECTED_TABLES = [
  'users', 'clients', 'departments', 'department_permissions', 
  'permissions', 'permission_groups', 'user_permissions',
  'activity_logs', 'scheduling', 'service_areas'
];

// Tables that are part of core Supabase functionality
const SYSTEM_TABLES = [
  'schema_migrations', 'extensions', 'pg_stat_statements'
];

/**
 * Get a list of all tables in the database with their row counts
 */
export async function getAllDatabaseTables(): Promise<TableInfo[]> {
  try {
    // Get list of tables and their schemas
    const { data: tableList, error: tableError } = await supabase.rpc('get_all_tables');
    
    if (tableError) {
      console.error('Error fetching tables:', tableError);
      toast.error('Erro ao buscar tabelas do banco de dados');
      return [];
    }

    // If we don't have the get_all_tables function, we need to create it
    if (!tableList) {
      console.log('Creating get_all_tables function');
      await createTableAuditFunction();
      const { data: newTableList, error: newError } = await supabase.rpc('get_all_tables');
      
      if (newError || !newTableList) {
        console.error('Error after creating function:', newError);
        toast.error('Erro ao buscar tabelas após criação da função');
        return [];
      }
      
      return processTableData(newTableList);
    }
    
    return processTableData(tableList);
  } catch (error) {
    console.error('Unexpected error in getAllDatabaseTables:', error);
    toast.error('Erro inesperado ao analisar tabelas');
    return [];
  }
}

/**
 * Process the raw table data into TableInfo objects
 */
function processTableData(rawTables: any[]): TableInfo[] {
  return rawTables.map(table => {
    const isProtected = PROTECTED_TABLES.includes(table.table_name);
    const isSystem = SYSTEM_TABLES.includes(table.table_name) || 
                    table.table_schema !== 'public';
    
    // Determine risk level
    let riskLevel: 'high' | 'medium' | 'low' | 'safe' = 'safe';
    let recommendation = 'Manter';
    
    if (isSystem) {
      riskLevel = 'safe';
      recommendation = 'Tabela do sistema, não remover';
    } else if (isProtected) {
      riskLevel = 'safe';
      recommendation = 'Tabela principal do aplicativo, não remover';
    } else if (table.row_count === 0) {
      riskLevel = 'medium';
      recommendation = 'Tabela vazia, potencial candidata para remoção';
    } else if (table.row_count > 0 && table.row_count < 10) {
      riskLevel = 'low';
      recommendation = 'Poucos registros, verificar uso antes de remover';
    } else {
      riskLevel = 'low';
      recommendation = 'Tabela com dados, verificar uso antes de qualquer ação';
    }
    
    return {
      name: table.table_name,
      schema: table.table_schema,
      references: [],
      isReferenced: false,
      rowCount: table.row_count || 0,
      lastAccessed: null,
      riskLevel,
      recommendation
    };
  });
}

/**
 * Create the database function needed for table analysis if it doesn't exist
 */
async function createTableAuditFunction() {
  // SQL to create the function to get all tables with row counts
  const { error } = await supabase.rpc('create_table_audit_function');
  
  if (error) {
    console.error('Error creating table audit function:', error);
    // Try creating directly with SQL query
    const createFunctionSQL = `
      CREATE OR REPLACE FUNCTION get_all_tables()
      RETURNS TABLE (
        table_schema text,
        table_name text,
        row_count bigint
      )
      LANGUAGE plpgsql
      SECURITY DEFINER
      AS $$
      BEGIN
        RETURN QUERY
        SELECT
          n.nspname AS table_schema,
          c.relname AS table_name,
          pg_catalog.pg_table_size(c.oid) AS table_size,
          CASE WHEN c.reltuples < 0 THEN 0 ELSE c.reltuples::bigint END AS row_count
        FROM pg_catalog.pg_class c
        LEFT JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace
        WHERE c.relkind = 'r'
        AND n.nspname NOT IN ('pg_catalog', 'information_schema')
        ORDER BY n.nspname, c.relname;
      END;
      $$;

      CREATE OR REPLACE FUNCTION create_table_audit_function()
      RETURNS void
      LANGUAGE plpgsql
      SECURITY DEFINER
      AS $$
      BEGIN
        -- Function already created, just return
        RETURN;
      END;
      $$;
    `;
    
    const { error: sqlError } = await supabase.rpc('exec_sql', { 
      sql: createFunctionSQL 
    });
    
    if (sqlError) {
      console.error('Error creating function with SQL:', sqlError);
      throw new Error('Não foi possível criar as funções necessárias para auditoria');
    }
  }
}

/**
 * Check if a table is referenced by other tables
 */
export async function checkTableReferences(tables: TableInfo[]): Promise<TableInfo[]> {
  try {
    const { data: references, error } = await supabase.rpc('get_table_references');
    
    if (error) {
      console.error('Error checking table references:', error);
      await createTableReferencesFunction();
      const { data: newReferences, error: newError } = await supabase.rpc('get_table_references');
      
      if (newError || !newReferences) {
        console.error('Error after creating references function:', newError);
        return tables;
      }
      
      return processTableReferences(tables, newReferences);
    }
    
    return processTableReferences(tables, references || []);
  } catch (error) {
    console.error('Unexpected error in checkTableReferences:', error);
    return tables;
  }
}

/**
 * Create the function to get table references
 */
async function createTableReferencesFunction() {
  const createFunctionSQL = `
    CREATE OR REPLACE FUNCTION get_table_references()
    RETURNS TABLE (
      table_name text,
      referenced_by text,
      constraint_name text
    )
    LANGUAGE plpgsql
    SECURITY DEFINER
    AS $$
    BEGIN
      RETURN QUERY
      SELECT
        tc.table_name::text,
        ccu.table_name::text AS referenced_by,
        tc.constraint_name::text
      FROM information_schema.table_constraints AS tc
      JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      WHERE tc.constraint_type = 'FOREIGN KEY'
      AND tc.table_schema = 'public';
    END;
    $$;
  `;
  
  const { error } = await supabase.rpc('exec_sql', { 
    sql: createFunctionSQL 
  });
  
  if (error) {
    console.error('Error creating references function:', error);
    throw new Error('Não foi possível criar a função para verificar referências');
  }
}

/**
 * Process table references data
 */
function processTableReferences(tables: TableInfo[], references: any[]): TableInfo[] {
  const updatedTables = [...tables];
  
  // Map references to tables
  references.forEach(ref => {
    // Table that is being referenced
    const referencedTable = updatedTables.find(t => 
      t.name === ref.table_name && t.schema === 'public'
    );
    
    // Table that has the foreign key
    const referencingTable = updatedTables.find(t => 
      t.name === ref.referenced_by && t.schema === 'public'
    );
    
    if (referencedTable) {
      referencedTable.isReferenced = true;
      
      // Update recommendation for referenced tables
      if (referencedTable.riskLevel !== 'safe') {
        referencedTable.riskLevel = 'low';
        referencedTable.recommendation = 'Tabela referenciada por outras tabelas, cuidado ao remover';
      }
    }
    
    if (referencingTable) {
      // Add reference to the list of references
      if (!referencingTable.references.includes(ref.table_name)) {
        referencingTable.references.push(ref.table_name);
      }
    }
  });
  
  return updatedTables;
}

/**
 * Get the code usage of tables by scanning the codebase
 */
export async function scanCodeForTableUsage(tables: TableInfo[]): Promise<TableInfo[]> {
  // This is a mock implementation since we can't actually scan the codebase from the browser
  // In a real implementation, this would be a server-side function
  
  // For now, let's just mark tables with certain patterns as being used in code
  return tables.map(table => {
    // Common naming patterns that suggest the table is used in code
    const likelyUsedPatterns = [
      'users', 'clients', 'appointments', 'scheduling', 'service', 
      'permission', 'department', 'activity', 'leads', 'maintenance'
    ];
    
    const isLikelyUsed = likelyUsedPatterns.some(pattern => 
      table.name.toLowerCase().includes(pattern)
    );
    
    if (isLikelyUsed && table.riskLevel !== 'safe') {
      return {
        ...table,
        riskLevel: 'low',
        recommendation: 'Provável uso no código, verificar antes de remover'
      };
    }
    
    return table;
  });
}

/**
 * Delete a table from the database
 */
export async function deleteTable(tableName: string): Promise<boolean> {
  try {
    // Safety check - don't allow deleting protected tables
    if (PROTECTED_TABLES.includes(tableName)) {
      toast.error(`A tabela ${tableName} é protegida e não pode ser removida`);
      return false;
    }
    
    // Execute DROP TABLE query
    const dropTableSQL = `DROP TABLE IF EXISTS public."${tableName}" CASCADE;`;
    
    const { error } = await supabase.rpc('exec_sql', { 
      sql: dropTableSQL 
    });
    
    if (error) {
      console.error(`Error dropping table ${tableName}:`, error);
      toast.error(`Erro ao remover tabela ${tableName}: ${error.message}`);
      return false;
    }
    
    toast.success(`Tabela ${tableName} removida com sucesso`);
    return true;
  } catch (error) {
    console.error(`Unexpected error deleting table ${tableName}:`, error);
    toast.error(`Erro inesperado ao remover tabela ${tableName}`);
    return false;
  }
}

/**
 * Create the exec_sql function if it doesn't exist
 */
export async function setupDatabaseFunctions(): Promise<boolean> {
  try {
    // Create the exec_sql function that allows running arbitrary SQL
    const createExecSqlSQL = `
      CREATE OR REPLACE FUNCTION exec_sql(sql text)
      RETURNS void
      LANGUAGE plpgsql
      SECURITY DEFINER
      AS $$
      BEGIN
        EXECUTE sql;
      END;
      $$;
    `;
    
    // We can't check if the function exists directly, 
    // so we'll just try to create it and ignore errors
    const { error } = await supabase.from('_exec_sql_test').select('*');
    
    if (error) {
      // Create temporary RPC function to run our SQL
      const { error: createError } = await supabase.rpc('create_exec_sql_function', {
        sql_function: createExecSqlSQL
      });
      
      if (createError) {
        // Try a direct SQL approach as last resort
        console.warn('Could not create exec_sql function via RPC, trying direct SQL');
        // Note: In a real app, you'd need server-side code to run this SQL
        return false;
      }
      
      return true;
    }
    
    return true;
  } catch (error) {
    console.error('Error setting up database functions:', error);
    return false;
  }
}
