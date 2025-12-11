/**
 * Project Detail Page Component
 * Displays comprehensive project information, status, and bot automation results
 * Handles real-time polling for project updates and automation triggering
 */

'use client';
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardContent,
//   CardDescription
// } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Heading } from '@/components/ui/heading';
import { useEffect, useRef, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { useProjectEvents } from '@/hooks/useProjectEvents';
import { Badge } from '@/components/ui/badge';
import log from '@/lib/logger';
import {
  IconGlobe,
  IconTarget,
  IconCheck,
  IconClock,
  IconCalendar,
  IconLoader2
} from '@tabler/icons-react';
import { notFound } from 'next/navigation';
// Link removed; not used in this file
import { PageContainer } from '@/components/dashboard-modern/page-container';
// import { PageHeader } from '@/components/dashboard-modern/page-header';
// import { InfoCard } from '@/components/dashboard-modern/info-card';
// import { StatusBadge } from '@/components/dashboard-modern/status-badge';
// import { Project, Analysis, Step } from '@/lib/storage';
import { Markdown } from '@/components/markdown/markdown';

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * Project Detail Page Component
 * Main component for displaying project details and automation results
 */
export default function ProjectDetailPage() {
  // ============================================================================
  // COMPONENT STATE
  // ============================================================================

  const params = useParams();
  const id = params.id as string;
  // Call hooks unconditionally (always at top-level) to satisfy Rules of Hooks.
  // Derive id first then call hooks; hook internals will handle invalid IDs.
  // Debug logging
  //console.log('🔍 Params object:', params);
  log.debug('Project ID', { id });

  // Hooks must be called on every render in the same order.
  const {
    project,
    isConnected,
    lastEvent,
    loading,
    error: projectError,
    loadProject
  } = useProjectEvents(id ?? '');

  // Trigger guard used to avoid multiple automation triggers
  const hasTriggeredRef = useRef(false);
  //console.log('🔍 ID type:', typeof id);
  // console.log(
  //   '🔍 Current URL:',
  //   typeof window !== 'undefined' ? window.location.href : 'SSR'
  // );

  // Note: early-return moved below hook declarations to ensure hooks are
  // invoked in the same order for every render (Rules of Hooks).

  // Use SSE for real-time updates instead of polling
  // (hooks already called above) useProjectEvents is invoked at top to keep hooks
  // in a single, consistent place. The effect below will call loadProject().

  // ============================================================================
  // EFFECT HOOKS
  // ============================================================================

  // Initial project fetch using SSE
  useEffect(() => {
    loadProject();
  }, [id, loadProject]);

  // Auto-trigger automation for pending projects
  const triggerAutomation = useCallback(async () => {
    if (!id) return;
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        log.error('API Error triggering automation', {
          status: response.status,
          statusText: response.statusText,
          errorData
        });
        return;
      }
    } catch (err) {
      log.error('Failed to trigger automation:', err);
    }
  }, [id]);

  useEffect(() => {
    if (project && project.status === 'pending' && !hasTriggeredRef.current) {
      hasTriggeredRef.current = true;
      // Give SSE time to connect before triggering automation
      setTimeout(() => {
        triggerAutomation();
      }, 1000);
    }
    // Reset flag when project changes or becomes completed
    if (project?.status === 'completed' || project?.status === 'failed') {
      hasTriggeredRef.current = false;
    }
  }, [project?.status, project?.id, triggerAutomation]);

  // ============================================================================
  // PROJECT LOADING LOGIC
  // ============================================================================

  // Error handling for SSE connection issues
  useEffect(() => {
    if (!isConnected && !loading) {
      // If SSE is not connected and we're not loading, try fallback
      const timer = setTimeout(() => {
        if (!project) {
          log.warn('Project load timeout - check SSE connection');
        }
      }, 10000); // 10 second timeout

      return () => clearTimeout(timer);
    }
  }, [isConnected, loading, project]);

  // AUTOMATION TRIGGERING is implemented above with a stable `triggerAutomation` callback.

  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================

  /**
   * Returns the screenshot URL for display
   * @param screenshotUrl - Direct URL from database (e.g., Supabase signed URL)
   * @returns The URL as-is for direct display, or null if no URL provided
   */
  function getScreenshotPath(screenshotUrl: string | undefined): string | null {
    if (!screenshotUrl) return null;

    // Return the URL directly - it's already a complete signed URL from Supabase
    return screenshotUrl;
  }

  // ============================================================================
  // LOADING STATE
  // ============================================================================

  if (loading) {
    return (
      <PageContainer scrollable={true}>
        <div className='flex min-h-[400px] items-center justify-center'>
          <div className='text-center'>
            <IconLoader2 className='mx-auto mb-4 h-8 w-8 animate-spin' />
            <h2 className='mb-2 text-xl font-semibold'>Loading Project...</h2>
            <div className='space-y-2'>
              <p className='text-muted-foreground'>
                {!isConnected
                  ? 'Connecting to real-time updates...'
                  : 'Loading project data...'}
              </p>
              <div className='flex items-center justify-center gap-2'>
                <div
                  className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-400'}`}
                ></div>
                <span className='text-muted-foreground text-xs'>
                  {isConnected ? 'Connected' : 'Connecting...'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </PageContainer>
    );
  }

  // ============================================================================
  // ERROR STATE
  // ============================================================================

  if (projectError) {
    return (
      <PageContainer scrollable={true}>
        <div className='flex min-h-[400px] items-center justify-center'>
          <div className='text-center'>
            <h2 className='mb-2 text-xl font-semibold'>Error</h2>
            <p className='text-muted-foreground mb-4'>{projectError}</p>
          </div>
        </div>
      </PageContainer>
    );
  }

  // ============================================================================
  // PROJECT NOT FOUND
  // ============================================================================

  if (!project) {
    notFound();
    return null;
  }

  // ============================================================================
  // DATA PREPARATION
  // ============================================================================

  // Static data for now
  const completedTasks = 0;
  const totalTasks = 10;
  const _progressPercentage =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Instead of using project.steps, use steps from the latest analysis
  // Note: analyses are ordered by timestamp DESC, so latest is first

  // Minimal debug: log basic project identifiers and status
  log.debug('Project debug', {
    projectId: project.id,
    projectStatus: project.status,
    analysesLength: project.analyses?.length || 0
  });

  const latestAnalysis =
    project.analyses && project.analyses.length > 0
      ? project.analyses[0]
      : null;

  // Minimal latest analysis debug
  log.debug('Latest analysis debug', {
    hasLatestAnalysis: !!latestAnalysis,
    analysisId: latestAnalysis?.id,
    stepsCount: latestAnalysis?.steps?.length || 0
  });

  const screenflow =
    latestAnalysis?.steps
      ?.sort((a, b) => a.stepNumber - b.stepNumber) // Ensure proper sequential order
      ?.map((step) => ({
        step: step.stepNumber,
        // Use the explicit `stepDescription` field from analysis for the
        // displayed step title. Fall back to the raw action string only if
        // `stepDescription` is missing.
        // Use the normalized `stepDescription` field exposed by conversion.
        stepName: step.analysis?.stepDescription ?? step.action,
        screenshot: getScreenshotPath(step.screenshot_path),
        comment: `Step ${step.stepNumber} completed`,
        timestamp: step.timestamp
      })) || [];

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  return (
    <PageContainer scrollable={true}>
      <div className='flex flex-1 flex-col space-y-4'>
        {/* ============================================================================ */}
        {/* PAGE HEADER */}
        {/* ============================================================================ */}

        <div className='flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between'>
          <div className='min-w-0 flex-1'>
            <div className='flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between'>
              <div className='min-w-0 flex-1'>
                <Heading
                  title={project.name}
                  description='Bot automation project details and results'
                />
              </div>
              {/* Status Badge - Responsive positioning */}
              <div className='flex-shrink-0'>
                <Badge
                  variant={
                    project.status === 'completed'
                      ? 'default'
                      : project.status === 'running'
                        ? 'secondary'
                        : project.status === 'failed'
                          ? 'destructive'
                          : 'outline'
                  }
                >
                  {project.status === 'running' && (
                    <IconLoader2 className='mr-1 h-4 w-4 animate-spin' />
                  )}
                  {project.status === 'completed' && (
                    <IconCheck className='mr-1 h-4 w-4' />
                  )}
                  {project.status === 'pending' && (
                    <IconClock className='mr-1 h-4 w-4' />
                  )}
                  {project.status}
                </Badge>
              </div>
            </div>

            {/* URL and Date Info */}
            <div className='text-muted-foreground mt-3 flex flex-col gap-2 text-sm sm:flex-row sm:items-center sm:gap-4'>
              <div className='flex min-w-0 items-center gap-1'>
                <IconGlobe className='h-4 w-4 flex-shrink-0' />
                <span className='truncate'>{project.url}</span>
              </div>
              <div className='flex flex-shrink-0 items-center gap-1'>
                <IconCalendar className='h-4 w-4' />
                <span>
                  Created {new Date(project.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Progress Section - Enhanced with real-time updates */}
            <div className='mt-4 space-y-3'>
              <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
                <span className='text-sm'>
                  {project.status === 'running'
                    ? 'Bot is working on your objective...'
                    : project.status === 'pending'
                      ? 'Starting automation...'
                      : project.status === 'completed'
                        ? 'Automation completed'
                        : 'Progress'}
                </span>
                <div className='flex items-center gap-2'>
                  <span className='text-sm'>{screenflow.length}/10 steps</span>
                  {isConnected && (
                    <div className='flex items-center gap-1'>
                      <div className='h-2 w-2 rounded-full bg-green-500'></div>
                      <span className='text-muted-foreground text-xs'>
                        Live
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className='h-2 w-full rounded-full bg-gray-200'>
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    project.status === 'completed'
                      ? 'bg-green-600'
                      : project.status === 'running'
                        ? 'bg-blue-600'
                        : project.status === 'failed'
                          ? 'bg-red-600'
                          : 'bg-gray-400'
                  }`}
                  style={{
                    width:
                      project.status === 'completed'
                        ? '100%'
                        : project.status === 'running'
                          ? `${Math.min((screenflow.length / 10) * 100, 90)}%`
                          : `${(screenflow.length / 10) * 100}%`
                  }}
                />
              </div>

              {project.status === 'running' && (
                <div className='text-muted-foreground flex items-center gap-2 text-sm'>
                  <IconLoader2 className='h-4 w-4 animate-spin' />
                  Processing step {screenflow.length + 1}...
                  {lastEvent && (
                    <span
                      className={`ml-2 ${
                        lastEvent.type === 'step_started'
                          ? 'text-blue-600'
                          : lastEvent.type === 'step_completed'
                            ? 'text-green-600'
                            : lastEvent.type === 'analysis_started'
                              ? 'text-purple-600'
                              : 'text-gray-600'
                      }`}
                    >
                      {lastEvent.type === 'step_started' &&
                        `• Step ${lastEvent.step?.stepNumber} started`}
                      {lastEvent.type === 'step_completed' &&
                        `• Step ${lastEvent.step?.stepNumber} completed`}
                      {lastEvent.type === 'analysis_started' &&
                        '• Analysis started'}
                      {lastEvent.type === 'automation_completed' &&
                        '• Automation completed!'}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        <Separator />

        {/* ============================================================================ */}
        {/* TASK OBJECTIVE SECTION - Using consistent card styling */}
        {/* ============================================================================ */}

        <div className='space-y-4'>
          {/* Task Objective Card - Using same styling as ProjectCard */}
          <div className='bg-card border-border hover:border-input group rounded-2xl border p-6 transition-all duration-300 hover:shadow-lg'>
            <div className='mb-4'>
              <h3 className='text-card-foreground group-hover:text-foreground flex items-center gap-2 text-xl font-bold tracking-tight transition-colors'>
                <IconTarget className='h-5 w-5' />
                Task Objective
              </h3>
            </div>
            <div>
              <p className='text-muted-foreground text-sm leading-relaxed'>
                {project.objective}
              </p>
              {latestAnalysis?.summary && (
                <div className='bg-muted text-foreground mt-4 rounded p-4 text-sm'>
                  <strong>Analysis Summary:</strong>
                  <div className='mt-2'>
                    <Markdown>
                      {(() => {
                        if (!latestAnalysis.summary)
                          return 'No summary available';

                        try {
                          // Try to parse as JSON first
                          const summaryData =
                            typeof latestAnalysis.summary === 'string'
                              ? JSON.parse(latestAnalysis.summary)
                              : latestAnalysis.summary;

                          // Extract the actual analysis content
                          return (
                            summaryData.completionSummary ||
                            summaryData.summary ||
                            JSON.stringify(summaryData, null, 2)
                          );
                        } catch (_error) {
                          // If it's not JSON, treat as plain string
                          return typeof latestAnalysis.summary === 'string'
                            ? latestAnalysis.summary
                            : JSON.stringify(latestAnalysis.summary, null, 2);
                        }
                      })()}
                    </Markdown>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <Separator />

        {/* ============================================================================ */}
        {/* SCREENFLOW SECTION - Increased spacing from Task Objective */}
        {/* ============================================================================ */}

        {/* Title and Description - Outside of any card */}
        <div className='mt-12 space-y-2'>
          <h2 className='text-2xl font-bold tracking-tight'>Screenflow</h2>
          <p className='text-muted-foreground'>
            {project.status === 'completed'
              ? `Screenshots and steps from your bot automation (${screenflow.length} steps completed)`
              : project.status === 'running'
                ? 'Bot is currently working on your objective...'
                : 'Preview of automation steps that will be executed'}
          </p>
        </div>

        {/* Steps - Each step as its own card with increased spacing */}
        {screenflow.length > 0 ||
        project.status === 'running' ||
        project.status === 'pending' ? (
          <div className='space-y-8'>
            {/* Existing completed steps */}
            {screenflow.map((step, index) => {
              // Get the actual step data from the latest analysis
              const actualStep = latestAnalysis?.steps?.[index];

              return (
                <div
                  key={`step-${index}`}
                  className='bg-card border-border hover:border-input group rounded-2xl border p-6 transition-all duration-300 hover:shadow-lg'
                >
                  {/* Step Number and Title - Responsive header */}
                  <div className='mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3'>
                    <div className='flex items-center gap-3'>
                      <div
                        className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                          actualStep?.stepStatus === 'completed'
                            ? 'bg-green-600 text-white'
                            : actualStep?.stepStatus === 'pending'
                              ? 'bg-yellow-600 text-white'
                              : 'bg-primary text-primary-foreground'
                        }`}
                      >
                        {actualStep?.stepStatus === 'completed'
                          ? '✓'
                          : step.step}
                      </div>
                      <h3 className='text-card-foreground group-hover:text-foreground min-w-0 flex-1 font-medium transition-colors'>
                        <span className='break-words'>{step.stepName}</span>
                      </h3>
                    </div>
                    {actualStep?.stepStatus && (
                      <div className='flex-shrink-0'>
                        <Badge
                          variant={
                            actualStep.stepStatus === 'completed'
                              ? 'default'
                              : actualStep.stepStatus === 'pending'
                                ? 'secondary'
                                : 'destructive'
                          }
                        >
                          {actualStep.stepStatus}
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Responsive Content Layout */}
                  <div className='flex flex-col gap-6 lg:grid lg:grid-cols-5 lg:gap-6'>
                    {/* Screenshot - Full width on mobile, 3/5 on desktop */}
                    <div className='lg:col-span-3'>
                      <div className='min-h-[300px] lg:min-h-[400px]'>
                        {step.screenshot ? (
                          <div className='border-border overflow-hidden rounded border'>
                            <img
                              src={step.screenshot}
                              alt={`Step ${step.step} screenshot`}
                              className='h-auto w-full object-cover object-top lg:h-[400px]'
                              onError={(e) => {
                                log.error(
                                  'Failed to load screenshot:',
                                  step.screenshot
                                );
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          </div>
                        ) : (
                          <div className='bg-muted text-muted-foreground flex min-h-[300px] items-center justify-center rounded border lg:min-h-[400px]'>
                            <div className='text-center'>
                              <div className='text-sm'>No Screenshot</div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* AI Response - Full width on mobile, 2/5 on desktop */}
                    <div className='lg:col-span-2'>
                      <div className='bg-card border-border min-h-[300px] overflow-y-auto rounded border p-4 lg:min-h-[400px]'>
                        <div className='text-foreground space-y-4 text-sm'>
                          {actualStep?.analysis ? (
                            <>
                              {/* Page Description - What the AI sees on the page */}
                              {actualStep.analysis.pageDescription && (
                                <div className='border-border border-b pb-3'>
                                  <h4 className='text-foreground mb-2 font-semibold'>
                                    📄 Page Description
                                  </h4>
                                  <p className='text-muted-foreground leading-relaxed'>
                                    {actualStep.analysis.pageDescription}
                                  </p>
                                </div>
                              )}

                              {/* Action Reasoning - AI Reasoning for each step */}
                              {actualStep.analysis.actionReasoning && (
                                <div className='border-border border-b pb-3'>
                                  <h4 className='text-foreground mb-2 font-semibold'>
                                    🧠 AI Reasoning
                                  </h4>
                                  <p className='leading-relaxed text-green-700 dark:text-green-300'>
                                    {actualStep.analysis.actionReasoning}
                                  </p>
                                </div>
                              )}
                            </>
                          ) : (
                            <div>
                              <h4 className='text-foreground mb-2 font-semibold'>
                                Step Information:
                              </h4>
                              <p className='leading-relaxed'>{step.comment}</p>
                              {actualStep?.action && (
                                <div className='mt-3'>
                                  <h4 className='text-foreground mb-2 font-semibold'>
                                    Action:
                                  </h4>
                                  <p className='bg-muted rounded p-2 font-mono text-xs leading-relaxed break-words'>
                                    {actualStep.action}
                                  </p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Placeholder for next step when automation is running */}
            {project.status === 'running' && (
              <div className='bg-card border-border rounded-2xl border-2 border-dashed p-6 transition-all duration-300'>
                <div className='mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3'>
                  <div className='flex items-center gap-3'>
                    <div className='flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white'>
                      <IconLoader2 className='h-4 w-4 animate-spin' />
                    </div>
                    <h3 className='text-muted-foreground min-w-0 flex-1 font-medium'>
                      <span className='break-words'>
                        {lastEvent?.type === 'step_started'
                          ? `Step ${lastEvent.step?.stepNumber}: ${lastEvent.step?.action}`
                          : `Preparing step ${screenflow.length + 1}...`}
                      </span>
                    </h3>
                  </div>
                  <div className='flex-shrink-0'>
                    <Badge variant='secondary'>
                      {lastEvent?.type === 'step_started'
                        ? 'Processing'
                        : 'Queued'}
                    </Badge>
                  </div>
                </div>

                {/* Processing placeholder - Responsive layout */}
                <div className='flex flex-col gap-6 lg:grid lg:grid-cols-5 lg:gap-6'>
                  {/* Screenshot placeholder */}
                  <div className='lg:col-span-3'>
                    <div className='bg-muted border-border flex min-h-[300px] items-center justify-center rounded border lg:min-h-[400px]'>
                      <div className='text-center'>
                        <IconLoader2 className='text-muted-foreground mx-auto mb-2 h-8 w-8 animate-spin' />
                        <p className='text-muted-foreground text-sm'>
                          Capturing screenshot...
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Live AI analysis preview */}
                  <div className='lg:col-span-2'>
                    <div className='bg-muted border-border min-h-[300px] rounded border p-4 lg:min-h-[400px]'>
                      {lastEvent?.step?.analysis ? (
                        <div className='space-y-4 text-sm'>
                          {/* Live AI Analysis */}
                          {lastEvent.step.analysis.pageDescription && (
                            <div className='border-border border-b pb-3'>
                              <h4 className='text-foreground mb-2 font-semibold'>
                                📄 Page Description
                              </h4>
                              <p className='text-muted-foreground leading-relaxed'>
                                {lastEvent.step.analysis.pageDescription}
                              </p>
                            </div>
                          )}

                          {lastEvent.step.analysis.actionReasoning && (
                            <div className='border-border border-b pb-3'>
                              <h4 className='text-foreground mb-2 font-semibold'>
                                🧠 AI Reasoning
                              </h4>
                              <p className='leading-relaxed text-green-700 dark:text-green-300'>
                                {lastEvent.step.analysis.actionReasoning}
                              </p>
                            </div>
                          )}

                          <div className='text-muted-foreground mt-6 text-center text-sm'>
                            <IconLoader2 className='mx-auto mb-2 h-5 w-5 animate-spin' />
                            Executing action...
                          </div>
                        </div>
                      ) : (
                        <div className='space-y-4'>
                          <div className='animate-pulse'>
                            <div className='mb-2 h-4 w-3/4 rounded bg-gray-300'></div>
                            <div className='mb-1 h-3 w-full rounded bg-gray-200'></div>
                            <div className='mb-1 h-3 w-5/6 rounded bg-gray-200'></div>
                            <div className='h-3 w-4/5 rounded bg-gray-200'></div>
                          </div>
                          <div className='text-muted-foreground mt-6 text-center text-sm'>
                            <IconLoader2 className='mx-auto mb-2 h-5 w-5 animate-spin' />
                            AI analyzing page...
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className='text-muted-foreground py-8 text-center'>
            <IconClock className='mx-auto mb-4 h-12 w-12' />
            <p>Automation has not started yet</p>
            <p className='text-sm'>
              The bot will begin working on your objective soon
            </p>
          </div>
        )}
      </div>
    </PageContainer>
  );
}
