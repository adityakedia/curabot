/**
 * API endpoint to update project status
 * Updates project status when automation completes
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

    const { projectId, status } = await request.json();

    log.info('Updating project status', { projectId, status });

    // TODO: Implement database update using Supabase or another database
    // await db.project.update({
    //   where: { id: projectId, userId },
    //   data: { status }
    // });

    log.info('Project status updated', { projectId, status });

    return NextResponse.json({ success: true });
  } catch (error) {
    log.error('Error updating project status:', error);
    return NextResponse.json(
      { error: 'Failed to update status' },
      { status: 500 }
    );
  }
}
