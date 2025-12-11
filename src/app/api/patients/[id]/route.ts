/**
 * API routes for individual patient operations
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getPatient, updatePatient, deletePatient } from '@/services/patients';
import log from '@/lib/logger';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET handler for retrieving a specific patient
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { userId } = await auth();
    const { id } = await params;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const patient = await getPatient(id, userId);

    if (!patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    return NextResponse.json({ patient });
  } catch (error) {
    log.error('Error fetching patient:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PATCH handler for updating a patient
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { userId } = await auth();
    const { id } = await params;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    await updatePatient(id, userId, body);

    const patient = await getPatient(id, userId);

    return NextResponse.json({ patient });
  } catch (error) {
    log.error('Error updating patient:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE handler for removing a patient
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { userId } = await auth();
    const { id } = await params;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const deleted = await deletePatient(id, userId);

    if (!deleted) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    log.error('Error deleting patient:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
