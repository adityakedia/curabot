import React from 'react';
import { IconProps } from '@tabler/icons-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  description: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  icon?: React.ComponentType<IconProps>;
}

export function MetricCard({
  title,
  value,
  description,
  trend,
  icon: Icon
}: MetricCardProps) {
  return (
    <div className='bg-card border-border hover:border-input rounded-2xl border p-6 transition-all duration-300 hover:shadow-lg'>
      <div className='mb-4 flex items-center justify-between'>
        <div className='bg-muted rounded-xl p-2'>
          {Icon && <Icon className='text-muted-foreground h-5 w-5' />}
        </div>
        {trend && (
          <div
            className={`rounded-full px-2 py-1 text-xs font-medium ${
              trend.isPositive
                ? 'bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400'
                : 'bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400'
            }`}
          >
            {trend.value}
          </div>
        )}
      </div>

      <div className='space-y-1'>
        <h3 className='text-muted-foreground text-sm font-medium'>{title}</h3>
        <p className='text-card-foreground text-2xl font-bold'>{value}</p>
        <p className='text-muted-foreground text-sm'>{description}</p>
      </div>
    </div>
  );
}
