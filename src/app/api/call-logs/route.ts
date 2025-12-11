/**
 * API routes for call logs
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getCallLogs } from '@/services/patients';
import log from '@/lib/logger';

/**
 * GET handler for retrieving call logs for authenticated user
 */
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get('patientId');
    const status = searchParams.get('status');
    const limit = searchParams.get('limit');
    const offset = searchParams.get('offset');

    const callLogs = await getCallLogs(userId, {
      patientId: patientId || undefined,
      status: status || undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
      offset: offset ? parseInt(offset, 10) : undefined
    });

    return NextResponse.json({ callLogs });
  } catch (error) {
    log.error('Error fetching call logs:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
