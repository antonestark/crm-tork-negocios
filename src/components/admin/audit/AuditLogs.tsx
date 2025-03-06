
import React from 'react';
import { AuditLogFilters } from './AuditLogFilters';
import { AuditLogsList } from './AuditLogsList';
import { useAuditLogs } from '@/hooks/use-audit-logs';

export function AuditLogs() {
  const {
    filteredLogs,
    loading,
    searchQuery,
    setSearchQuery,
    severityFilter,
    setSeverityFilter,
    categoryFilter,
    setCategoryFilter
  } = useAuditLogs();

  return (
    <div>
      <AuditLogFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        severityFilter={severityFilter}
        setSeverityFilter={setSeverityFilter}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
      />
      <AuditLogsList logs={filteredLogs} loading={loading} />
    </div>
  );
}
