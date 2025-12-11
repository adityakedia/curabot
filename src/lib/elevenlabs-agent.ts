import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';
import type { ElevenLabs } from '@elevenlabs/elevenlabs-js';

interface PatientAgentContext {
  id: string;
  name: string;
  phone: string;
  age: number;
  emergencyContact?: string | null;
  emergencyPhone?: string | null;
  medicalConditions?: string | null;
  notes?: string | null;
  medications?: {
    name: string;
    dosage?: string | null;
    time?: string | null;
    frequency?: string | null;
  }[];
}

const ELEVENLABS_ENVIRONMENT =
  process.env.ELEVENLABS_ENVIRONMENT ??
  process.env.ELEVENLABS_BASE_URL ??
  'https://api.elevenlabs.io';

export function createElevenLabsClient() {
  const apiKey = process.env.ELEVENLABS_API_KEY;

  if (!apiKey) {
    throw new Error('Missing ELEVENLABS_API_KEY environment variable');
  }

  return new ElevenLabsClient({
    apiKey,
    environment: ELEVENLABS_ENVIRONMENT
  });
}

export function buildPatientAgentConversationConfig(
  patient: PatientAgentContext
): ElevenLabs.ConversationalConfig {
  const firstName = patient.name.split(' ')[0] || patient.name;
  const medicationLines =
    patient.medications?.map((med) => {
      const timing = med.time ? ` at ${med.time}` : '';
      const frequency = med.frequency ? ` (${med.frequency})` : '';
      return `• ${med.name}${med.dosage ? ` ${med.dosage}` : ''}${timing}${frequency}`;
    }) ?? [];

  const promptSegments = [
    'You are an empathetic healthcare assistant calling patients on behalf of CuraBot.',
    'Always introduce yourself as a virtual nurse from CuraBot and mention that the call may be recorded for training purposes.',
    'Use the patient profile below to personalize the conversation and provide actionable guidance.',
    'If you are unsure of an answer, acknowledge it and offer to connect them with a human nurse.',
    '',
    'Patient Profile:',
    `• Name: ${patient.name}`,
    `• Age: ${patient.age}`,
    `• Phone: ${patient.phone}`,
    `• Emergency Contact: ${patient.emergencyContact || 'Not provided'}`,
    `• Emergency Phone: ${patient.emergencyPhone || 'Not provided'}`,
    `• Medical Conditions: ${patient.medicalConditions || 'Not provided'}`,
    `• Notes: ${patient.notes || 'None'}`,
    `• Medications:\n${medicationLines.length ? medicationLines.join('\n') : '• None documented'}`,
    '',
    'Conversation goals:',
    '1. Make sure the patient feels heard and supported.',
    '2. Confirm they are taking medications according to the plan.',
    '3. Offer to escalate to their human care team if needed.'
  ];

  const dynamicVariablePlaceholders: Record<string, string | number | boolean> =
    {
      patientName: patient.name,
      patientPhone: patient.phone,
      emergencyContact: patient.emergencyContact ?? '',
      emergencyPhone: patient.emergencyPhone ?? '',
      medicationsSummary: medicationLines.join('\n')
    };

  const keywords = [
    patient.name,
    ...(patient.medicalConditions ? patient.medicalConditions.split(',') : [])
  ]
    .map((value) => value.trim())
    .filter((value) => Boolean(value));

  const baseConfig: ElevenLabs.ConversationalConfig = {
    agent: {
      firstMessage: `Hi ${firstName}, this is your virtual care assistant from CuraBot checking in. How are you feeling today?`,
      language: 'en',
      prompt: {
        prompt: promptSegments.join('\n'),
        llm: 'gpt-4o-mini',
        temperature: 0.4,
        maxTokens: 512
      },
      dynamicVariables: {
        dynamicVariablePlaceholders
      },
      disableFirstMessageInterruptions: false
    },
    asr: {
      quality: 'high',
      provider: 'elevenlabs',
      userInputAudioFormat: 'pcm_16000',
      keywords
    },
    conversation: {
      maxDurationSeconds: 900
    },
    turn: {
      turnTimeout: 20,
      silenceEndCallTimeout: 90,
      turnEagerness: 'normal'
    },
    tts: {
      modelId: 'eleven_multilingual_v2',
      stability: 0.45,
      similarityBoost: 0.75,
      optimizeStreamingLatency: 3
    }
  };

  const configuredVoiceId = process.env.ELEVENLABS_DEFAULT_VOICE_ID;
  if (configuredVoiceId) {
    baseConfig.tts = {
      ...baseConfig.tts,
      voiceId: configuredVoiceId
    };
  }

  return baseConfig;
}

export type { PatientAgentContext };
