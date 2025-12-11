import React from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  children,
  className = ''
}: PageHeaderProps) {
  return (
    <div
      className={`mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between ${className}`}
    >
      <div>
        <h2 className='text-foreground mb-1 text-2xl font-bold'>{title}</h2>
        {description && <p className='text-muted-foreground'>{description}</p>}
      </div>
      {children && <div className='flex items-center gap-2'>{children}</div>}
    </div>
  );
}
