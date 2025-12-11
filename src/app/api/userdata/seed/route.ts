import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * POST /api/userdata/seed
 * Seeds demo data for the current user if they have no patients
 * This allows every new user to see demo data in their account
 */
export async function POST() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Check if user already has patients
    const { data: existingPatients, error: checkError } = await supabase
      .from('patients')
      .select('id')
      .eq('user_id', userId)
      .limit(1);

    if (checkError) {
      console.error('Error checking existing patients:', checkError);
      return NextResponse.json(
        { error: 'Failed to check existing data' },
        { status: 500 }
      );
    }

    // If user already has data, don't seed
    if (existingPatients && existingPatients.length > 0) {
      return NextResponse.json({
        message: 'User already has data',
        seeded: false
      });
    }

    // Generate unique IDs for this user's demo data
    const patientIds = [
      crypto.randomUUID(),
      crypto.randomUUID(),
      crypto.randomUUID(),
      crypto.randomUUID(),
      crypto.randomUUID()
    ];

    // Seed patients
    const patients = [
      {
        id: patientIds[0],
        user_id: userId,
        name: 'Margaret Johnson',
        phone: '+1 (555) 123-4567',
        age: 78,
        emergency_contact: 'Sarah Johnson (Daughter)',
        emergency_phone: '+1 (555) 987-6543',
        medical_conditions: 'Type 2 Diabetes, Hypertension, Mild Arthritis',
        notes:
          'Prefers morning calls. Hard of hearing - speak slowly and clearly.',
        status: 'active',
        adherence_rate: 94,
        created_at: new Date(
          Date.now() - 45 * 24 * 60 * 60 * 1000
        ).toISOString()
      },
      {
        id: patientIds[1],
        user_id: userId,
        name: 'Robert Williams',
        phone: '+1 (555) 234-5678',
        age: 82,
        emergency_contact: 'Michael Williams (Son)',
        emergency_phone: '+1 (555) 876-5432',
        medical_conditions: 'Atrial Fibrillation, High Cholesterol',
        notes: 'Very punctual with medications. Likes to chat during calls.',
        status: 'active',
        adherence_rate: 98,
        created_at: new Date(
          Date.now() - 30 * 24 * 60 * 60 * 1000
        ).toISOString()
      },
      {
        id: patientIds[2],
        user_id: userId,
        name: 'Dorothy Brown',
        phone: '+1 (555) 345-6789',
        age: 75,
        emergency_contact: 'Jennifer Brown (Daughter)',
        emergency_phone: '+1 (555) 765-4321',
        medical_conditions: 'Hypothyroidism, Osteoporosis',
        notes:
          'Sometimes forgets evening medications. May need follow-up calls.',
        status: 'active',
        adherence_rate: 78,
        created_at: new Date(
          Date.now() - 60 * 24 * 60 * 60 * 1000
        ).toISOString()
      },
      {
        id: patientIds[3],
        user_id: userId,
        name: 'James Wilson',
        phone: '+1 (555) 456-7890',
        age: 80,
        emergency_contact: 'Patricia Wilson (Wife)',
        emergency_phone: '+1 (555) 654-3210',
        medical_conditions: 'COPD, Type 2 Diabetes, Glaucoma',
        notes: 'Wife usually helps with medications. Call her if no answer.',
        status: 'active',
        adherence_rate: 88,
        created_at: new Date(
          Date.now() - 20 * 24 * 60 * 60 * 1000
        ).toISOString()
      },
      {
        id: patientIds[4],
        user_id: userId,
        name: 'Helen Davis',
        phone: '+1 (555) 567-8901',
        age: 85,
        emergency_contact: 'Thomas Davis (Son)',
        emergency_phone: '+1 (555) 543-2109',
        medical_conditions: 'Congestive Heart Failure, Chronic Kidney Disease',
        notes:
          'Requires careful medication timing. Do not call during nap time (2-4 PM).',
        status: 'needs_attention',
        adherence_rate: 65,
        created_at: new Date(
          Date.now() - 90 * 24 * 60 * 60 * 1000
        ).toISOString()
      }
    ];

    const { error: patientsError } = await supabase
      .from('patients')
      .insert(patients);

    if (patientsError) {
      console.error('Error seeding patients:', patientsError);
      return NextResponse.json(
        { error: 'Failed to seed patients' },
        { status: 500 }
      );
    }

    // Seed medications
    const medications = [
      // Margaret Johnson
      {
        patient_id: patientIds[0],
        name: 'Metformin',
        dosage: '500mg',
        time: '08:00',
        frequency: 'twice daily',
        active: true
      },
      {
        patient_id: patientIds[0],
        name: 'Lisinopril',
        dosage: '10mg',
        time: '08:00',
        frequency: 'daily',
        active: true
      },
      {
        patient_id: patientIds[0],
        name: 'Aspirin',
        dosage: '81mg',
        time: '12:00',
        frequency: 'daily',
        active: true
      },
      {
        patient_id: patientIds[0],
        name: 'Metformin',
        dosage: '500mg',
        time: '18:00',
        frequency: 'twice daily',
        active: true
      },
      // Robert Williams
      {
        patient_id: patientIds[1],
        name: 'Warfarin',
        dosage: '5mg',
        time: '09:00',
        frequency: 'daily',
        active: true
      },
      {
        patient_id: patientIds[1],
        name: 'Atorvastatin',
        dosage: '20mg',
        time: '21:00',
        frequency: 'daily',
        active: true
      },
      {
        patient_id: patientIds[1],
        name: 'Metoprolol',
        dosage: '25mg',
        time: '09:00',
        frequency: 'twice daily',
        active: true
      },
      {
        patient_id: patientIds[1],
        name: 'Metoprolol',
        dosage: '25mg',
        time: '21:00',
        frequency: 'twice daily',
        active: true
      },
      // Dorothy Brown
      {
        patient_id: patientIds[2],
        name: 'Levothyroxine',
        dosage: '50mcg',
        time: '06:00',
        frequency: 'daily',
        active: true
      },
      {
        patient_id: patientIds[2],
        name: 'Calcium + Vitamin D',
        dosage: '600mg/400IU',
        time: '12:00',
        frequency: 'daily',
        active: true
      },
      {
        patient_id: patientIds[2],
        name: 'Alendronate',
        dosage: '70mg',
        time: '06:00',
        frequency: 'weekly',
        active: true
      },
      // James Wilson
      {
        patient_id: patientIds[3],
        name: 'Tiotropium',
        dosage: '18mcg',
        time: '08:00',
        frequency: 'daily',
        active: true
      },
      {
        patient_id: patientIds[3],
        name: 'Metformin',
        dosage: '1000mg',
        time: '08:00',
        frequency: 'twice daily',
        active: true
      },
      {
        patient_id: patientIds[3],
        name: 'Metformin',
        dosage: '1000mg',
        time: '18:00',
        frequency: 'twice daily',
        active: true
      },
      {
        patient_id: patientIds[3],
        name: 'Latanoprost Eye Drops',
        dosage: '1 drop',
        time: '21:00',
        frequency: 'daily',
        active: true
      },
      {
        patient_id: patientIds[3],
        name: 'Albuterol Inhaler',
        dosage: '2 puffs',
        time: 'as needed',
        frequency: 'as needed',
        active: true
      },
      // Helen Davis
      {
        patient_id: patientIds[4],
        name: 'Furosemide',
        dosage: '40mg',
        time: '08:00',
        frequency: 'daily',
        active: true
      },
      {
        patient_id: patientIds[4],
        name: 'Carvedilol',
        dosage: '12.5mg',
        time: '08:00',
        frequency: 'twice daily',
        active: true
      },
      {
        patient_id: patientIds[4],
        name: 'Carvedilol',
        dosage: '12.5mg',
        time: '20:00',
        frequency: 'twice daily',
        active: true
      },
      {
        patient_id: patientIds[4],
        name: 'Lisinopril',
        dosage: '5mg',
        time: '08:00',
        frequency: 'daily',
        active: true
      },
      {
        patient_id: patientIds[4],
        name: 'Potassium Chloride',
        dosage: '20mEq',
        time: '12:00',
        frequency: 'daily',
        active: true
      }
    ];

    const { error: medsError } = await supabase
      .from('medications')
      .insert(medications);

    if (medsError) {
      console.error('Error seeding medications:', medsError);
    }

    // Seed call logs
    const now = Date.now();
    const hour = 60 * 60 * 1000;
    const day = 24 * hour;

    const callLogs = [
      // Margaret Johnson
      {
        patient_id: patientIds[0],
        scheduled_at: new Date(now - 6 * hour).toISOString(),
        started_at: new Date(now - 6 * hour + 10000).toISOString(),
        ended_at: new Date(now - 6 * hour + 154000).toISOString(),
        duration: 154,
        status: 'completed',
        medications: ['Metformin', 'Lisinopril'],
        notes:
          'Patient confirmed taking medications. Mentioned feeling well today.'
      },
      {
        patient_id: patientIds[0],
        scheduled_at: new Date(now - 1 * day).toISOString(),
        started_at: new Date(now - 1 * day + 5000).toISOString(),
        ended_at: new Date(now - 1 * day + 105000).toISOString(),
        duration: 105,
        status: 'completed',
        medications: ['Metformin'],
        notes: 'Evening medication confirmed.'
      },
      {
        patient_id: patientIds[0],
        scheduled_at: new Date(now - 1 * day - 6 * hour).toISOString(),
        started_at: null,
        ended_at: null,
        duration: 0,
        status: 'missed',
        medications: ['Aspirin'],
        notes: 'No answer after 3 attempts.'
      },
      // Robert Williams
      {
        patient_id: patientIds[1],
        scheduled_at: new Date(now - 3 * hour).toISOString(),
        started_at: new Date(now - 3 * hour + 6000).toISOString(),
        ended_at: new Date(now - 3 * hour + 195000).toISOString(),
        duration: 195,
        status: 'completed',
        medications: ['Warfarin', 'Metoprolol'],
        notes: 'Patient in great spirits. Confirmed all medications.'
      },
      {
        patient_id: patientIds[1],
        scheduled_at: new Date(now - 15 * hour).toISOString(),
        started_at: new Date(now - 15 * hour + 4000).toISOString(),
        ended_at: new Date(now - 15 * hour + 115000).toISOString(),
        duration: 115,
        status: 'completed',
        medications: ['Atorvastatin', 'Metoprolol'],
        notes: 'Evening medications confirmed.'
      },
      // Dorothy Brown
      {
        patient_id: patientIds[2],
        scheduled_at: new Date(now - 8 * hour).toISOString(),
        started_at: new Date(now - 8 * hour + 15000).toISOString(),
        ended_at: new Date(now - 8 * hour + 95000).toISOString(),
        duration: 95,
        status: 'completed',
        medications: ['Levothyroxine'],
        notes: 'Early morning medication confirmed.'
      },
      {
        patient_id: patientIds[2],
        scheduled_at: new Date(now - 2 * hour).toISOString(),
        started_at: null,
        ended_at: null,
        duration: 0,
        status: 'missed',
        medications: ['Calcium + Vitamin D'],
        notes: 'No answer. Alert sent to caregiver Jennifer.'
      },
      // James Wilson
      {
        patient_id: patientIds[3],
        scheduled_at: new Date(now - 4 * hour).toISOString(),
        started_at: new Date(now - 4 * hour + 8000).toISOString(),
        ended_at: new Date(now - 4 * hour + 165000).toISOString(),
        duration: 165,
        status: 'completed',
        medications: ['Tiotropium', 'Metformin'],
        notes: 'Wife Patricia answered. Confirmed both medications taken.'
      },
      // Helen Davis
      {
        patient_id: patientIds[4],
        scheduled_at: new Date(now - 5 * hour).toISOString(),
        started_at: null,
        ended_at: null,
        duration: 0,
        status: 'missed',
        medications: ['Furosemide', 'Carvedilol', 'Lisinopril'],
        notes: 'No answer. Thomas (son) notified.'
      },
      {
        patient_id: patientIds[4],
        scheduled_at: new Date(now - 4.5 * hour).toISOString(),
        started_at: new Date(now - 4.5 * hour + 25000).toISOString(),
        ended_at: new Date(now - 4.5 * hour + 190000).toISOString(),
        duration: 190,
        status: 'completed',
        medications: ['Furosemide', 'Carvedilol', 'Lisinopril'],
        notes:
          'Retry successful. Son Thomas was present and confirmed medications.'
      }
    ];

    const { error: callsError } = await supabase
      .from('call_logs')
      .insert(callLogs);

    if (callsError) {
      console.error('Error seeding call logs:', callsError);
    }

    // Seed medical records
    const medicalRecords = [
      {
        patient_id: patientIds[0],
        type: 'diagnosis',
        title: 'Type 2 Diabetes Mellitus',
        description: 'Initial diagnosis. HbA1c: 7.2%. Started on Metformin.',
        record_date: new Date(now - 730 * day).toISOString()
      },
      {
        patient_id: patientIds[0],
        type: 'test_report',
        title: 'Annual Blood Work',
        description: 'HbA1c: 6.8%, Cholesterol: 195, BP: 128/82. Good control.',
        record_date: new Date(now - 30 * day).toISOString()
      },
      {
        patient_id: patientIds[1],
        type: 'diagnosis',
        title: 'Atrial Fibrillation',
        description:
          'Paroxysmal AFib detected. Started on anticoagulation therapy.',
        record_date: new Date(now - 1095 * day).toISOString()
      },
      {
        patient_id: patientIds[1],
        type: 'test_report',
        title: 'INR Check',
        description: 'INR: 2.4 (therapeutic range). Warfarin dose stable.',
        record_date: new Date(now - 7 * day).toISOString()
      },
      {
        patient_id: patientIds[2],
        type: 'diagnosis',
        title: 'Hypothyroidism',
        description: 'TSH elevated. Started on Levothyroxine.',
        record_date: new Date(now - 1825 * day).toISOString()
      },
      {
        patient_id: patientIds[3],
        type: 'diagnosis',
        title: 'COPD - Moderate',
        description: 'FEV1: 62% predicted. Started on Tiotropium.',
        record_date: new Date(now - 1460 * day).toISOString()
      },
      {
        patient_id: patientIds[4],
        type: 'diagnosis',
        title: 'Congestive Heart Failure',
        description:
          'NYHA Class II. EF: 40%. Started on Carvedilol and Furosemide.',
        record_date: new Date(now - 1095 * day).toISOString()
      }
    ];

    const { error: recordsError } = await supabase
      .from('medical_records')
      .insert(medicalRecords);

    if (recordsError) {
      console.error('Error seeding medical records:', recordsError);
    }

    // Seed timeline events
    const timelineEvents = [
      {
        patient_id: patientIds[0],
        type: 'note',
        title: 'Patient Added',
        description: 'Margaret Johnson was added to CuraBot care',
        event_date: new Date(now - 45 * day).toISOString()
      },
      {
        patient_id: patientIds[0],
        type: 'call',
        title: 'Call Completed',
        description: 'Morning medication reminder successful',
        event_date: new Date(now - 6 * hour).toISOString()
      },
      {
        patient_id: patientIds[1],
        type: 'note',
        title: 'Patient Added',
        description: 'Robert Williams was added to CuraBot care',
        event_date: new Date(now - 30 * day).toISOString()
      },
      {
        patient_id: patientIds[1],
        type: 'health_update',
        title: 'INR Stable',
        description: 'INR remains in therapeutic range (2.4)',
        event_date: new Date(now - 7 * day).toISOString()
      },
      {
        patient_id: patientIds[2],
        type: 'note',
        title: 'Patient Added',
        description: 'Dorothy Brown was added to CuraBot care',
        event_date: new Date(now - 60 * day).toISOString()
      },
      {
        patient_id: patientIds[2],
        type: 'call',
        title: 'Call Missed',
        description: 'Midday medication reminder - no answer',
        event_date: new Date(now - 2 * hour).toISOString()
      },
      {
        patient_id: patientIds[3],
        type: 'note',
        title: 'Patient Added',
        description: 'James Wilson was added to CuraBot care',
        event_date: new Date(now - 20 * day).toISOString()
      },
      {
        patient_id: patientIds[4],
        type: 'note',
        title: 'Patient Added',
        description: 'Helen Davis was added to CuraBot care',
        event_date: new Date(now - 90 * day).toISOString()
      },
      {
        patient_id: patientIds[4],
        type: 'health_update',
        title: 'Needs Attention',
        description: 'Low adherence rate (65%). Schedule family conference.',
        event_date: new Date(now - 7 * day).toISOString()
      }
    ];

    const { error: timelineError } = await supabase
      .from('timeline_events')
      .insert(timelineEvents);

    if (timelineError) {
      console.error('Error seeding timeline events:', timelineError);
    }

    return NextResponse.json({
      message: 'Demo data seeded successfully',
      seeded: true,
      patientsCreated: patients.length
    });
  } catch (error) {
    console.error('Error seeding data:', error);
    return NextResponse.json({ error: 'Failed to seed data' }, { status: 500 });
  }
}
