
-- Function to execute SQL
CREATE OR REPLACE FUNCTION public.exec_sql(sql text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  EXECUTE sql;
END;
$$;

-- Function to get all tables with row counts
CREATE OR REPLACE FUNCTION public.get_all_tables()
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
    CASE WHEN c.reltuples < 0 THEN 0 ELSE c.reltuples::bigint END AS row_count
  FROM pg_catalog.pg_class c
  LEFT JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace
  WHERE c.relkind = 'r'
  AND n.nspname NOT IN ('pg_catalog', 'information_schema')
  ORDER BY n.nspname, c.relname;
END;
$$;

-- Function to create the get_all_tables function (helper for the client code)
CREATE OR REPLACE FUNCTION public.create_table_audit_function()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Function already created, just return
  RETURN;
END;
$$;

-- Function to get table references
CREATE OR REPLACE FUNCTION public.get_table_references()
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

-- Function to create the RPC functions (helper for the client code)
CREATE OR REPLACE FUNCTION public.create_exec_sql_function(sql_function text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  EXECUTE sql_function;
END;
$$;
