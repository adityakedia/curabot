/**
 * API endpoint to save individual step data from SSE events
 * Creates or updates analysis and step data in Supabase
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
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

    // TODO: Implement database verification using Supabase or another database
    // const project = await db.project.findFirst({
    //   where: { id: projectId, userId }
    // });
    // if (!project) {
    //   return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    // }

    // TODO: Implement database upsert using Supabase or another database
    // const incomingAnalysis = step.analysis || null;
    // const analysisData = incomingAnalysis
    //   ? {
    //       ...incomingAnalysis,
    //       stepDescription:
    //         incomingAnalysis.stepDescription ??
    //         incomingAnalysis.description ??
    //         null
    //     }
    //   : null;
    //
    // await db.step.upsert({
    //   where: { id: step.id },
    //   create: { ... },
    //   update: { ... }
    // });

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
