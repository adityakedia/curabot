import React from 'react';

interface StatusBadgeProps {
  status:
    | 'pending'
    | 'running'
    | 'completed'
    | 'failed'
    | 'active'
    | 'inactive'
    | string;
  children: React.ReactNode;
}

export function StatusBadge({ status, children }: StatusBadgeProps) {
  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'completed':
      case 'active':
        return 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-900';
      case 'running':
        return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900';
      case 'pending':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950/30 dark:text-yellow-400 dark:border-yellow-900';
      case 'failed':
      case 'inactive':
        return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium ${getStatusStyles(status)}`}
    >
      {children}
    </span>
  );
}
