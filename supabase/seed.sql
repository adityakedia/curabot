-- CuraBot Seed Data
-- Run this SQL in the Supabase SQL Editor after running schema.sql
-- This creates mock data for testing all dashboard pages

-- ============================================================================
-- MOCK PATIENTS (5 elderly patients)
-- ============================================================================

-- Use a fixed user_id for demo purposes (replace with your actual Clerk user ID)
-- You can find your user_id by logging in and checking the console or API response

INSERT INTO patients (id, user_id, name, phone, age, emergency_contact, emergency_phone, medical_conditions, notes, status, adherence_rate, created_at)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'demo_user', 'Margaret Johnson', '+1 (555) 123-4567', 78, 'Sarah Johnson (Daughter)', '+1 (555) 987-6543', 'Type 2 Diabetes, Hypertension, Mild Arthritis', 'Prefers morning calls. Hard of hearing - speak slowly and clearly.', 'active', 94, NOW() - INTERVAL '45 days'),
  
  ('22222222-2222-2222-2222-222222222222', 'demo_user', 'Robert Williams', '+1 (555) 234-5678', 82, 'Michael Williams (Son)', '+1 (555) 876-5432', 'Atrial Fibrillation, High Cholesterol', 'Very punctual with medications. Likes to chat during calls.', 'active', 98, NOW() - INTERVAL '30 days'),
  
  ('33333333-3333-3333-3333-333333333333', 'demo_user', 'Dorothy Brown', '+1 (555) 345-6789', 75, 'Jennifer Brown (Daughter)', '+1 (555) 765-4321', 'Hypothyroidism, Osteoporosis', 'Sometimes forgets evening medications. May need follow-up calls.', 'active', 78, NOW() - INTERVAL '60 days'),
  
  ('44444444-4444-4444-4444-444444444444', 'demo_user', 'James Wilson', '+1 (555) 456-7890', 80, 'Patricia Wilson (Wife)', '+1 (555) 654-3210', 'COPD, Type 2 Diabetes, Glaucoma', 'Wife usually helps with medications. Call her if no answer.', 'active', 88, NOW() - INTERVAL '20 days'),
  
  ('55555555-5555-5555-5555-555555555555', 'demo_user', 'Helen Davis', '+1 (555) 567-8901', 85, 'Thomas Davis (Son)', '+1 (555) 543-2109', 'Congestive Heart Failure, Chronic Kidney Disease', 'Requires careful medication timing. Do not call during nap time (2-4 PM).', 'needs_attention', 65, NOW() - INTERVAL '90 days');

-- ============================================================================
-- MEDICATIONS FOR EACH PATIENT
-- ============================================================================

-- Margaret Johnson's medications
INSERT INTO medications (patient_id, name, dosage, time, frequency, active)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'Metformin', '500mg', '08:00', 'twice daily', true),
  ('11111111-1111-1111-1111-111111111111', 'Lisinopril', '10mg', '08:00', 'daily', true),
  ('11111111-1111-1111-1111-111111111111', 'Aspirin', '81mg', '12:00', 'daily', true),
  ('11111111-1111-1111-1111-111111111111', 'Metformin', '500mg', '18:00', 'twice daily', true);

-- Robert Williams' medications
INSERT INTO medications (patient_id, name, dosage, time, frequency, active)
VALUES
  ('22222222-2222-2222-2222-222222222222', 'Warfarin', '5mg', '09:00', 'daily', true),
  ('22222222-2222-2222-2222-222222222222', 'Atorvastatin', '20mg', '21:00', 'daily', true),
  ('22222222-2222-2222-2222-222222222222', 'Metoprolol', '25mg', '09:00', 'twice daily', true),
  ('22222222-2222-2222-2222-222222222222', 'Metoprolol', '25mg', '21:00', 'twice daily', true);

-- Dorothy Brown's medications
INSERT INTO medications (patient_id, name, dosage, time, frequency, active)
VALUES
  ('33333333-3333-3333-3333-333333333333', 'Levothyroxine', '50mcg', '06:00', 'daily', true),
  ('33333333-3333-3333-3333-333333333333', 'Calcium + Vitamin D', '600mg/400IU', '12:00', 'daily', true),
  ('33333333-3333-3333-3333-333333333333', 'Alendronate', '70mg', '06:00', 'weekly', true);

-- James Wilson's medications
INSERT INTO medications (patient_id, name, dosage, time, frequency, active)
VALUES
  ('44444444-4444-4444-4444-444444444444', 'Tiotropium', '18mcg', '08:00', 'daily', true),
  ('44444444-4444-4444-4444-444444444444', 'Metformin', '1000mg', '08:00', 'twice daily', true),
  ('44444444-4444-4444-4444-444444444444', 'Metformin', '1000mg', '18:00', 'twice daily', true),
  ('44444444-4444-4444-4444-444444444444', 'Latanoprost Eye Drops', '1 drop', '21:00', 'daily', true),
  ('44444444-4444-4444-4444-444444444444', 'Albuterol Inhaler', '2 puffs', 'as needed', 'as needed', true);

-- Helen Davis' medications
INSERT INTO medications (patient_id, name, dosage, time, frequency, active)
VALUES
  ('55555555-5555-5555-5555-555555555555', 'Furosemide', '40mg', '08:00', 'daily', true),
  ('55555555-5555-5555-5555-555555555555', 'Carvedilol', '12.5mg', '08:00', 'twice daily', true),
  ('55555555-5555-5555-5555-555555555555', 'Carvedilol', '12.5mg', '20:00', 'twice daily', true),
  ('55555555-5555-5555-5555-555555555555', 'Lisinopril', '5mg', '08:00', 'daily', true),
  ('55555555-5555-5555-5555-555555555555', 'Potassium Chloride', '20mEq', '12:00', 'daily', true);

-- ============================================================================
-- CALL LOGS (Past 7 days of calls)
-- ============================================================================

-- Margaret Johnson's call logs
INSERT INTO call_logs (patient_id, scheduled_at, started_at, ended_at, duration, status, medications, notes)
VALUES
  ('11111111-1111-1111-1111-111111111111', NOW() - INTERVAL '6 hours', NOW() - INTERVAL '6 hours' + INTERVAL '10 seconds', NOW() - INTERVAL '6 hours' + INTERVAL '2 minutes 34 seconds', 154, 'completed', ARRAY['Metformin', 'Lisinopril'], 'Patient confirmed taking medications. Mentioned feeling well today.'),
  ('11111111-1111-1111-1111-111111111111', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day' + INTERVAL '5 seconds', NOW() - INTERVAL '1 day' + INTERVAL '1 minute 45 seconds', 105, 'completed', ARRAY['Metformin'], 'Evening medication confirmed. Patient asked about dinner plans.'),
  ('11111111-1111-1111-1111-111111111111', NOW() - INTERVAL '1 day 6 hours', NULL, NULL, 0, 'missed', ARRAY['Aspirin'], 'No answer after 3 attempts.'),
  ('11111111-1111-1111-1111-111111111111', NOW() - INTERVAL '1 day 5 hours 45 minutes', NOW() - INTERVAL '1 day 5 hours 45 minutes' + INTERVAL '8 seconds', NOW() - INTERVAL '1 day 5 hours 45 minutes' + INTERVAL '1 minute 22 seconds', 82, 'completed', ARRAY['Aspirin'], 'Retry successful. Patient confirmed medication.'),
  ('11111111-1111-1111-1111-111111111111', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days' + INTERVAL '12 seconds', NOW() - INTERVAL '2 days' + INTERVAL '2 minutes 10 seconds', 130, 'completed', ARRAY['Metformin', 'Lisinopril'], 'Morning medications confirmed.');

-- Robert Williams' call logs
INSERT INTO call_logs (patient_id, scheduled_at, started_at, ended_at, duration, status, medications, notes)
VALUES
  ('22222222-2222-2222-2222-222222222222', NOW() - INTERVAL '3 hours', NOW() - INTERVAL '3 hours' + INTERVAL '6 seconds', NOW() - INTERVAL '3 hours' + INTERVAL '3 minutes 15 seconds', 195, 'completed', ARRAY['Warfarin', 'Metoprolol'], 'Patient in great spirits. Confirmed all medications. Discussed upcoming doctor appointment.'),
  ('22222222-2222-2222-2222-222222222222', NOW() - INTERVAL '15 hours', NOW() - INTERVAL '15 hours' + INTERVAL '4 seconds', NOW() - INTERVAL '15 hours' + INTERVAL '1 minute 55 seconds', 115, 'completed', ARRAY['Atorvastatin', 'Metoprolol'], 'Evening medications confirmed. Patient mentioned grandson visiting tomorrow.'),
  ('22222222-2222-2222-2222-222222222222', NOW() - INTERVAL '1 day 3 hours', NOW() - INTERVAL '1 day 3 hours' + INTERVAL '7 seconds', NOW() - INTERVAL '1 day 3 hours' + INTERVAL '2 minutes 8 seconds', 128, 'completed', ARRAY['Warfarin', 'Metoprolol'], 'All medications taken on time.'),
  ('22222222-2222-2222-2222-222222222222', NOW() - INTERVAL '2 days 3 hours', NOW() - INTERVAL '2 days 3 hours' + INTERVAL '5 seconds', NOW() - INTERVAL '2 days 3 hours' + INTERVAL '2 minutes 22 seconds', 142, 'completed', ARRAY['Warfarin', 'Metoprolol'], 'Confirmed medications. Patient asked about weather.');

-- Dorothy Brown's call logs
INSERT INTO call_logs (patient_id, scheduled_at, started_at, ended_at, duration, status, medications, notes)
VALUES
  ('33333333-3333-3333-3333-333333333333', NOW() - INTERVAL '8 hours', NOW() - INTERVAL '8 hours' + INTERVAL '15 seconds', NOW() - INTERVAL '8 hours' + INTERVAL '1 minute 35 seconds', 95, 'completed', ARRAY['Levothyroxine'], 'Early morning medication confirmed.'),
  ('33333333-3333-3333-3333-333333333333', NOW() - INTERVAL '2 hours', NULL, NULL, 0, 'missed', ARRAY['Calcium + Vitamin D'], 'No answer. Alert sent to caregiver Jennifer.'),
  ('33333333-3333-3333-3333-333333333333', NOW() - INTERVAL '1 day 8 hours', NOW() - INTERVAL '1 day 8 hours' + INTERVAL '20 seconds', NOW() - INTERVAL '1 day 8 hours' + INTERVAL '1 minute 12 seconds', 72, 'completed', ARRAY['Levothyroxine'], 'Morning medication taken.'),
  ('33333333-3333-3333-3333-333333333333', NOW() - INTERVAL '1 day 2 hours', NULL, NULL, 0, 'missed', ARRAY['Calcium + Vitamin D'], 'Patient did not answer. Follow-up scheduled.'),
  ('33333333-3333-3333-3333-333333333333', NOW() - INTERVAL '2 days 8 hours', NOW() - INTERVAL '2 days 8 hours' + INTERVAL '10 seconds', NOW() - INTERVAL '2 days 8 hours' + INTERVAL '1 minute 48 seconds', 108, 'completed', ARRAY['Levothyroxine'], 'Confirmed medication.');

-- James Wilson's call logs
INSERT INTO call_logs (patient_id, scheduled_at, started_at, ended_at, duration, status, medications, notes)
VALUES
  ('44444444-4444-4444-4444-444444444444', NOW() - INTERVAL '4 hours', NOW() - INTERVAL '4 hours' + INTERVAL '8 seconds', NOW() - INTERVAL '4 hours' + INTERVAL '2 minutes 45 seconds', 165, 'completed', ARRAY['Tiotropium', 'Metformin'], 'Wife Patricia answered. Confirmed both medications taken.'),
  ('44444444-4444-4444-4444-444444444444', NOW() - INTERVAL '16 hours', NOW() - INTERVAL '16 hours' + INTERVAL '12 seconds', NOW() - INTERVAL '16 hours' + INTERVAL '1 minute 58 seconds', 118, 'completed', ARRAY['Metformin', 'Latanoprost Eye Drops'], 'Evening medications confirmed. Eye drops administered.'),
  ('44444444-4444-4444-4444-444444444444', NOW() - INTERVAL '1 day 4 hours', NOW() - INTERVAL '1 day 4 hours' + INTERVAL '6 seconds', NOW() - INTERVAL '1 day 4 hours' + INTERVAL '2 minutes 12 seconds', 132, 'completed', ARRAY['Tiotropium', 'Metformin'], 'Morning routine completed successfully.');

-- Helen Davis' call logs
INSERT INTO call_logs (patient_id, scheduled_at, started_at, ended_at, duration, status, medications, notes)
VALUES
  ('55555555-5555-5555-5555-555555555555', NOW() - INTERVAL '5 hours', NULL, NULL, 0, 'missed', ARRAY['Furosemide', 'Carvedilol', 'Lisinopril'], 'No answer. Thomas (son) notified.'),
  ('55555555-5555-5555-5555-555555555555', NOW() - INTERVAL '4 hours 30 minutes', NOW() - INTERVAL '4 hours 30 minutes' + INTERVAL '25 seconds', NOW() - INTERVAL '4 hours 30 minutes' + INTERVAL '3 minutes 10 seconds', 190, 'completed', ARRAY['Furosemide', 'Carvedilol', 'Lisinopril'], 'Retry successful. Son Thomas was present and confirmed medications.'),
  ('55555555-5555-5555-5555-555555555555', NOW() - INTERVAL '17 hours', NULL, NULL, 0, 'missed', ARRAY['Carvedilol'], 'Called during nap time. Will reschedule.'),
  ('55555555-5555-5555-5555-555555555555', NOW() - INTERVAL '1 day 5 hours', NULL, NULL, 0, 'missed', ARRAY['Furosemide', 'Carvedilol', 'Lisinopril'], 'No answer after multiple attempts.'),
  ('55555555-5555-5555-5555-555555555555', NOW() - INTERVAL '2 days 5 hours', NOW() - INTERVAL '2 days 5 hours' + INTERVAL '18 seconds', NOW() - INTERVAL '2 days 5 hours' + INTERVAL '2 minutes 35 seconds', 155, 'completed', ARRAY['Furosemide', 'Carvedilol', 'Lisinopril'], 'Morning medications confirmed with assistance.');

-- ============================================================================
-- MEDICAL RECORDS
-- ============================================================================

-- Margaret Johnson's records
INSERT INTO medical_records (patient_id, type, title, description, record_date)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'diagnosis', 'Type 2 Diabetes Mellitus', 'Initial diagnosis. HbA1c: 7.2%. Started on Metformin.', NOW() - INTERVAL '2 years'),
  ('11111111-1111-1111-1111-111111111111', 'diagnosis', 'Essential Hypertension', 'Blood pressure consistently elevated. Started on Lisinopril.', NOW() - INTERVAL '18 months'),
  ('11111111-1111-1111-1111-111111111111', 'test_report', 'Annual Blood Work', 'HbA1c: 6.8%, Cholesterol: 195, BP: 128/82. Good control.', NOW() - INTERVAL '1 month'),
  ('11111111-1111-1111-1111-111111111111', 'prescription', 'Metformin Refill', '90-day supply of Metformin 500mg', NOW() - INTERVAL '2 weeks');

-- Robert Williams' records
INSERT INTO medical_records (patient_id, type, title, description, record_date)
VALUES
  ('22222222-2222-2222-2222-222222222222', 'diagnosis', 'Atrial Fibrillation', 'Paroxysmal AFib detected. Started on anticoagulation therapy.', NOW() - INTERVAL '3 years'),
  ('22222222-2222-2222-2222-222222222222', 'test_report', 'INR Check', 'INR: 2.4 (therapeutic range). Warfarin dose stable.', NOW() - INTERVAL '1 week'),
  ('22222222-2222-2222-2222-222222222222', 'test_report', 'Echocardiogram', 'EF: 55%. No significant structural abnormalities.', NOW() - INTERVAL '3 months');

-- Dorothy Brown's records
INSERT INTO medical_records (patient_id, type, title, description, record_date)
VALUES
  ('33333333-3333-3333-3333-333333333333', 'diagnosis', 'Hypothyroidism', 'TSH elevated. Started on Levothyroxine.', NOW() - INTERVAL '5 years'),
  ('33333333-3333-3333-3333-333333333333', 'test_report', 'DEXA Scan', 'T-score: -2.8 (osteoporosis). Continue Alendronate.', NOW() - INTERVAL '6 months'),
  ('33333333-3333-3333-3333-333333333333', 'test_report', 'Thyroid Panel', 'TSH: 2.1 (normal). Current dose adequate.', NOW() - INTERVAL '2 months');

-- James Wilson's records
INSERT INTO medical_records (patient_id, type, title, description, record_date)
VALUES
  ('44444444-4444-4444-4444-444444444444', 'diagnosis', 'COPD - Moderate', 'FEV1: 62% predicted. Started on Tiotropium.', NOW() - INTERVAL '4 years'),
  ('44444444-4444-4444-4444-444444444444', 'diagnosis', 'Open-Angle Glaucoma', 'IOP elevated bilaterally. Started on Latanoprost.', NOW() - INTERVAL '2 years'),
  ('44444444-4444-4444-4444-444444444444', 'test_report', 'Pulmonary Function Test', 'FEV1: 58% predicted. Slight decline. Continue current therapy.', NOW() - INTERVAL '2 months'),
  ('44444444-4444-4444-4444-444444444444', 'test_report', 'Eye Pressure Check', 'IOP: 16 mmHg (controlled). Continue Latanoprost.', NOW() - INTERVAL '3 weeks');

-- Helen Davis' records
INSERT INTO medical_records (patient_id, type, title, description, record_date)
VALUES
  ('55555555-5555-5555-5555-555555555555', 'diagnosis', 'Congestive Heart Failure', 'NYHA Class II. EF: 40%. Started on Carvedilol and Furosemide.', NOW() - INTERVAL '3 years'),
  ('55555555-5555-5555-5555-555555555555', 'diagnosis', 'Chronic Kidney Disease Stage 3', 'eGFR: 45. Monitor closely with heart failure management.', NOW() - INTERVAL '2 years'),
  ('55555555-5555-5555-5555-555555555555', 'test_report', 'BNP and Renal Panel', 'BNP: 320, Creatinine: 1.4, eGFR: 42. Stable.', NOW() - INTERVAL '2 weeks'),
  ('55555555-5555-5555-5555-555555555555', 'other', 'Cardiology Consultation Notes', 'Continue current regimen. Consider dose adjustment if symptoms worsen.', NOW() - INTERVAL '1 month');

-- ============================================================================
-- TIMELINE EVENTS
-- ============================================================================

-- Margaret Johnson's timeline
INSERT INTO timeline_events (patient_id, type, title, description, event_date)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'note', 'Patient Added', 'Margaret Johnson was added to CuraBot care', NOW() - INTERVAL '45 days'),
  ('11111111-1111-1111-1111-111111111111', 'medication_change', 'Aspirin Added', 'Aspirin 81mg added for cardiovascular protection', NOW() - INTERVAL '30 days'),
  ('11111111-1111-1111-1111-111111111111', 'call', 'Call Completed', 'Morning medication reminder successful', NOW() - INTERVAL '6 hours'),
  ('11111111-1111-1111-1111-111111111111', 'record_added', 'Test Report Added', 'Annual blood work results uploaded', NOW() - INTERVAL '1 month'),
  ('11111111-1111-1111-1111-111111111111', 'health_update', 'Good Progress', 'HbA1c improved from 7.2% to 6.8%', NOW() - INTERVAL '1 month');

-- Robert Williams' timeline
INSERT INTO timeline_events (patient_id, type, title, description, event_date)
VALUES
  ('22222222-2222-2222-2222-222222222222', 'note', 'Patient Added', 'Robert Williams was added to CuraBot care', NOW() - INTERVAL '30 days'),
  ('22222222-2222-2222-2222-222222222222', 'call', 'Call Completed', 'Morning medication reminder successful', NOW() - INTERVAL '3 hours'),
  ('22222222-2222-2222-2222-222222222222', 'record_added', 'INR Check Added', 'Weekly INR monitoring result uploaded', NOW() - INTERVAL '1 week'),
  ('22222222-2222-2222-2222-222222222222', 'health_update', 'INR Stable', 'INR remains in therapeutic range (2.4)', NOW() - INTERVAL '1 week');

-- Dorothy Brown's timeline
INSERT INTO timeline_events (patient_id, type, title, description, event_date)
VALUES
  ('33333333-3333-3333-3333-333333333333', 'note', 'Patient Added', 'Dorothy Brown was added to CuraBot care', NOW() - INTERVAL '60 days'),
  ('33333333-3333-3333-3333-333333333333', 'call', 'Call Missed', 'Midday medication reminder - no answer', NOW() - INTERVAL '2 hours'),
  ('33333333-3333-3333-3333-333333333333', 'note', 'Caregiver Notified', 'Jennifer (daughter) alerted about missed medication', NOW() - INTERVAL '2 hours'),
  ('33333333-3333-3333-3333-333333333333', 'health_update', 'Adherence Concern', 'Multiple missed calls this week. Recommend family meeting.', NOW() - INTERVAL '1 day');

-- James Wilson's timeline
INSERT INTO timeline_events (patient_id, type, title, description, event_date)
VALUES
  ('44444444-4444-4444-4444-444444444444', 'note', 'Patient Added', 'James Wilson was added to CuraBot care', NOW() - INTERVAL '20 days'),
  ('44444444-4444-4444-4444-444444444444', 'call', 'Call Completed', 'Morning medication reminder successful', NOW() - INTERVAL '4 hours'),
  ('44444444-4444-4444-4444-444444444444', 'record_added', 'Eye Pressure Check Added', 'Ophthalmology visit results uploaded', NOW() - INTERVAL '3 weeks'),
  ('44444444-4444-4444-4444-444444444444', 'health_update', 'Glaucoma Controlled', 'IOP within normal limits with current treatment', NOW() - INTERVAL '3 weeks');

-- Helen Davis' timeline
INSERT INTO timeline_events (patient_id, type, title, description, event_date)
VALUES
  ('55555555-5555-5555-5555-555555555555', 'note', 'Patient Added', 'Helen Davis was added to CuraBot care', NOW() - INTERVAL '90 days'),
  ('55555555-5555-5555-5555-555555555555', 'call', 'Call Missed', 'Morning medication reminder - no answer', NOW() - INTERVAL '5 hours'),
  ('55555555-5555-5555-5555-555555555555', 'note', 'Son Notified', 'Thomas Davis contacted regarding missed call', NOW() - INTERVAL '5 hours'),
  ('55555555-5555-5555-5555-555555555555', 'call', 'Call Completed', 'Retry successful with son present', NOW() - INTERVAL '4 hours 30 minutes'),
  ('55555555-5555-5555-5555-555555555555', 'health_update', 'Needs Attention', 'Low adherence rate (65%). Schedule family conference.', NOW() - INTERVAL '1 week'),
  ('55555555-5555-5555-5555-555555555555', 'record_added', 'Cardiology Notes Added', 'Latest consultation notes uploaded', NOW() - INTERVAL '1 month');

-- ============================================================================
-- UPDATE USER_ID TO MATCH YOUR ACTUAL CLERK USER ID
-- ============================================================================
-- After running this seed file, run the following SQL to update the user_id
-- to your actual Clerk user ID. Replace 'your_clerk_user_id' with your real ID.
--
-- UPDATE patients SET user_id = 'your_clerk_user_id' WHERE user_id = 'demo_user';
--
-- You can find your Clerk user ID by:
-- 1. Logging into your app
-- 2. Checking the browser console for the user object
-- 3. Or looking at the Clerk dashboard under Users
-- ============================================================================
