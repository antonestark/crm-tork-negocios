
import React from 'react';
import { AuditLogEntry } from './AuditLogEntry';
import { ActivityLog } from '@/types/admin';

interface AuditLogsListProps {
  logs: ActivityLog[];
  loading: boolean;
}

export function AuditLogsList({ logs, loading }: AuditLogsListProps) {
  if (loading) {
    return <p>Carregando logs de atividade...</p>;
  }

  if (logs.length === 0) {
    return (
      <p className="text-center py-8 text-muted-foreground">
        Nenhum log de atividade encontrado com os filtros aplicados.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {logs.map((log) => (
        <AuditLogEntry key={log.id} log={log} />
      ))}
    </div>
  );
}
