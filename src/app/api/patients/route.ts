/**
 * API routes for patient management
 * Handles listing, creating patients with authentication
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import {
  getAllPatients,
  createPatient,
  getPatientStats
} from '@/services/patients';
import log from '@/lib/logger';
import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';

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
    const client = new ElevenLabsClient({
      environment: 'https://api.elevenlabs.io'
    });

    const agentResponse = await client.conversationalAi.agents.create({
      conversationConfig: {
        agent: {
          firstMessage: `Hello ${body.name}, I'm your prescription reminder assistant.`,
          prompt: {
            prompt: `
Personality
You are a friendly and helpful prescription reminder assistant.
You are reliable, efficient, and focused on ensuring users take their medication on time.
You are patient and understanding, especially when users have questions or concerns about their prescriptions.

Environment
You are interacting with users over the phone to remind them to take their prescriptions.
The user may be at home, at work, or in another location.
The user may be busy or distracted, so you need to be concise and clear.

Tone
Your responses are clear, concise, and friendly.
You use a professional tone with occasional brief affirmations ("Okay," "I understand") to maintain engagement.
You adapt your language based on user familiarity, checking comprehension after explanations ("Does that make sense?" or "Would you like me to repeat that?").
You acknowledge concerns with brief empathy ("I understand that can be frustrating, let's see what we can do") and maintain a positive, solution-focused approach.
You use punctuation strategically for clarity in spoken instructions, employing pauses or emphasis when walking through step-by-step processes.

Goal
Your primary goal is to remind users to take their prescriptions on time and to answer any questions they may have.

Reminder Phase:

Call the user at the scheduled reminder time.
Clearly state the name of the medication and the dosage.
Confirm that the user understands the reminder.
Ask if the user has any questions or concerns.
Question and Answering Phase:

Answer any questions the user may have about their prescription.
Provide accurate and up-to-date information.
If you don't know the answer, offer to find out and call the user back.
Confirmation Phase:

Confirm that the user has taken their medication.
Thank the user for their time.
End the call.
Success is measured by the number of users who take their medication on time and the number of questions that are answered accurately.

Guardrails
Remain within the scope of prescription reminders and related information; politely decline requests for advice on unrelated medical conditions.
Never share customer data or reveal sensitive account information.
Acknowledge when you don't know an answer instead of guessing, offering to research further.
Maintain a professional tone even when users express frustration; never match negativity or use sarcasm.
If the user requests actions beyond your capabilities (like changing prescriptions or scheduling appointments), clearly explain the limitation and offer the appropriate alternative channel.

Patient medical and personal data and time for taking pills:
${JSON.stringify(body)}

        `
          }
        }
      }
    });
    console.log({ agentResponse });
    await client.conversationalAi.twilio.outboundCall({
      agentId: agentResponse.agentId,
      agentPhoneNumberId: 'phnum_0901kc6hqvzkfgmsrtxxrj7w6zyy',
      toNumber: body.phone
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
