/**
 * API routes for patient medical records
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getMedicalRecords, createMedicalRecord, deleteMedicalRecord } from '@/services/patients';
import log from '@/lib/logger';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET handler for retrieving patient medical records
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { userId } = await auth();
    const { id } = await params;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const records = await getMedicalRecords(id, userId);

    return NextResponse.json({ records });
  } catch (error) {
    log.error('Error fetching medical records:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST handler for creating a medical record
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { userId } = await auth();
    const { id: patientId } = await params;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    if (!body.type || !body.title || !body.recordDate) {
      return NextResponse.json(
        { error: 'Type, title, and record date are required' },
        { status: 400 }
      );
    }

    const record = await createMedicalRecord(userId, {
      patientId,
      type: body.type,
      title: body.title,
      description: body.description,
      fileUrl: body.fileUrl,
      fileName: body.fileName,
      fileType: body.fileType,
      recordDate: new Date(body.recordDate)
    });

    return NextResponse.json({ record }, { status: 201 });
  } catch (error) {
    log.error('Error creating medical record:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE handler for removing a medical record
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { userId } = await auth();
    const { id: patientId } = await params;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const recordId = searchParams.get('recordId');

    if (!recordId) {
      return NextResponse.json(
        { error: 'Record ID is required' },
        { status: 400 }
      );
    }

    await deleteMedicalRecord(recordId, patientId, userId);

    return NextResponse.json({ success: true });
  } catch (error) {
    log.error('Error deleting medical record:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
