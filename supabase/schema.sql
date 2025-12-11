-- CuraBot Database Schema for Supabase
-- Run this SQL in the Supabase SQL Editor to create all necessary tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- PATIENTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS patients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  age INTEGER NOT NULL,
  emergency_contact TEXT,
  emergency_phone TEXT,
  medical_conditions TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  adherence_rate INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for user queries
CREATE INDEX IF NOT EXISTS idx_patients_user_id ON patients(user_id);
CREATE INDEX IF NOT EXISTS idx_patients_status ON patients(status);

-- ============================================================================
-- MEDICATIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS medications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  dosage TEXT NOT NULL,
  time TEXT NOT NULL,
  frequency TEXT NOT NULL DEFAULT 'daily',
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for patient lookups
CREATE INDEX IF NOT EXISTS idx_medications_patient_id ON medications(patient_id);
CREATE INDEX IF NOT EXISTS idx_medications_active ON medications(active);

-- ============================================================================
-- CALL LOGS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS call_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE,
  ended_at TIMESTAMP WITH TIME ZONE,
  duration INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending',
  medications TEXT[] DEFAULT '{}',
  notes TEXT,
  transcript TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for call log queries
CREATE INDEX IF NOT EXISTS idx_call_logs_patient_id ON call_logs(patient_id);
CREATE INDEX IF NOT EXISTS idx_call_logs_status ON call_logs(status);
CREATE INDEX IF NOT EXISTS idx_call_logs_scheduled_at ON call_logs(scheduled_at);

-- ============================================================================
-- MEDICAL RECORDS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS medical_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- diagnosis, prescription, test_report, other
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT,
  file_name TEXT,
  file_type TEXT,
  record_date TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for record lookups
CREATE INDEX IF NOT EXISTS idx_medical_records_patient_id ON medical_records(patient_id);
CREATE INDEX IF NOT EXISTS idx_medical_records_type ON medical_records(type);

-- ============================================================================
-- TIMELINE EVENTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS timeline_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- call, medication_change, health_update, record_added, note
  title TEXT NOT NULL,
  description TEXT,
  metadata JSONB,
  event_date TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for timeline lookups
CREATE INDEX IF NOT EXISTS idx_timeline_events_patient_id ON timeline_events(patient_id);
CREATE INDEX IF NOT EXISTS idx_timeline_events_type ON timeline_events(type);
CREATE INDEX IF NOT EXISTS idx_timeline_events_event_date ON timeline_events(event_date);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE call_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeline_events ENABLE ROW LEVEL SECURITY;

-- Note: Since we're using Clerk for auth (not Supabase Auth),
-- we'll handle authorization in the application layer.
-- For now, create permissive policies that allow all operations.
-- In production, you should use a service role key or implement
-- proper RLS based on your auth strategy.

CREATE POLICY "Allow all operations on patients" ON patients
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on medications" ON medications
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on call_logs" ON call_logs
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on medical_records" ON medical_records
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on timeline_events" ON timeline_events
  FOR ALL USING (true) WITH CHECK (true);

-- ============================================================================
-- UPDATED_AT TRIGGER FUNCTION
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to tables with updated_at
CREATE TRIGGER update_patients_updated_at
  BEFORE UPDATE ON patients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_medications_updated_at
  BEFORE UPDATE ON medications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_medical_records_updated_at
  BEFORE UPDATE ON medical_records
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
