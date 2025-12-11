/**
 * API routes for patient management
 * Handles listing, creating patients with authentication
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getAllPatients, createPatient, getPatientStats } from '@/services/patients';
import log from '@/lib/logger';

/**
 * GET handler for retrieving all patients for authenticated user
 */
export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [patients, stats] = await Promise.all([
      getAllPatients(userId),
      getPatientStats(userId)
    ]);

    return NextResponse.json({ patients, stats });
  } catch (error) {
    log.error('Error fetching patients:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST handler for creating new patient
 */
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.phone || !body.age) {
      return NextResponse.json(
        { error: 'Name, phone, and age are required' },
        { status: 400 }
      );
    }

    if (!body.medications || body.medications.length === 0) {
      return NextResponse.json(
        { error: 'At least one medication is required' },
        { status: 400 }
      );
    }

    const patient = await createPatient({
      userId,
      name: body.name,
      phone: body.phone,
      age: parseInt(body.age, 10),
      emergencyContact: body.emergencyContact,
      emergencyPhone: body.emergencyPhone,
      medicalConditions: body.medicalConditions,
      notes: body.notes,
      medications: body.medications
    });

    return NextResponse.json({ patient }, { status: 201 });
  } catch (error) {
    log.error('Error creating patient:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
