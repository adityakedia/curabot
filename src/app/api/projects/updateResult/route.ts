/**
 * API endpoint to update project results from automation service
 * Updates client storage when automation completes
 */

import { NextRequest, NextResponse } from 'next/server';
import { updateProjectResult } from '@/lib/storage';
import log from '@/lib/logger';

// Expect automation service to supply an API key in header 'x-api-key'
const EXPECTED_API_KEY = process.env.AUTOMATION_API_KEY;

/**
 * POST handler for updating project results from automation service
 */
export async function POST(request: NextRequest) {
  try {
    // Basic API key protection for external automation service
    const providedKey = request.headers.get('x-api-key');
    if (EXPECTED_API_KEY && providedKey !== EXPECTED_API_KEY) {
      log.warn('Unauthorized updateResult call - bad api key');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await request.json();
    const {
      projectId,
      summary,
      projectStatus,
      analysisStatus,
      steps,
      analysisId
    } = payload || {};

    if (!projectId) {
      log.warn('updateResult: missing projectId');
      return NextResponse.json(
        { error: 'projectId is required' },
        { status: 400 }
      );
    }

    log.info('Updating project in client storage', {
      projectId,
      projectStatus,
      analysisStatus,
      steps: Array.isArray(steps) ? steps.length : 0
    });

    // Update client storage / database. Forward analysisId and steps.
    await updateProjectResult(
      projectId,
      summary ?? null,
      projectStatus ?? null,
      analysisStatus ?? null,
      Array.isArray(steps) ? steps : undefined,
      analysisId ?? null
    );

    log.info('Client storage updated for project', { projectId });

    return NextResponse.json({ success: true });
  } catch (error) {
    log.error('Error updating project result:', error);
    return NextResponse.json(
      { error: 'Failed to update project result' },
      { status: 500 }
    );
  }
}
