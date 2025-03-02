
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://nnpvzhalxogrmgdckdmv.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ucHZ6aGFseG9ncm1nZGNrZG12Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAwNzIyMDIsImV4cCI6MjA1NTY0ODIwMn0.eQyjlx6w8bEgJsey92HSDmTZrrIaShzsMLSANsmTzns";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

// Helper function to handle the additional fields from activity_logs
export const activityLogsAdapter = (data: any[]) => {
  return data.map(log => ({
    ...log,
    severity: log.severity || null,
    category: log.category || null,
    metadata: log.metadata || null
  }));
};

// Helper function to adapt user data from database to match the User interface
export const userAdapter = (data: any[]) => {
  return data.map(user => ({
    ...user,
    status: user.status || 'active',
    last_login: user.last_login || null,
    settings: user.settings || {},
    metadata: user.metadata || {}
  }));
};

// Helper function to adapt department data
export const departmentAdapter = (data: any[]) => {
  return data.map(dept => ({
    ...dept,
    path: dept.path || null,
    level: dept.level || 0,
    parent_id: dept.parent_id || null,
    manager_id: dept.manager_id || null,
    settings: dept.settings || {},
    metadata: dept.metadata || {},
    manager: Array.isArray(dept.manager) && dept.manager.length > 0 
      ? dept.manager[0] 
      : { first_name: '', last_name: '' }
  }));
};
