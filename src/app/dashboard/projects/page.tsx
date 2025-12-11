'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import {
  IconTrendingUp,
  IconTarget,
  IconClock,
  IconCheckbox
} from '@tabler/icons-react';
import Link from 'next/link';
import { PageContainer } from '@/components/dashboard-modern/page-container';
import { PageHeader } from '@/components/dashboard-modern/page-header';
import { MetricCard } from '@/components/dashboard-modern/metric-card';
import { ProjectCard } from '@/components/dashboard-modern/project-card';
// ...removed unused lucide icons (Calendar, Users, Settings)
import { Project } from '@/lib/storage';
// AlertDialog components not used in this file; removed to avoid unused-import warnings

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/projects');

      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }

      const data = await response.json();
      setProjects(data.projects);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (projectId: string) => {
    try {
      setDeletingId(projectId);
      const response = await fetch('/api/projects', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ projectId })
      });

      if (!response.ok) {
        throw new Error('Failed to delete project');
      }

      // Remove the project from the local state
      setProjects(projects.filter((project) => project.id !== projectId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete project');
    } finally {
      setDeletingId(null);
    }
  };

  // Calculate metrics for the cards
  const totalProjects = projects.length;
  const activeProjects = projects.filter((p) => p.status === 'running').length;
  const completedProjects = projects.filter(
    (p) => p.status === 'completed'
  ).length;
  const successRate =
    totalProjects > 0
      ? Math.round((completedProjects / totalProjects) * 100)
      : 0;

  if (loading) {
    return (
      <PageContainer>
        <div className='flex min-h-[60vh] items-center justify-center'>
          <div className='text-center'>
            <Loader2 className='text-muted-foreground mx-auto mb-4 h-8 w-8 animate-spin' />
            <p className='text-muted-foreground'>Loading your projects...</p>
          </div>
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <div className='flex min-h-[60vh] items-center justify-center'>
          <div className='text-center'>
            <div className='bg-muted mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl'>
              <div className='bg-muted h-8 w-8 rounded-full'></div>
            </div>
            <h2 className='text-foreground mb-2 text-xl font-bold'>
              Something went wrong
            </h2>
            <p className='text-muted-foreground'>{error}</p>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className='space-y-8'>
        {/* Welcome Section */}
        <div className='space-y-2'>
          <h1 className='text-foreground text-3xl font-black tracking-tight md:text-4xl'>
            Hi, Welcome back 👋
          </h1>
          <p className='text-muted-foreground text-lg'>
            Here is what is happening with your projects today
          </p>
        </div>

        {/* Metrics Cards */}
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
          <MetricCard
            title='Total Projects'
            value={totalProjects}
            description='All automation projects'
            trend={{
              value: `+${totalProjects > 0 ? '100' : '0'}%`,
              isPositive: true
            }}
            icon={IconTarget}
          />
          <MetricCard
            title='Active Projects'
            value={activeProjects}
            description='Currently running'
            trend={{
              value: `+${activeProjects > 0 ? Math.round((activeProjects / totalProjects) * 100) : 0}%`,
              isPositive: true
            }}
            icon={IconClock}
          />
          <MetricCard
            title='Completed'
            value={completedProjects}
            description='Successfully finished'
            trend={{
              value: `+${completedProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0}%`,
              isPositive: true
            }}
            icon={IconCheckbox}
          />
          <MetricCard
            title='Success Rate'
            value={`${successRate}%`}
            description='Project completion rate'
            trend={{
              value: `+${successRate}%`,
              isPositive: true
            }}
            icon={IconTrendingUp}
          />
        </div>

        {/* Projects Section */}
        <PageHeader
          title='Projects'
          description='Manage your visual reference projects and collaborate with your team'
        >
          <Link href='/dashboard/projects/new'>
            <Button className='bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2 rounded-xl font-semibold shadow-lg transition-all duration-300 hover:shadow-xl'>
              <Plus className='h-5 w-5' />
              Create Project
            </Button>
          </Link>
        </PageHeader>

        {/* Projects Grid */}
        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onDelete={deleteProject}
              deletingId={deletingId}
            />
          ))}
        </div>

        {/* Empty State */}
        {projects.length === 0 && (
          <div className='flex flex-col items-center justify-center py-16'>
            <div className='bg-muted mb-6 flex h-20 w-20 items-center justify-center rounded-2xl'>
              <Plus className='text-muted-foreground h-10 w-10' />
            </div>
            <h3 className='text-foreground mb-2 text-xl font-bold'>
              No projects yet
            </h3>
            <p className='text-muted-foreground mb-6 max-w-md text-center'>
              Get started by creating your first visual reference project and
              begin organizing your inspiration
            </p>
            <Link href='/dashboard/projects/new'>
              <Button className='bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2 rounded-xl font-semibold shadow-lg transition-all duration-300 hover:shadow-xl'>
                <Plus className='h-5 w-5' />
                Create Project
              </Button>
            </Link>
          </div>
        )}
      </div>
    </PageContainer>
  );
}
