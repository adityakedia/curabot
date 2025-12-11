import React from 'react';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  scrollable?: boolean; // Add this prop
}

export function PageContainer({
  children,
  className = '',
  scrollable = false // Default to false
}: PageContainerProps) {
  return (
    <div
      className={`bg-muted dark:bg-background min-h-screen ${scrollable ? 'overflow-auto' : ''} ${className}`}
    >
      <div className='mx-auto max-w-7xl px-6 py-8'>{children}</div>
    </div>
  );
}
