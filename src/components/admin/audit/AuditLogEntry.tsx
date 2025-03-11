
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ActivityLog } from '@/types/admin';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { format } from 'date-fns';

interface AuditLogEntryProps {
  log: ActivityLog;
}

export function AuditLogEntry({ log }: AuditLogEntryProps) {
  const getSeverityIcon = (severity: string | null) => {
    switch(severity) {
      case 'high':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'medium':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'low':
        return <Info className="h-4 w-4 text-blue-500" />;
      default:
        return <Info className="h-4 w-4 text-gray-400" />;
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy HH:mm');
  };
  
  // Safe function to convert any value to string
  const safeToString = (value: any): string => {
    if (value === null || value === undefined) return 'N/A';
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="mt-1">{getSeverityIcon(log.severity)}</div>
          <div className="flex-grow">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
              <div>
                <div className="font-medium">
                  {log.user ? `${log.user.first_name} ${log.user.last_name}` : 'Sistema'}{' '}
                  <span className="font-normal text-muted-foreground">
                    {log.action} {log.entity_type}
                    {log.entity_id ? ` (ID: ${log.entity_id})` : ''}
                  </span>
                </div>
                {log.details && (
                  <div className="text-sm mt-1">
                    {typeof log.details === 'object' 
                      ? Object.entries(log.details as Record<string, any>).map(([key, value]) => (
                          <span key={key} className="mr-3">
                            <span className="font-medium">{key}:</span> {safeToString(value)}
                          </span>
                        ))
                      : safeToString(log.details)
                    }
                  </div>
                )}
              </div>
              <div className="text-sm text-muted-foreground whitespace-nowrap">
                {formatDate(log.created_at)}
              </div>
            </div>
            <div className="flex mt-2">
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2">
                {log.category || 'system'}
              </span>
              <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                IP: {log.ip_address || 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
