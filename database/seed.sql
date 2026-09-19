-- ============================================================
-- Brislane Lending Platform — Test Data Seed
-- Phase 4: Database Testing & Test Data Management
-- Run AFTER schema.sql
-- WARNING: DO NOT run seed_legacy.sql — it will corrupt data
-- ============================================================

-- Clear existing test data (safe to re-run)
DELETE FROM fraud_checks WHERE loan_application_id LIKE 'LA-TEST-%';
DELETE FROM audit_log WHERE loan_application_id LIKE 'LA-TEST-%';
DELETE FROM payments WHERE loan_application_id LIKE 'LA-TEST-%';
DELETE FROM loan_applications WHERE id LIKE 'LA-TEST-%';
DELETE FROM customers WHERE id LIKE 'C1TEST%';

-- ============================================================
-- CUSTOMERS (synthetic data — no real PII)
-- ============================================================
INSERT INTO customers (id, email, first_name, last_name, date_of_birth, address_line1, city, postcode, status) VALUES
('C1TEST001', 'john.smith.test@brislane-qa.com',   'John',   'Smith',   '1985-03-15', '12 Oak Street',    'London',     'EC1A 1BB', 'active'),
('C1TEST002', 'sarah.jones.test@brislane-qa.com',  'Sarah',  'Jones',   '1990-07-22', '45 Maple Avenue',  'Manchester', 'M1 1AE',  'active'),
('C1TEST003', 'david.brown.test@brislane-qa.com',  'David',  'Brown',   '1978-11-08', '78 Elm Road',      'Birmingham', 'B1 1BB',  'active'),
('C1TEST004', 'emma.wilson.test@brislane-qa.com',  'Emma',   'Wilson',  '1995-02-14', '23 Pine Lane',     'Bristol',    'BS1 1AA', 'active'),
('C1TEST005', 'james.taylor.test@brislane-qa.com', 'James',  'Taylor',  '1982-09-30', '56 Cedar Close',   'Leeds',      'LS1 1AB', 'suspended');

-- ============================================================
-- LOAN APPLICATIONS
-- Mix of statuses to test different validation scenarios
-- ============================================================
INSERT INTO loan_applications (id, customer_id, loan_amount, loan_term_months, purpose, status, interest_rate, monthly_payment, created_at, submitted_at, decided_at, funded_at) VALUES
-- Complete journey (all 4 audit events should exist)
('LA-TEST-00001', 'C1TEST001', 5000.00,  24, 'home_improvement', 'funded',   8.9,  229.50, '2026-04-15 09:00:00', '2026-04-15 09:45:00', '2026-04-15 11:00:00', '2026-04-16 10:00:00'),
('LA-TEST-00002', 'C1TEST002', 10000.00, 36, 'debt_consolidation','funded',  12.5,  334.22, '2026-04-20 14:00:00', '2026-04-20 14:30:00', '2026-04-20 16:00:00', '2026-04-21 09:00:00'),
-- Declined (should have: created, submitted, decision — NOT funded)
('LA-TEST-00003', 'C1TEST003', 25000.00, 60, 'vehicle_purchase',  'declined', NULL, NULL,   '2026-05-01 10:00:00', '2026-05-01 10:20:00', '2026-05-01 12:00:00', NULL),
-- Draft (should have: created only)
('LA-TEST-00004', 'C1TEST004', 3000.00,  12, 'holiday',           'draft',    NULL, NULL,   '2026-06-10 16:00:00', NULL,                  NULL,                  NULL),
-- DELIBERATE GAP: missing funded audit event (regulatory finding)
('LA-TEST-00005', 'C1TEST001', 7500.00,  24, 'home_improvement',  'funded',   9.5,  346.25, '2026-06-01 09:00:00', '2026-06-01 09:30:00', '2026-06-01 11:00:00', '2026-06-02 10:00:00');

-- ============================================================
-- AUDIT LOG
-- LA-TEST-00001: all 4 events ✅
-- LA-TEST-00002: all 4 events ✅
-- LA-TEST-00003: 3 events (no funded — correctly declined) ✅
-- LA-TEST-00004: 1 event (draft — correctly only created) ✅
-- LA-TEST-00005: only 3 events — MISSING funded event ❌ (regulatory gap to find)
-- ============================================================
INSERT INTO audit_log (loan_application_id, event_type, created_by, created_at) VALUES
-- LA-TEST-00001 (complete)
('LA-TEST-00001', 'application_created', 'system',        '2026-04-15 09:00:00'),
('LA-TEST-00001', 'submitted',           'C1TEST001',     '2026-04-15 09:45:00'),
('LA-TEST-00001', 'decision_made',       'decisioning',   '2026-04-15 11:00:00'),
('LA-TEST-00001', 'funded',              'payments-svc',  '2026-04-16 10:00:00'),
-- LA-TEST-00002 (complete)
('LA-TEST-00002', 'application_created', 'system',        '2026-04-20 14:00:00'),
('LA-TEST-00002', 'submitted',           'C1TEST002',     '2026-04-20 14:30:00'),
('LA-TEST-00002', 'decision_made',       'decisioning',   '2026-04-20 16:00:00'),
('LA-TEST-00002', 'funded',              'payments-svc',  '2026-04-21 09:00:00'),
-- LA-TEST-00003 (declined — no funded)
('LA-TEST-00003', 'application_created', 'system',        '2026-05-01 10:00:00'),
('LA-TEST-00003', 'submitted',           'C1TEST003',     '2026-05-01 10:20:00'),
('LA-TEST-00003', 'decision_made',       'decisioning',   '2026-05-01 12:00:00'),
-- LA-TEST-00004 (draft — created only)
('LA-TEST-00004', 'application_created', 'system',        '2026-06-10 16:00:00'),
-- LA-TEST-00005 (funded but MISSING funded audit event — regulatory gap)
('LA-TEST-00005', 'application_created', 'system',        '2026-06-01 09:00:00'),
('LA-TEST-00005', 'submitted',           'C1TEST001',     '2026-06-01 09:30:00'),
('LA-TEST-00005', 'decision_made',       'decisioning',   '2026-06-01 11:00:00');
-- NOTE: funded event deliberately missing for LA-TEST-00005

-- ============================================================
-- PAYMENTS (for funded loans only)
-- ============================================================
INSERT INTO payments (id, loan_application_id, amount, due_date, status) VALUES
('PAY-TEST-001', 'LA-TEST-00001', 229.50, '2026-05-15', 'paid'),
('PAY-TEST-002', 'LA-TEST-00001', 229.50, '2026-06-15', 'paid'),
('PAY-TEST-003', 'LA-TEST-00001', 229.50, '2026-07-15', 'pending'),
('PAY-TEST-004', 'LA-TEST-00002', 334.22, '2026-05-20', 'paid'),
('PAY-TEST-005', 'LA-TEST-00002', 334.22, '2026-06-20', 'pending'),
('PAY-TEST-006', 'LA-TEST-00005', 346.25, '2026-07-01', 'pending');

-- ============================================================
-- FRAUD CHECKS
-- LA-TEST-00004 deliberately missing (async lag scenario)
-- ============================================================
INSERT INTO fraud_checks (loan_application_id, check_status, risk_score, checked_at) VALUES
('LA-TEST-00001', 'clear',   12, '2026-04-15 09:05:00'),
('LA-TEST-00002', 'clear',   8,  '2026-04-20 14:05:00'),
('LA-TEST-00003', 'flagged', 72, '2026-05-01 10:05:00'),
('LA-TEST-00005', 'clear',   15, '2026-06-01 09:05:00');
-- LA-TEST-00004 has no fraud check yet (simulates async lag Sandra mentioned)

-- ============================================================
-- VERIFICATION QUERIES — run these after seeding to confirm
-- ============================================================

-- 1. Check all 5 customers exist
-- SELECT COUNT(*) FROM customers WHERE id LIKE 'C1TEST%';
-- Expected: 5

-- 2. Check audit log integrity (the key Phase 4 query)
-- SELECT la.id, la.status, COUNT(al.event_type) as event_count
-- FROM loan_applications la
-- LEFT JOIN audit_log al ON la.id = al.loan_application_id
-- WHERE la.id LIKE 'LA-TEST-%'
-- GROUP BY la.id, la.status
-- ORDER BY la.id;
-- Expected: LA-TEST-00005 funded loan shows 3 events (missing funded = regulatory gap)

-- 3. Check missing fraud check (async lag scenario)
-- SELECT la.id FROM loan_applications la
-- LEFT JOIN fraud_checks fc ON la.id = fc.loan_application_id
-- WHERE fc.id IS NULL AND la.id LIKE 'LA-TEST-%';
-- Expected: LA-TEST-00004
