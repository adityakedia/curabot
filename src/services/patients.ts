/**
 * Patient Service
 * Handles all patient-related database operations for CuraBot
 * Uses Supabase directly for database integration
 */

import { supabase } from '@/lib/supabase';

// ============================================================================
// TYPES
// ============================================================================

export interface Patient {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  age: number;
  emergency_contact?: string;
  emergency_phone?: string;
  medical_conditions?: string;
  notes?: string;
  status: string;
  adherence_rate: number;
  created_at: string;
  updated_at: string;
}

export interface Medication {
  id: string;
  patient_id: string;
  name: string;
  dosage: string;
  time: string;
  frequency: string;
  active: boolean;
  created_at: string;
}

export interface CallLog {
  id: string;
  patient_id: string;
  scheduled_at: string;
  started_at?: string;
  ended_at?: string;
  duration: number;
  status: string;
  medications: string[];
  notes?: string;
  transcript?: string;
  created_at: string;
}

export interface MedicalRecord {
  id: string;
  patient_id: string;
  type: string;
  title: string;
  description?: string;
  file_url?: string;
  file_name?: string;
  file_type?: string;
  record_date: string;
  created_at: string;
}

export interface TimelineEvent {
  id: string;
  patient_id: string;
  type: string;
  title: string;
  description?: string;
  metadata?: Record<string, unknown>;
  event_date: string;
  created_at: string;
}

export interface CreatePatientInput {
  userId: string;
  name: string;
  phone: string;
  age: number;
  emergencyContact?: string;
  emergencyPhone?: string;
  medicalConditions?: string;
  notes?: string;
  medications: {
    name: string;
    dosage: string;
    time: string;
    frequency?: string;
  }[];
}

export interface UpdatePatientInput {
  name?: string;
  phone?: string;
  age?: number;
  emergency_contact?: string;
  emergency_phone?: string;
  medical_conditions?: string;
  notes?: string;
  status?: string;
}

// ============================================================================
// PATIENT OPERATIONS
// ============================================================================

export async function createPatient(input: CreatePatientInput) {
  const { medications, userId, emergencyContact, emergencyPhone, medicalConditions, ...rest } = input;
  
  // Insert patient
  const { data: patient, error: patientError } = await supabase
    .from('patients')
    .insert({
      user_id: userId,
      emergency_contact: emergencyContact,
      emergency_phone: emergencyPhone,
      medical_conditions: medicalConditions,
      ...rest
    })
    .select()
    .single();
  
  if (patientError) throw patientError;
  
  // Insert medications
  if (medications.length > 0) {
    const { error: medError } = await supabase
      .from('medications')
      .insert(
        medications.map((med) => ({
          patient_id: patient.id,
          name: med.name,
          dosage: med.dosage,
          time: med.time,
          frequency: med.frequency || 'daily'
        }))
      );
    
    if (medError) throw medError;
  }
  
  // Add timeline event
  await supabase.from('timeline_events').insert({
    patient_id: patient.id,
    type: 'note',
    title: 'Patient Added',
    description: `${rest.name} was added to CuraBot care`,
    event_date: new Date().toISOString()
  });
  
  // Fetch complete patient with medications
  const { data: fullPatient } = await supabase
    .from('patients')
    .select('*, medications(*)')
    .eq('id', patient.id)
    .single();
  
  return fullPatient;
}

export async function getPatient(id: string, userId: string) {
  const { data, error } = await supabase
    .from('patients')
    .select(`
      *,
      medications(*)
    `)
    .eq('id', id)
    .eq('user_id', userId)
    .single();
  
  if (error) return null;
  
  // Fetch call logs separately
  const { data: callLogs } = await supabase
    .from('call_logs')
    .select('*')
    .eq('patient_id', id)
    .order('scheduled_at', { ascending: false })
    .limit(20);
  
  // Fetch medical records separately
  const { data: medicalRecords } = await supabase
    .from('medical_records')
    .select('*')
    .eq('patient_id', id)
    .order('record_date', { ascending: false });
  
  return {
    ...data,
    callLogs: callLogs || [],
    medicalRecords: medicalRecords || []
  };
}

export async function getAllPatients(userId: string) {
  const { data, error } = await supabase
    .from('patients')
    .select(`
      *,
      medications(*)
    `)
    .eq('user_id', userId)
    .order('name', { ascending: true });
  
  if (error) throw error;
  
  return data || [];
}

export async function updatePatient(id: string, userId: string, updates: UpdatePatientInput) {
  const { error } = await supabase
    .from('patients')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', userId);
  
  if (error) throw error;
  return true;
}

export async function deletePatient(id: string, userId: string) {
  const { error } = await supabase
    .from('patients')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);
  
  return !error;
}

// ============================================================================
// MEDICATION OPERATIONS
// ============================================================================

export async function addMedication(patientId: string, userId: string, medication: {
  name: string;
  dosage: string;
  time: string;
  frequency?: string;
}) {
  // Verify patient belongs to user
  const { data: patient } = await supabase
    .from('patients')
    .select('id')
    .eq('id', patientId)
    .eq('user_id', userId)
    .single();
  
  if (!patient) throw new Error('Patient not found');
  
  const { data: med, error } = await supabase
    .from('medications')
    .insert({
      patient_id: patientId,
      name: medication.name,
      dosage: medication.dosage,
      time: medication.time,
      frequency: medication.frequency || 'daily'
    })
    .select()
    .single();
  
  if (error) throw error;
  
  // Add timeline event
  await supabase.from('timeline_events').insert({
    patient_id: patientId,
    type: 'medication_change',
    title: 'Medication Added',
    description: `${medication.name} (${medication.dosage}) added at ${medication.time}`,
    event_date: new Date().toISOString()
  });
  
  return med;
}

export async function removeMedication(medicationId: string, patientId: string, userId: string) {
  // Verify patient belongs to user
  const { data: patient } = await supabase
    .from('patients')
    .select('id')
    .eq('id', patientId)
    .eq('user_id', userId)
    .single();
  
  if (!patient) throw new Error('Patient not found');
  
  // Soft delete by setting active to false
  const { error } = await supabase
    .from('medications')
    .update({ active: false })
    .eq('id', medicationId);
  
  if (error) throw error;
  return true;
}

// ============================================================================
// CALL LOG OPERATIONS
// ============================================================================

export async function getCallLogs(userId: string, options?: {
  patientId?: string;
  status?: string;
  limit?: number;
  offset?: number;
}) {
  // Get patient IDs for this user first
  const { data: patientIds } = await supabase
    .from('patients')
    .select('id, name, phone')
    .eq('user_id', userId);
  
  if (!patientIds || patientIds.length === 0) return [];
  
  const ids = patientIds.map(p => p.id);
  const patientMap = Object.fromEntries(patientIds.map(p => [p.id, p]));
  
  let query = supabase
    .from('call_logs')
    .select('*')
    .in('patient_id', ids)
    .order('scheduled_at', { ascending: false });
  
  if (options?.patientId) {
    query = query.eq('patient_id', options.patientId);
  }
  
  if (options?.status) {
    query = query.eq('status', options.status);
  }
  
  if (options?.limit) {
    query = query.limit(options.limit);
  }
  
  const { data, error } = await query;
  
  if (error) throw error;
  
  // Transform to match expected format
  return (data || []).map((log) => ({
    ...log,
    patientId: log.patient_id,
    patientName: patientMap[log.patient_id]?.name,
    scheduledAt: log.scheduled_at
  }));
}

export async function createCallLog(patientId: string, data: {
  scheduledAt: Date;
  medications: string[];
}) {
  const { data: callLog, error } = await supabase
    .from('call_logs')
    .insert({
      patient_id: patientId,
      scheduled_at: data.scheduledAt.toISOString(),
      medications: data.medications,
      status: 'pending'
    })
    .select()
    .single();
  
  if (error) throw error;
  return callLog;
}

export async function updateCallLog(callLogId: string, data: {
  status?: string;
  started_at?: Date;
  ended_at?: Date;
  duration?: number;
  notes?: string;
  transcript?: string;
}) {
  const updateData: Record<string, unknown> = {};
  if (data.status) updateData.status = data.status;
  if (data.started_at) updateData.started_at = data.started_at.toISOString();
  if (data.ended_at) updateData.ended_at = data.ended_at.toISOString();
  if (data.duration !== undefined) updateData.duration = data.duration;
  if (data.notes) updateData.notes = data.notes;
  if (data.transcript) updateData.transcript = data.transcript;
  
  const { data: callLog, error } = await supabase
    .from('call_logs')
    .update(updateData)
    .eq('id', callLogId)
    .select()
    .single();
  
  if (error) throw error;
  
  // Add timeline event for completed/missed calls
  if (data.status === 'completed' || data.status === 'missed') {
    await supabase.from('timeline_events').insert({
      patient_id: callLog.patient_id,
      type: 'call',
      title: data.status === 'completed' ? 'Call Completed' : 'Call Missed',
      description: data.notes || `Medication reminder call ${data.status}`,
      metadata: {
        callLogId,
        duration: data.duration,
        medications: callLog.medications
      },
      event_date: new Date().toISOString()
    });
  }
  
  return callLog;
}

// ============================================================================
// MEDICAL RECORD OPERATIONS
// ============================================================================

export async function createMedicalRecord(userId: string, input: {
  patientId: string;
  type: string;
  title: string;
  description?: string;
  fileUrl?: string;
  fileName?: string;
  fileType?: string;
  recordDate: Date;
}) {
  // Verify patient belongs to user
  const { data: patient } = await supabase
    .from('patients')
    .select('id')
    .eq('id', input.patientId)
    .eq('user_id', userId)
    .single();
  
  if (!patient) throw new Error('Patient not found');
  
  const { data: record, error } = await supabase
    .from('medical_records')
    .insert({
      patient_id: input.patientId,
      type: input.type,
      title: input.title,
      description: input.description,
      file_url: input.fileUrl,
      file_name: input.fileName,
      file_type: input.fileType,
      record_date: input.recordDate.toISOString()
    })
    .select()
    .single();
  
  if (error) throw error;
  
  // Add timeline event
  await supabase.from('timeline_events').insert({
    patient_id: input.patientId,
    type: 'record_added',
    title: `${input.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} Added`,
    description: input.title,
    metadata: { recordId: record.id, type: input.type },
    event_date: input.recordDate.toISOString()
  });
  
  return record;
}

export async function getMedicalRecords(patientId: string, userId: string) {
  // Verify patient belongs to user
  const { data: patient } = await supabase
    .from('patients')
    .select('id')
    .eq('id', patientId)
    .eq('user_id', userId)
    .single();
  
  if (!patient) throw new Error('Patient not found');
  
  const { data, error } = await supabase
    .from('medical_records')
    .select('*')
    .eq('patient_id', patientId)
    .order('record_date', { ascending: false });
  
  if (error) throw error;
  return data || [];
}

export async function deleteMedicalRecord(recordId: string, patientId: string, userId: string) {
  // Verify patient belongs to user
  const { data: patient } = await supabase
    .from('patients')
    .select('id')
    .eq('id', patientId)
    .eq('user_id', userId)
    .single();
  
  if (!patient) throw new Error('Patient not found');
  
  const { error } = await supabase
    .from('medical_records')
    .delete()
    .eq('id', recordId);
  
  return !error;
}

// ============================================================================
// TIMELINE OPERATIONS
// ============================================================================

export async function getTimeline(patientId: string, userId: string, options?: {
  limit?: number;
  offset?: number;
}) {
  // Verify patient belongs to user
  const { data: patient } = await supabase
    .from('patients')
    .select('id')
    .eq('id', patientId)
    .eq('user_id', userId)
    .single();
  
  if (!patient) throw new Error('Patient not found');
  
  let query = supabase
    .from('timeline_events')
    .select('*')
    .eq('patient_id', patientId)
    .order('event_date', { ascending: false });
  
  if (options?.limit) {
    query = query.limit(options.limit);
  }
  
  const { data, error } = await query;
  
  if (error) throw error;
  return data || [];
}

export async function addTimelineEvent(userId: string, input: {
  patientId: string;
  type: string;
  title: string;
  description?: string;
  metadata?: Record<string, unknown>;
  eventDate: Date;
}) {
  // Verify patient belongs to user
  const { data: patient } = await supabase
    .from('patients')
    .select('id')
    .eq('id', input.patientId)
    .eq('user_id', userId)
    .single();
  
  if (!patient) throw new Error('Patient not found');
  
  const { data, error } = await supabase
    .from('timeline_events')
    .insert({
      patient_id: input.patientId,
      type: input.type,
      title: input.title,
      description: input.description,
      metadata: input.metadata,
      event_date: input.eventDate.toISOString()
    })
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

// ============================================================================
// STATISTICS
// ============================================================================

export async function getPatientStats(userId: string) {
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString();
  const endOfDay = new Date(today.setHours(23, 59, 59, 999)).toISOString();
  
  // Get patient counts
  const { count: totalPatients } = await supabase
    .from('patients')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);
  
  const { count: activePatients } = await supabase
    .from('patients')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('status', 'active');
  
  // Get patient IDs for call log queries
  const { data: patientIds } = await supabase
    .from('patients')
    .select('id')
    .eq('user_id', userId);
  
  const ids = patientIds?.map(p => p.id) || [];
  
  let todayCalls = 0;
  let completedCalls = 0;
  let missedCalls = 0;
  
  if (ids.length > 0) {
    const { count: todayCount } = await supabase
      .from('call_logs')
      .select('*', { count: 'exact', head: true })
      .in('patient_id', ids)
      .gte('scheduled_at', startOfDay)
      .lte('scheduled_at', endOfDay);
    
    const { count: completedCount } = await supabase
      .from('call_logs')
      .select('*', { count: 'exact', head: true })
      .in('patient_id', ids)
      .eq('status', 'completed')
      .gte('scheduled_at', startOfDay)
      .lte('scheduled_at', endOfDay);
    
    const { count: missedCount } = await supabase
      .from('call_logs')
      .select('*', { count: 'exact', head: true })
      .in('patient_id', ids)
      .eq('status', 'missed')
      .gte('scheduled_at', startOfDay)
      .lte('scheduled_at', endOfDay);
    
    todayCalls = todayCount || 0;
    completedCalls = completedCount || 0;
    missedCalls = missedCount || 0;
  }
  
  return {
    totalPatients: totalPatients || 0,
    activePatients: activePatients || 0,
    needsAttention: (totalPatients || 0) - (activePatients || 0),
    todayCalls,
    completedCalls,
    missedCalls,
    successRate: todayCalls > 0 ? Math.round((completedCalls / todayCalls) * 100) : 0
  };
}
