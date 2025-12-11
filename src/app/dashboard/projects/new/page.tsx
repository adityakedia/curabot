'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import log from '@/lib/logger';
import { PageContainer } from '@/components/dashboard-modern/page-container';
import { PageHeader } from '@/components/dashboard-modern/page-header';
import { FormCard } from '@/components/dashboard-modern/form-card';
import Link from 'next/link';

const formSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  url: z.string().url('Please enter a valid URL'),
  objective: z.string().min(1, 'Objective is required')
});

export default function NewProjectPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      url: '',
      objective: ''
    }
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);

    try {
      const response = await fetch('/api/projects/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Project created successfully!');
        log.info('Created project', { projectId: data.project?.id });
        router.push(`/dashboard/projects/${data.project.id}`);
      } else {
        toast.error(data.error || 'Failed to create project');
      }
    } catch (error) {
      log.error('Error creating project:', error);
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/projects');
  };

  return (
    <PageContainer>
      <div className='space-y-8'>
        {/* Page Header */}
        <PageHeader
          title='Create New Project'
          description='Set up a new visual reference project to organize and capture your inspiration'
        >
          <Link href='/dashboard/projects'>
            <Button variant='outline' className='flex items-center gap-2'>
              <ArrowLeft className='h-4 w-4' />
              Back to Projects
            </Button>
          </Link>
        </PageHeader>

        {/* Form */}
        <div className='max-w-2xl'>
          <FormCard
            title='Project Details'
            description='Configure your visual reference project to start capturing and organizing content'
          >
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className='space-y-6'
              >
                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-sm font-medium'>
                        Project Name <span className='text-destructive'>*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder='e.g., Brand Identity Research, UI Design Inspiration'
                          disabled={loading}
                          className='rounded-xl transition-all duration-300 focus:ring-0'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='url'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-sm font-medium'>
                        Starting URL <span className='text-destructive'>*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder='https://example.com'
                          disabled={loading}
                          className='rounded-xl transition-all duration-300 focus:ring-0'
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        The website where you want to start collecting visual
                        references
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='objective'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-sm font-medium'>
                        Project Objective{' '}
                        <span className='text-destructive'>*</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder='e.g., Collect modern minimalist design examples for a new brand identity project, focusing on clean typography and neutral color palettes'
                          rows={4}
                          disabled={loading}
                          className='resize-none rounded-xl transition-all duration-300 focus:ring-0'
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Describe what kind of visual references you want to
                        collect and organize
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className='flex items-center gap-4 pt-6'>
                  <Button
                    type='submit'
                    disabled={loading}
                    className='flex items-center gap-2 rounded-xl font-semibold shadow-sm hover:shadow-md'
                  >
                    {loading && <Loader2 className='h-5 w-5 animate-spin' />}
                    Create Project
                  </Button>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={handleCancel}
                    disabled={loading}
                    className='rounded-xl'
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          </FormCard>
        </div>
      </div>
    </PageContainer>
  );
}
