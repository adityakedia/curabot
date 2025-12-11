/**
 * API routes for individual project management
 * Handles project retrieval and automation triggering
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getProject, updateProjectResult } from '@/lib/storage';
import type { Project } from '@/lib/storage';
import log from '@/lib/logger';

// ============================================================================
// PROJECT RETRIEVAL
// ============================================================================

/**
 * GET handler for retrieving a specific project by ID
 * @param request - Next.js request object
 * @param params - Route parameters containing project ID
 * @returns JSON response with project data or error
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // ============================================================================
    // AUTHENTICATION CHECK
    // ============================================================================

    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // ============================================================================
    // PROJECT LOOKUP
    // ============================================================================

    const { id } = await params;
    const project = await getProject(id, userId);

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json({ project });
  } catch (error) {
    // ============================================================================
    // ERROR HANDLING
    // ============================================================================

    log.error('Error fetching project:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ============================================================================
// AUTOMATION TRIGGERING
// ============================================================================

/**
 * POST handler for triggering automation on a project
 * Updates project status and initiates web automation workflow
 * @param request - Next.js request object
 * @param params - Route parameters containing project ID
 * @returns JSON response confirming automation start or error
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // ============================================================================
    // AUTHENTICATION CHECK
    // ============================================================================

    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // ============================================================================
    // PROJECT LOOKUP
    // ============================================================================

    const { id } = await params;
    const project = await getProject(id, userId);

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // ============================================================================
    // STATUS UPDATE
    // ============================================================================

    // Update status to running
    await updateProjectResult(id, null, 'running', 'pending');

    // ============================================================================
    // AUTOMATION SERVICE CALL
    // ============================================================================

    // Trigger automation
    log.info('Calling automation API', {
      url: process.env.NEXT_PUBLIC_AUTOMATION_API_URL
    });

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_AUTOMATION_API_URL}/api/run`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.NEXT_PUBLIC_AUTOMATION_API_KEY!
          },
          body: JSON.stringify({
            projectId: project.id,
            projectName: project.name,
            url: project.url,
            objective: project.objective
          })
        }
      );

      log.debug('Automation API response status', { status: response.status });
      if (response.ok) {
        const automationResult = await response.json();
        await updateProjectResult(
          project.id,
          automationResult.summary,
          automationResult.projectStatus,
          automationResult.latestanalysisStatus,
          automationResult.steps,
          automationResult.analysisId
        );
      } else {
        const errorText = await response.text();
        log.error('Automation service returned error', {
          status: response.status,
          body: errorText
        });
        await updateProjectResult(
          project.id,
          `Automation failed: ${errorText}`,
          'failed',
          'failed'
        );
      }
    } catch (error) {
      // ============================================================================
      // CONNECTION ERROR HANDLING
      // ============================================================================
      log.error('Connection Error to automation service:', error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      await updateProjectResult(
        project.id,
        `Connection failed: ${errorMessage}`,
        'failed',
        'failed'
      );
    }

    // ============================================================================
    // SUCCESS RESPONSE
    // ============================================================================

    return NextResponse.json({
      success: true,
      message: 'Automation started'
    });
  } catch (error) {
    // ============================================================================
    // ERROR HANDLING
    // ============================================================================

    log.error('Error triggering automation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
