/**
 * API endpoint to save individual step data from SSE events
 * Creates or updates analysis and step data in Supabase
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';
import log from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    // Authentication check
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { projectId, step } = await request.json();

    log.debug('Saving step', { projectId, stepNumber: step?.stepNumber });

    // Validate required fields from API
    if (!projectId) {
      return NextResponse.json(
        { error: 'projectId is required' },
        { status: 400 }
      );
    }

    if (!step || typeof step !== 'object') {
      return NextResponse.json(
        { error: 'step object is required' },
        { status: 400 }
      );
    }

    if (!step.id) {
      return NextResponse.json(
        { error: 'Step ID is required from API' },
        { status: 400 }
      );
    }

    if (!step.analysisId) {
      return NextResponse.json(
        { error: 'Analysis ID is required from API' },
        { status: 400 }
      );
    }

    // Verify project exists and belongs to user
    const project = await prisma.project.findFirst({
      where: { id: projectId, userId }
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Ensure the Analysis exists in an idempotent way. Previously we did
    // findUnique() then create(), which is racy: two concurrent requests can
    // both see "not found" and attempt to create the same analysis, causing
    // unique-constraint errors. Use upsert to make creation atomic.
    //
    // Business rule: we only create an Analysis when the Project has the
    // required `url` and `objective`. If those are missing and the analysis
    // doesn't already exist, we fail-fast as before.
    let analysis = null;
    if (project.url && project.objective) {
      // Safe to attempt upsert: create will include required fields.
      analysis = await prisma.analysis.upsert({
        where: { id: step.analysisId },
        update: {}, // if it already exists, don't modify it here
        create: {
          id: step.analysisId,
          projectId,
          url: project.url,
          objective: project.objective,
          status: 'pending'
        }
      });

      if (analysis)
        log.info('Ensured analysis exists (upsert)', {
          analysisId: analysis.id
        });
    } else {
      // If we cannot create (missing project fields), only accept the step
      // if the analysis already exists. This preserves previous behavior.
      analysis = await prisma.analysis.findUnique({
        where: { id: step.analysisId }
      });
      if (!analysis) {
        return NextResponse.json(
          { error: 'Project missing url or objective; cannot create analysis' },
          { status: 400 }
        );
      }
    }

    // Normalize incoming analysis object to store canonical `stepDescription` in DB
    const incomingAnalysis = step.analysis || null;
    const analysisData = incomingAnalysis
      ? {
          ...incomingAnalysis,
          // Map legacy `description` -> `stepDescription` if needed
          stepDescription:
            incomingAnalysis.stepDescription ??
            incomingAnalysis.description ??
            null
        }
      : null;

    // Create payload (full) for the create branch of upsert and build a
    // selective `update` payload that only contains fields explicitly
    // provided in the incoming request. This prevents sparse/late events
    // from overwriting richer existing data with nulls.
    const createPayload: any = {
      id: step.id,
      analysisId: step.analysisId,
      stepNumber: step.stepNumber,
      action: step.action ?? null,
      stepStatus: step.stepStatus ?? 'completed',
      args: step.args ?? null,
      analysisData,
      result: step.result ?? null,
      screenshotPath: step.screenshot_path ?? null,
      error: step.error ?? null,
      timestamp: step.timestamp ? new Date(step.timestamp) : new Date(),
      ...(step.stepStatus === 'completed' && { completedAt: new Date() })
    };

    // Build minimal update object only for keys present in the payload.
    const updatePayload: any = {};
    if (Object.prototype.hasOwnProperty.call(step, 'stepNumber'))
      updatePayload.stepNumber = step.stepNumber;
    if (Object.prototype.hasOwnProperty.call(step, 'action'))
      updatePayload.action = step.action;
    if (Object.prototype.hasOwnProperty.call(step, 'args'))
      updatePayload.args = step.args ?? null;
    if (Object.prototype.hasOwnProperty.call(step, 'result'))
      updatePayload.result = step.result ?? null;
    if (Object.prototype.hasOwnProperty.call(step, 'screenshot_path'))
      updatePayload.screenshotPath = step.screenshot_path ?? null;
    if (Object.prototype.hasOwnProperty.call(step, 'analysis'))
      updatePayload.analysisData = analysisData;
    if (Object.prototype.hasOwnProperty.call(step, 'error'))
      updatePayload.error = step.error ?? null;
    if (Object.prototype.hasOwnProperty.call(step, 'timestamp'))
      updatePayload.timestamp = step.timestamp
        ? new Date(step.timestamp)
        : undefined;
    if (Object.prototype.hasOwnProperty.call(step, 'stepStatus')) {
      updatePayload.stepStatus = step.stepStatus;
      if (step.stepStatus === 'completed')
        updatePayload.completedAt = new Date();
    }

    await prisma.step.upsert({
      where: { id: createPayload.id },
      create: createPayload,
      update: updatePayload
    });

    log.info('Step saved to database', {
      projectId,
      stepNumber: step.stepNumber
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    log.error('Error saving step:', error);
    return NextResponse.json({ error: 'Failed to save step' }, { status: 500 });
  }
}
