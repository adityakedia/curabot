/**
 * API routes for patient timeline
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getTimeline, addTimelineEvent } from '@/services/patients';
import log from '@/lib/logger';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET handler for retrieving patient timeline
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { userId } = await auth();
    const { id } = await params;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit');
    const offset = searchParams.get('offset');

    const timeline = await getTimeline(id, userId, {
      limit: limit ? parseInt(limit, 10) : undefined,
      offset: offset ? parseInt(offset, 10) : undefined
    });

    return NextResponse.json({ timeline });
  } catch (error) {
    log.error('Error fetching timeline:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST handler for adding a timeline event
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { userId } = await auth();
    const { id: patientId } = await params;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    if (!body.type || !body.title) {
      return NextResponse.json(
        { error: 'Type and title are required' },
        { status: 400 }
      );
    }

    const event = await addTimelineEvent(userId, {
      patientId,
      type: body.type,
      title: body.title,
      description: body.description,
      metadata: body.metadata,
      eventDate: body.eventDate ? new Date(body.eventDate) : new Date()
    });

    return NextResponse.json({ event }, { status: 201 });
  } catch (error) {
    log.error('Error creating timeline event:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
