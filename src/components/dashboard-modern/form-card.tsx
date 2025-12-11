import React from 'react';

interface FormCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormCard({
  title,
  description,
  children,
  className = ''
}: FormCardProps) {
  return (
    <div
      className={`bg-card border-border rounded-2xl border shadow-sm transition-all duration-300 hover:shadow-lg ${className}`}
    >
      <div className='p-8'>
        <div className='mb-6'>
          <h2 className='text-card-foreground mb-2 text-xl font-bold tracking-tight md:text-2xl'>
            {title}
          </h2>
          {description && (
            <p className='text-muted-foreground leading-relaxed'>
              {description}
            </p>
          )}
        </div>
        {children}
      </div>
    </div>
  );
}
