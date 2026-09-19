-- ============================================================
-- Brislane Lending Platform — Phase 4 Validation Queries
-- Run these against your Neon database after seeding
-- These are the queries you need for your submission
-- ============================================================

-- ============================================================
-- QUERY 1: Customer Validation
-- Confirms customers table has expected records
-- ============================================================
SELECT 
    id,
    email,
    first_name,
    last_name,
    status,
    created_at
FROM customers
WHERE id LIKE 'C1TEST%'
ORDER BY id;
-- Expected: 5 rows, C1TEST001-C1TEST005

-- ============================================================
-- QUERY 2: Loan Application Validation
-- Confirms loans link correctly to customers
-- ============================================================
SELECT 
    la.id AS loan_id,
    la.customer_id,
    c.first_name || ' ' || c.last_name AS customer_name,
    la.loan_amount,
    la.status,
    la.created_at
FROM loan_applications la
JOIN customers c ON la.customer_id = c.id
WHERE la.id LIKE 'LA-TEST-%'
ORDER BY la.id;
-- Expected: 5 rows, all with valid customer links

-- ============================================================
-- QUERY 3: Payment Validation
-- Confirms payments link correctly to loan applications
-- ============================================================
SELECT 
    p.id AS payment_id,
    p.loan_application_id,
    p.amount,
    p.due_date,
    p.status
FROM payments p
JOIN loan_applications la ON p.loan_application_id = la.id
WHERE p.id LIKE 'PAY-TEST-%'
ORDER BY p.loan_application_id, p.due_date;
-- Expected: 6 payment rows

-- ============================================================
-- QUERY 4: AUDIT LOG INTEGRITY (FCA Required)
-- Finds loan applications with fewer than 4 audit events
-- This is the key regulatory validation query
-- ============================================================
SELECT 
    la.id,
    la.status,
    COUNT(al.event_type) AS event_count,
    STRING_AGG(al.event_type, ', ' ORDER BY al.created_at) AS events_present,
    CASE 
        WHEN la.status = 'funded'   AND COUNT(al.event_type) < 4 THEN '❌ REGULATORY GAP'
        WHEN la.status = 'declined' AND COUNT(al.event_type) < 3 THEN '❌ REGULATORY GAP'
        WHEN la.status = 'draft'    AND COUNT(al.event_type) < 1 THEN '❌ REGULATORY GAP'
        ELSE '✅ OK'
    END AS audit_status
FROM loan_applications la
LEFT JOIN audit_log al ON la.id = al.loan_application_id
WHERE la.id LIKE 'LA-TEST-%'
GROUP BY la.id, la.status
ORDER BY la.id;
-- Expected: LA-TEST-00005 shows REGULATORY GAP (funded but only 3 events)

-- ============================================================
-- QUERY 5: Fraud Check Validation
-- Finds loans missing fraud check (accounting for async lag)
-- ============================================================
SELECT 
    la.id,
    la.status,
    la.created_at,
    fc.check_status,
    fc.risk_score
FROM loan_applications la
LEFT JOIN fraud_checks fc ON la.id = fc.loan_application_id
WHERE la.id LIKE 'LA-TEST-%'
ORDER BY la.id;
-- Expected: LA-TEST-00004 has NULL fraud check values (async lag)

-- ============================================================
-- QUERY 6: Cross-table integrity check
-- customer_id consistency across all tables
-- ============================================================
SELECT 
    c.id AS customer_id,
    c.first_name,
    COUNT(DISTINCT la.id) AS loan_count,
    COUNT(DISTINCT p.id) AS payment_count
FROM customers c
LEFT JOIN loan_applications la ON c.id = la.customer_id
LEFT JOIN payments p ON la.id = p.loan_application_id
WHERE c.id LIKE 'C1TEST%'
GROUP BY c.id, c.first_name
ORDER BY c.id;
