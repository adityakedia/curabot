import React from 'react';

interface InfoCardProps {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export function InfoCard({
  title,
  children,
  icon,
  className = ''
}: InfoCardProps) {
  return (
    <div
      className={`bg-card border-border hover:border-input rounded-2xl border transition-all duration-300 hover:shadow-lg ${className}`}
    >
      <div className='p-6'>
        <div className='mb-4 flex items-center gap-3'>
          {icon && <div className='bg-muted rounded-xl p-2'>{icon}</div>}
          <h3 className='text-card-foreground text-xl font-bold tracking-tight'>
            {title}
          </h3>
        </div>
        <div className='space-y-4'>{children}</div>
      </div>
    </div>
  );
}
