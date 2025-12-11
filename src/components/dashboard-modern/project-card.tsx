import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Calendar, Trash2, Loader2, ExternalLink } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';

// Utility function to truncate text gracefully
const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;

  // Find the last space before the maxLength to avoid cutting words
  const truncated = text.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');

  if (lastSpace > maxLength * 0.7) {
    return truncated.substring(0, lastSpace) + '...';
  }

  return truncated + '...';
};

interface ProjectCardProps {
  project: {
    id: string;
    name: string;
    url: string;
    objective: string;
    status: string;
    createdAt: string;
    userId: string;
  };
  onDelete?: (projectId: string) => void;
  deletingId?: string | null;
}

export function ProjectCard({
  project,
  onDelete,
  deletingId
}: ProjectCardProps) {
  // Truncate long project names and objectives for better display
  const truncatedName = truncateText(project.name, 50);
  const truncatedObjective = truncateText(project.objective, 150);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-900';
      case 'running':
        return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900';
      case 'failed':
        return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <div className='bg-card border-border hover:border-input group grid w-full max-w-[400px] min-w-[280px] grid-rows-[auto_auto_auto_auto] gap-4 rounded-2xl border p-4 transition-all duration-300 hover:shadow-lg sm:p-6'>
      {/* Header */}
      <div className='flex items-start justify-between gap-3'>
        <div className='min-w-0 flex-1'>
          <h3
            className='text-card-foreground group-hover:text-foreground mb-2 line-clamp-2 text-lg leading-tight font-bold tracking-tight transition-colors sm:text-xl'
            title={project.name}
          >
            {truncatedName}
          </h3>
          <p
            className='text-muted-foreground line-clamp-3 text-sm leading-relaxed break-words'
            title={project.objective}
          >
            {truncatedObjective}
          </p>
        </div>
        <div
          className={`flex-shrink-0 rounded-full border px-2.5 py-1 text-xs font-medium whitespace-nowrap ${getStatusColor(project.status)}`}
        >
          {project.status}
        </div>
      </div>

      {/* Meta Info */}
      <div className='text-muted-foreground flex items-center gap-4 text-sm'>
        <div className='flex items-center gap-2'>
          <Calendar className='h-4 w-4' />
          <span>{new Date(project.createdAt).toLocaleDateString()}</span>
        </div>
        <div className='flex items-center gap-2'>
          <ExternalLink className='h-4 w-4' />
          <a
            href={project.url}
            target='_blank'
            rel='noopener noreferrer'
            className='hover:text-foreground truncate underline decoration-1 underline-offset-2 transition-colors'
            title={project.url}
          >
            {project.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}
          </a>
        </div>
      </div>

      {/* Progress */}
      <div>
        <div className='mb-2 flex items-center justify-between text-sm'>
          <span className='text-muted-foreground font-medium'>Progress</span>
          <span className='text-muted-foreground'>0%</span>
        </div>
        <div className='bg-muted h-2 overflow-hidden rounded-full'>
          <div
            className='bg-primary h-full rounded-full transition-all duration-500'
            style={{ width: '0%' }}
          />
        </div>
      </div>

      {/* Actions */}
      <div className='border-border/50 flex w-full items-center justify-between gap-2 border-t pt-2 sm:gap-3'>
        <Link
          href={`/dashboard/projects/${project.id}`}
          className='min-w-0 flex-1'
        >
          <Button
            variant='outline'
            size='sm'
            className='bg-muted hover:bg-muted/80 text-foreground w-full text-xs sm:text-sm'
            title='View project details'
          >
            <span className='truncate'>View Details</span>
          </Button>
        </Link>

        {/* Delete Button */}
        {onDelete && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant='ghost'
                size='sm'
                className='text-muted-foreground hover:text-destructive hover:bg-destructive/10 flex-shrink-0 p-2 transition-all duration-200'
                disabled={deletingId === project.id}
                title='Delete project'
              >
                {deletingId === project.id ? (
                  <Loader2 className='h-4 w-4 animate-spin' />
                ) : (
                  <Trash2 className='h-4 w-4' />
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Project</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete &quot;{project.name}&quot;?
                  This action cannot be undone and will permanently remove the
                  project and all its data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDelete(project.id)}
                  className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
                >
                  Delete Project
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </div>
  );
}
