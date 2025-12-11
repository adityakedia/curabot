/**
 * React hook for real-time project status updates using Server-Sent Events
 * Replaces polling with efficient real-time communication
 */

import { useEffect, useState, useRef } from 'react';
import { Project } from '@/lib/storage';
import log from '@/lib/logger';

interface ProjectEvent {
  type:
    | 'connected'
    | 'status'
    | 'step_started'
    | 'step_completed'
    | 'analysis_started'
    | 'automation_completed';
  projectId: string;
  timestamp: string;
  step?: {
    id: string;
    analysisId: string;
    stepNumber: number;
    stepStatus: 'pending' | 'completed' | 'failed' | 'needs_retry';
    screenshotPath?: string;
    pageData?: any;
    action: string;
    result?: any;
    args: any;
    analysis?: {
      stepDescription?: string;
      pageDescription?: string;
      actionIntent?: string;
      actionReasoning?: string;
    };
    timestamp: string;
    completedAt?: string;
    error?: string;
  };
  analysisId?: string;
  message?: string;
}

export function useProjectEvents(projectId: string) {
  const [project, setProject] = useState<Project | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastEvent, setLastEvent] = useState<ProjectEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshCounter, setRefreshCounter] = useState(0);
  const eventSourceRef = useRef<EventSource | null>(null);

  // Save step data to database
  const saveStepToDatabase = async (stepData: any, projectId: string) => {
    try {
      log.debug('Saving step to database', {
        id: stepData?.id,
        stepNumber: stepData?.stepNumber
      });
      const response = await fetch('/api/projects/saveStep', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          projectId,
          step: {
            id: stepData.id,
            analysisId: stepData.analysisId,
            stepNumber: stepData.stepNumber,
            action: stepData.action,
            timestamp: stepData.timestamp,
            screenshot_path: stepData.screenshotPath, // API: screenshotPath -> DB: screenshot_path
            stepStatus: stepData.stepStatus, // API and DB both use stepStatus
            args: stepData.args,
            analysis: {
              stepDescription: stepData.analysis?.stepDescription,
              pageDescription: stepData.analysis?.pageDescription,
              actionIntent: stepData.analysis?.actionIntent,
              actionReasoning: stepData.analysis?.actionReasoning
            },
            result: stepData.result,
            completedAt: stepData.completedAt || new Date().toISOString(), // Add current timestamp if missing
            error: stepData.error
          }
        })
      });

      if (response.ok) {
        log.info('Step saved to database');
      } else {
        log.error('Failed to save step to database');
      }
    } catch (error) {
      log.error('Error saving step to database:', error);
    }
  };

  // Save summary to database via updateResult (single ingest endpoint)
  const saveSummaryToDatabase = async (
    summary: string,
    projectId: string,
    analysisId?: string
  ) => {
    try {
      log.debug('Saving summary via updateResult', {
        length: summary?.length ?? 0
      });
      const response = await fetch('/api/projects/updateResult', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          projectId,
          summary,
          projectStatus: 'completed',
          analysisStatus: 'completed',
          analysisId
        })
      });

      if (response.ok) {
        log.info('Summary saved to database via updateResult');
      } else {
        log.error('Failed to save summary via updateResult');
      }
    } catch (error) {
      log.error('Error saving summary to database via updateResult:', error);
    }
  };

  // Update project status to completed
  const updateProjectStatusToCompleted = async (projectId: string) => {
    try {
      log.debug('Updating project status to completed');
      const response = await fetch('/api/projects/updateStatus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          projectId,
          status: 'completed'
        })
      });

      if (response.ok) {
        log.info('Project status updated to completed');
      } else {
        log.error('Failed to update project status');
      }
    } catch (error) {
      log.error('Error updating project status:', error);
    }
  };

  useEffect(() => {
    log.debug('useProjectEvents called', { projectId, type: typeof projectId });
    if (!projectId || projectId === 'undefined' || projectId === '') {
      log.warn('Invalid projectId provided, returning early', { projectId });
      setLoading(false);
      setError('Invalid project ID');
      return;
    }

    // Create SSE connection to the automation service directly
    log.debug('Connecting to SSE for project', { projectId });
    const sseUrl = `${process.env.NEXT_PUBLIC_AUTOMATION_API_URL}/api/events/${projectId}`;
    log.debug('SSE URL', { sseUrl });
    const eventSource = new EventSource(sseUrl);
    eventSourceRef.current = eventSource;

    eventSource.onopen = () => {
      setIsConnected(true);
      log.info('Connected to project events', { projectId });
    };

    eventSource.onmessage = async (event) => {
      try {
        const data: ProjectEvent = JSON.parse(event.data);
        setLastEvent(data);

        switch (data.type) {
          case 'connected':
            log.info('SSE message', { message: data.message });
            // Load initial project data immediately
            await fetchProject();
            break;
          case 'status':
            if (data.projectId) {
              log.debug('Status update received', {
                projectId: data.projectId
              });
              setProject((prevProject) => {
                const newProject = { ...prevProject, id: data.projectId };
                log.debug('Status changed', {
                  from: prevProject?.status,
                  to: newProject.status
                });
                return newProject;
              });
            }
            break;
          case 'step_started':
            log.info('Step started', {
              stepNumber: data.step?.stepNumber,
              stepId: data.step?.id
            });
            log.debug('Full step data', { step: data.step });
            if (data.step?.analysis) {
              log.debug('Step analysis', {
                stepDescription: data.step.analysis.stepDescription,
                pageDescription: data.step.analysis.pageDescription
              });
            } else {
              log.debug('No analysis data received for step');
            }
            // Force immediate refresh to get the new step
            await fetchProject();
            break;
          case 'step_completed':
            log.info('Step completed', {
              stepNumber: data.step?.stepNumber,
              stepId: data.step?.id
            });
            log.debug('Full step data', { step: data.step });
            if (data.step?.analysis) {
              log.debug('Step analysis', {
                stepDescription: data.step.analysis.stepDescription,
                pageDescription: data.step.analysis.pageDescription
              });
            } else {
              log.debug('No analysis data received for completed step');
            }

            // Save step data to database
            if (data.step) {
              await saveStepToDatabase(data.step, projectId);
            }

            // Force immediate refresh to get the completed step
            await fetchProject();
            break;
          case 'analysis_started':
            log.info('Analysis started', { analysisId: data.analysisId });
            await fetchProject();
            break;
          case 'automation_completed':
            log.info('Automation completed for project', {
              projectId: data.projectId
            });

            // Update project status to completed first
            await updateProjectStatusToCompleted(projectId);

            // Save final analysis summary if available
            if (data.message) {
              await saveSummaryToDatabase(
                data.message,
                projectId,
                data.analysisId
              );
            }

            // Fetch updated project data to get final state
            await fetchProject();

            // Close SSE connection immediately - automation is done
            log.debug('Closing SSE connection - automation completed');
            eventSource.close();
            setIsConnected(false);
            break;
        }
      } catch (error) {
        log.error('Error parsing SSE event:', error);
      }
    };

    eventSource.onerror = (error) => {
      log.error('SSE connection error:', error);
      setIsConnected(false);

      // Only auto-reconnect if not manually closed and project is still running
      setTimeout(async () => {
        if (eventSourceRef.current?.readyState === EventSource.CLOSED) {
          // Check current project status before reconnecting
          try {
            const response = await fetch(`/api/projects/${projectId}`);
            if (response.ok) {
              const data = await response.json();
              // Only reconnect if project is still active (not completed/failed)
              if (
                data.project?.status === 'running' ||
                data.project?.status === 'pending'
              ) {
                log.info('Attempting to reconnect SSE');
                // Don't recreate connection here - let the existing logic handle reconnection
                // Just log that we would reconnect, but avoid infinite loops
              } else {
                log.info('Not reconnecting SSE - project completed/failed');
              }
            }
          } catch (err) {
            log.error('Failed to check project status for reconnection:', err);
          }
        }
      }, 3000);
    };

    // Cleanup on unmount
    return () => {
      eventSource.close();
      eventSourceRef.current = null;
      setIsConnected(false);
    };
  }, [projectId]);

  // Fallback fetch function for complex updates
  const fetchProject = async () => {
    try {
      if (!projectId || projectId === 'undefined' || projectId === '') {
        log.warn('Cannot fetch project with invalid ID:', projectId);
        setError('Invalid project ID');
        setLoading(false);
        return;
      }

      log.debug('Fetching updated project data', { projectId });
      const fetchUrl = `/api/projects/${projectId}`;
      log.debug('Fetch URL', { fetchUrl });
      const response = await fetch(fetchUrl);
      if (response.ok) {
        const data = await response.json();
        log.debug('Received updated project data', { id: data.project?.id });

        // DEBUG: Deep log the analyses data
        log.debug('Analyses debug', {
          projectId: data.project?.id,
          hasAnalyses: !!data.project?.analyses,
          analysesLength: data.project?.analyses?.length || 0
        });

        if (data.project?.analyses?.length > 0) {
          log.debug('First analysis debug', {
            analysisId: data.project.analyses[0]?.id,
            summaryType: typeof data.project.analyses[0]?.summary,
            summaryLength: data.project.analyses[0]?.summary?.length || 0
          });
        }

        setProject((prevProject) => {
          // Force re-render by creating new object reference with deep clone
          const newProject = JSON.parse(JSON.stringify(data.project));
          const oldStepsCount = prevProject?.analyses?.[0]?.steps?.length || 0;
          const newStepsCount = newProject.analyses?.[0]?.steps?.length || 0;

          log.debug('Project state updated', {
            oldStatus: prevProject?.status,
            newStatus: newProject.status,
            oldSteps: oldStepsCount,
            newSteps: newStepsCount
          });

          // Log the actual step data for debugging
          if (newProject.analyses?.[0]?.steps?.length) {
            const lastStep = newProject.analyses[0].steps[newStepsCount - 1];
            log.debug('Last step analysis data', {
              stepNumber: lastStep.stepNumber,
              hasAnalysis: !!lastStep.analysis
            });
          }

          return newProject;
        });
        setLoading(false);
        setError(null);

        // Force re-render by incrementing refresh counter
        setRefreshCounter((prev) => prev + 1);

        // Close SSE if project is completed
        if (data.project.status === 'completed') {
          log.info('Project completed - closing SSE connection');
          eventSourceRef.current?.close();
          setIsConnected(false);
        }
      }
    } catch (error) {
      log.error('Error fetching project:', error);
      setError('Failed to update project data');
    }
  };

  // Manual fetch function for initial load
  const loadProject = fetchProject;

  return {
    project,
    isConnected,
    lastEvent,
    loading,
    error,
    loadProject,
    refreshCounter
  };
}
