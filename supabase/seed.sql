-- CuraBot Seed Data
-- Run this SQL in the Supabase SQL Editor after running schema.sql
-- User ID: user_36hJYD8IG4qDV9suaMQgNhIxMue

-- ============================================================================
-- CLEAR EXISTING DATA
-- ============================================================================
DELETE FROM timeline_events;
DELETE FROM call_logs;
DELETE FROM medical_records;
DELETE FROM medications;
DELETE FROM patients;

-- ============================================================================
-- MOCK PATIENTS (5 elderly patients)
-- ============================================================================

INSERT INTO patients (id, user_id, name, phone, age, emergency_contact, emergency_phone, medical_conditions, notes, status, adherence_rate, created_at)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'user_36hJYD8IG4qDV9suaMQgNhIxMue', 'Margaret Johnson', '+1 (555) 123-4567', 78, 'Sarah Johnson (Daughter)', '+1 (555) 987-6543', 'Type 2 Diabetes, Hypertension, Mild Arthritis', 'Prefers morning calls. Hard of hearing - speak slowly and clearly.', 'active', 94, NOW() - INTERVAL '45 days'),
  
  ('22222222-2222-2222-2222-222222222222', 'user_36hJYD8IG4qDV9suaMQgNhIxMue', 'Robert Williams', '+1 (555) 234-5678', 82, 'Michael Williams (Son)', '+1 (555) 876-5432', 'Atrial Fibrillation, High Cholesterol', 'Very punctual with medications. Likes to chat during calls.', 'active', 98, NOW() - INTERVAL '30 days'),
  
  ('33333333-3333-3333-3333-333333333333', 'user_36hJYD8IG4qDV9suaMQgNhIxMue', 'Dorothy Brown', '+1 (555) 345-6789', 75, 'Jennifer Brown (Daughter)', '+1 (555) 765-4321', 'Hypothyroidism, Osteoporosis', 'Sometimes forgets evening medications. May need follow-up calls.', 'active', 78, NOW() - INTERVAL '60 days'),
  
  ('44444444-4444-4444-4444-444444444444', 'user_36hJYD8IG4qDV9suaMQgNhIxMue', 'James Wilson', '+1 (555) 456-7890', 80, 'Patricia Wilson (Wife)', '+1 (555) 654-3210', 'COPD, Type 2 Diabetes, Glaucoma', 'Wife usually helps with medications. Call her if no answer.', 'active', 88, NOW() - INTERVAL '20 days'),
  
  ('55555555-5555-5555-5555-555555555555', 'user_36hJYD8IG4qDV9suaMQgNhIxMue', 'Helen Davis', '+1 (555) 567-8901', 85, 'Thomas Davis (Son)', '+1 (555) 543-2109', 'Congestive Heart Failure, Chronic Kidney Disease', 'Requires careful medication timing. Do not call during nap time (2-4 PM).', 'needs_attention', 65, NOW() - INTERVAL '90 days');

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
INSERT INTO call_logs (patient_id, scheduled_at, started_at, ended_at, duration, status, medications, notes, transcript)
VALUES
  ('11111111-1111-1111-1111-111111111111', NOW() - INTERVAL '6 hours', NOW() - INTERVAL '6 hours' + INTERVAL '10 seconds', NOW() - INTERVAL '6 hours' + INTERVAL '2 minutes 34 seconds', 154, 'completed', ARRAY['Metformin', 'Lisinopril'], 'Patient confirmed taking medications. Mentioned feeling well today.',
   'Agent: Good morning! This is CuraBot calling with your medication reminder.
User: Oh hello, thank you for calling.
Agent: I hope you''re doing well today. I''m calling to remind you about your morning medications - Metformin 500mg and Lisinopril 10mg.
User: Yes, I have them right here. Let me take them now.
Agent: That''s wonderful. Have you taken them with food as recommended?
User: Yes, I just finished breakfast. I''m feeling much better this week.
Agent: I''m glad to hear you''re feeling better! Is there anything else I can help you with today?
User: No, thank you. I appreciate these reminder calls.
Agent: You''re welcome! Have a great day, and don''t forget your evening Metformin dose.'),
  
  ('11111111-1111-1111-1111-111111111111', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day' + INTERVAL '5 seconds', NOW() - INTERVAL '1 day' + INTERVAL '1 minute 45 seconds', 105, 'completed', ARRAY['Metformin'], 'Evening medication confirmed. Patient asked about dinner plans.',
   'Agent: Good evening! This is your medication reminder from CuraBot.
User: Hello, is it time for my medicine already?
Agent: Yes, it''s time for your evening Metformin 500mg dose.
User: Okay, I''ll take it right now. What should I have for dinner?
Agent: I recommend taking it with your dinner. A balanced meal with vegetables would be great for managing your diabetes.
User: Thank you, I''ll do that.
Agent: Excellent! Have a good evening.'),

  ('11111111-1111-1111-1111-111111111111', NOW() - INTERVAL '1 day 6 hours', NULL, NULL, 0, 'missed', ARRAY['Aspirin'], 'No answer after 3 attempts.', NULL),
  
  ('11111111-1111-1111-1111-111111111111', NOW() - INTERVAL '1 day 5 hours 45 minutes', NOW() - INTERVAL '1 day 5 hours 45 minutes' + INTERVAL '8 seconds', NOW() - INTERVAL '1 day 5 hours 45 minutes' + INTERVAL '1 minute 22 seconds', 82, 'completed', ARRAY['Aspirin'], 'Retry successful. Patient confirmed medication.',
   'Agent: Hello, this is CuraBot calling again about your midday medication.
User: Sorry I missed your earlier call, I was in the garden.
Agent: No problem! I''m calling to remind you about your Aspirin 81mg.
User: Oh yes, let me get that now. I took it with my lunch.
Agent: Perfect! Taking it with food is recommended. Have a nice afternoon!
User: Thank you!'),

  ('11111111-1111-1111-1111-111111111111', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days' + INTERVAL '12 seconds', NOW() - INTERVAL '2 days' + INTERVAL '2 minutes 10 seconds', 130, 'completed', ARRAY['Metformin', 'Lisinopril'], 'Morning medications confirmed.',
   'Agent: Good morning! CuraBot here with your medication reminder.
User: Good morning, I was just about to take my pills.
Agent: Great timing! Today you need Metformin 500mg and Lisinopril 10mg.
User: Yes, I have them both here. My blood pressure has been good lately.
Agent: That''s excellent news! The Lisinopril is helping manage your hypertension well.
User: Thank you for the reminder. These calls really help me stay on track.
Agent: I''m glad we can help! Have a wonderful day.');

-- Robert Williams' call logs
INSERT INTO call_logs (patient_id, scheduled_at, started_at, ended_at, duration, status, medications, notes, transcript)
VALUES
  ('22222222-2222-2222-2222-222222222222', NOW() - INTERVAL '3 hours', NOW() - INTERVAL '3 hours' + INTERVAL '6 seconds', NOW() - INTERVAL '3 hours' + INTERVAL '3 minutes 15 seconds', 195, 'completed', ARRAY['Warfarin', 'Metoprolol'], 'Patient in great spirits. Confirmed all medications. Discussed upcoming doctor appointment.',
   'Agent: Good morning Mr. Williams! This is CuraBot with your medication reminder.
User: Hello there! I was expecting your call.
Agent: Wonderful! It''s time for your Warfarin 5mg and Metoprolol 25mg.
User: Already taken! I set an alarm before your call.
Agent: Excellent discipline! That''s great for managing your atrial fibrillation.
User: Thank you. I have a doctor appointment next week for my INR check.
Agent: That''s very important. Your Warfarin levels need regular monitoring.
User: Yes, my grandson is taking me. He''s visiting this weekend!
Agent: How lovely! Enjoy your time with family. Take care!'),

  ('22222222-2222-2222-2222-222222222222', NOW() - INTERVAL '15 hours', NOW() - INTERVAL '15 hours' + INTERVAL '4 seconds', NOW() - INTERVAL '15 hours' + INTERVAL '1 minute 55 seconds', 115, 'completed', ARRAY['Atorvastatin', 'Metoprolol'], 'Evening medications confirmed. Patient mentioned grandson visiting tomorrow.',
   'Agent: Good evening! CuraBot here for your evening medication reminder.
User: Hello! Time for my nighttime pills.
Agent: Yes, time for Atorvastatin 20mg and Metoprolol 25mg.
User: Taking them now. My grandson arrives tomorrow!
Agent: How exciting! Make sure to take your medications on time even with visitors.
User: I will. Thank you for the reminder.
Agent: Have a great evening!'),

  ('22222222-2222-2222-2222-222222222222', NOW() - INTERVAL '1 day 3 hours', NOW() - INTERVAL '1 day 3 hours' + INTERVAL '7 seconds', NOW() - INTERVAL '1 day 3 hours' + INTERVAL '2 minutes 8 seconds', 128, 'completed', ARRAY['Warfarin', 'Metoprolol'], 'All medications taken on time.',
   'Agent: Good morning! This is your CuraBot medication reminder.
User: Good morning! I''m ready for my medications.
Agent: Perfect! Warfarin 5mg and Metoprolol 25mg today.
User: Confirmed, I just took them.
Agent: Excellent! Keep up the great work with your medication schedule.
User: Thank you!'),

  ('22222222-2222-2222-2222-222222222222', NOW() - INTERVAL '2 days 3 hours', NOW() - INTERVAL '2 days 3 hours' + INTERVAL '5 seconds', NOW() - INTERVAL '2 days 3 hours' + INTERVAL '2 minutes 22 seconds', 142, 'completed', ARRAY['Warfarin', 'Metoprolol'], 'Confirmed medications. Patient asked about weather.',
   'Agent: Good morning Mr. Williams! CuraBot calling with your reminder.
User: Hello! Nice to hear from you. How''s the weather looking today?
Agent: I''m here to help with medications, but I hope you have a sunny day! Time for Warfarin and Metoprolol.
User: Ah yes, taking them now. I like to sit on the porch after breakfast.
Agent: That sounds lovely! Fresh air is good for you. Medications confirmed?
User: Yes, all done. Thank you!');

-- Dorothy Brown's call logs (lower adherence - shows concern patterns)
INSERT INTO call_logs (patient_id, scheduled_at, started_at, ended_at, duration, status, medications, notes, transcript)
VALUES
  ('33333333-3333-3333-3333-333333333333', NOW() - INTERVAL '8 hours', NOW() - INTERVAL '8 hours' + INTERVAL '15 seconds', NOW() - INTERVAL '8 hours' + INTERVAL '1 minute 35 seconds', 95, 'completed', ARRAY['Levothyroxine'], 'Early morning medication confirmed.',
   'Agent: Good morning! CuraBot here for your early medication reminder.
User: Hello, yes I know I need to take my thyroid medicine.
Agent: That''s right, Levothyroxine 50mcg. Remember to take it on an empty stomach.
User: I haven''t eaten yet, so I''ll take it now.
Agent: Perfect! Wait at least 30 minutes before eating.
User: I will. Thank you.
Agent: Have a great morning!'),

  ('33333333-3333-3333-3333-333333333333', NOW() - INTERVAL '2 hours', NULL, NULL, 0, 'missed', ARRAY['Calcium + Vitamin D'], 'No answer. Alert sent to caregiver Jennifer.', NULL),

  ('33333333-3333-3333-3333-333333333333', NOW() - INTERVAL '1 day 8 hours', NOW() - INTERVAL '1 day 8 hours' + INTERVAL '20 seconds', NOW() - INTERVAL '1 day 8 hours' + INTERVAL '1 minute 12 seconds', 72, 'completed', ARRAY['Levothyroxine'], 'Morning medication taken.',
   'Agent: Good morning! This is CuraBot with your medication reminder.
User: Oh, is it that time already? I almost forgot.
Agent: Yes, it''s time for your Levothyroxine. Have you eaten yet?
User: No, I was about to make breakfast.
Agent: Perfect timing! Take it now, wait 30 minutes, then have breakfast.
User: Okay, taking it now.
Agent: Great! Talk to you later for your midday reminder.'),

  ('33333333-3333-3333-3333-333333333333', NOW() - INTERVAL '1 day 2 hours', NULL, NULL, 0, 'missed', ARRAY['Calcium + Vitamin D'], 'Patient did not answer. Follow-up scheduled.', NULL),

  ('33333333-3333-3333-3333-333333333333', NOW() - INTERVAL '2 days 8 hours', NOW() - INTERVAL '2 days 8 hours' + INTERVAL '10 seconds', NOW() - INTERVAL '2 days 8 hours' + INTERVAL '1 minute 48 seconds', 108, 'completed', ARRAY['Levothyroxine'], 'Confirmed medication.',
   'Agent: Good morning! CuraBot calling for your medication reminder.
User: Hello, I was waiting for your call.
Agent: Wonderful! Time for your Levothyroxine 50mcg.
User: I remember, empty stomach. I''ll take it now.
Agent: Excellent! Your thyroid levels will thank you.
User: Thank you for keeping me on track.');

-- James Wilson's call logs (with caregiver involvement)
INSERT INTO call_logs (patient_id, scheduled_at, started_at, ended_at, duration, status, medications, notes, transcript)
VALUES
  ('44444444-4444-4444-4444-444444444444', NOW() - INTERVAL '4 hours', NOW() - INTERVAL '4 hours' + INTERVAL '8 seconds', NOW() - INTERVAL '4 hours' + INTERVAL '2 minutes 45 seconds', 165, 'completed', ARRAY['Tiotropium', 'Metformin'], 'Wife Patricia answered. Confirmed both medications taken.',
   'Agent: Good morning! This is CuraBot calling for James Wilson''s medication reminder.
User: Hello, this is Patricia, his wife. James is right here.
Agent: Hello Patricia! It''s time for James'' Tiotropium inhaler and Metformin.
User: Yes, I just helped him with the inhaler. He''s taking the Metformin now.
Agent: Wonderful! How is his breathing today?
User: Much better than last week. The Tiotropium really helps his COPD.
Agent: That''s great to hear! Any issues with the eye drops?
User: No, we do those at night. No problems.
Agent: Excellent! You''re doing a great job helping James. Have a good day!'),

  ('44444444-4444-4444-4444-444444444444', NOW() - INTERVAL '16 hours', NOW() - INTERVAL '16 hours' + INTERVAL '12 seconds', NOW() - INTERVAL '16 hours' + INTERVAL '1 minute 58 seconds', 118, 'completed', ARRAY['Metformin', 'Latanoprost Eye Drops'], 'Evening medications confirmed. Eye drops administered.',
   'Agent: Good evening! CuraBot here for James'' evening medications.
User: Hello, James speaking. My wife is helping me.
Agent: Hello James! Time for your Metformin and Latanoprost eye drops.
User: Yes, taking the Metformin now. Patricia will help with the drops.
Agent: Wonderful! The eye drops are important for your glaucoma.
User: I know, we never miss them. Patricia makes sure of it.
Agent: You have great support! Take care and sleep well.'),

  ('44444444-4444-4444-4444-444444444444', NOW() - INTERVAL '1 day 4 hours', NOW() - INTERVAL '1 day 4 hours' + INTERVAL '6 seconds', NOW() - INTERVAL '1 day 4 hours' + INTERVAL '2 minutes 12 seconds', 132, 'completed', ARRAY['Tiotropium', 'Metformin'], 'Morning routine completed successfully.',
   'Agent: Good morning! This is CuraBot for your medication reminder.
User: Good morning! Patricia and I are ready.
Agent: Excellent! Tiotropium inhaler and Metformin this morning.
User: Using the inhaler now... okay, done. Metformin next.
Agent: Perfect technique! Your COPD management is on track.
User: Thank you. We appreciate these calls.
Agent: Happy to help! Have a wonderful day.');

-- Helen Davis' call logs (critical scenario - lowest adherence, health concerns)
INSERT INTO call_logs (patient_id, scheduled_at, started_at, ended_at, duration, status, medications, notes, transcript)
VALUES
  ('55555555-5555-5555-5555-555555555555', NOW() - INTERVAL '5 hours', NULL, NULL, 0, 'missed', ARRAY['Furosemide', 'Carvedilol', 'Lisinopril'], 'No answer. Thomas (son) notified.', NULL),

  ('55555555-5555-5555-5555-555555555555', NOW() - INTERVAL '4 hours 30 minutes', NOW() - INTERVAL '4 hours 30 minutes' + INTERVAL '25 seconds', NOW() - INTERVAL '4 hours 30 minutes' + INTERVAL '3 minutes 10 seconds', 190, 'completed', ARRAY['Furosemide', 'Carvedilol', 'Lisinopril'], 'Retry successful. Son Thomas was present and confirmed medications.',
   'Agent: Hello, this is CuraBot calling back for Helen Davis''s medication reminder.
User: Hello, this is Thomas, her son. Mom is here with me now.
Agent: Hello Thomas! We missed Helen earlier. It''s important she takes her heart medications.
User: I know, I came right over when I got the alert. She''s a bit tired today.
Agent: I understand. She needs Furosemide, Carvedilol, and Lisinopril for her heart condition.
User: Mom, here are your pills. She''s taking them now with water.
Agent: Excellent. Is she experiencing any swelling in her legs or shortness of breath?
User: A little swelling, but not as bad as last week. She says she''s feeling weak though.
Agent: Please monitor her closely. If the swelling worsens or she has chest pain or severe breathing problems, seek emergency care immediately.
User: I will. I''m staying with her today. Thank you for the follow-up.
Agent: You''re doing great, Thomas. Don''t hesitate to call her doctor if anything concerns you.'),

  ('55555555-5555-5555-5555-555555555555', NOW() - INTERVAL '17 hours', NULL, NULL, 0, 'missed', ARRAY['Carvedilol'], 'Called during nap time. Will reschedule.', NULL),

  ('55555555-5555-5555-5555-555555555555', NOW() - INTERVAL '1 day 5 hours', NULL, NULL, 0, 'missed', ARRAY['Furosemide', 'Carvedilol', 'Lisinopril'], 'No answer after multiple attempts.', NULL),

  ('55555555-5555-5555-5555-555555555555', NOW() - INTERVAL '2 days 5 hours', NOW() - INTERVAL '2 days 5 hours' + INTERVAL '18 seconds', NOW() - INTERVAL '2 days 5 hours' + INTERVAL '2 minutes 35 seconds', 155, 'completed', ARRAY['Furosemide', 'Carvedilol', 'Lisinopril'], 'Morning medications confirmed with assistance.',
   'Agent: Good morning Helen! This is CuraBot with your medication reminder.
User: Hello dear. My son Thomas is helping me today.
Agent: That''s wonderful! It''s time for your heart medications - Furosemide, Carvedilol, and Lisinopril.
User: Thomas is getting them for me now. I''ve been feeling a bit dizzy lately.
Agent: Dizziness can sometimes occur with these medications. Are you staying hydrated?
User: I try to, but I forget sometimes.
Agent: It''s very important with the Furosemide. Please drink water throughout the day but not too much before bed.
User: Okay, I''ll remember. Thomas wrote it down for me.
Agent: That''s helpful! If the dizziness continues or worsens, please contact your doctor.
User: I will. Thank you for caring.');

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


