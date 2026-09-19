-- ============================================================
-- Brislane Lending Platform — Database Schema
-- Phase 4: Database Testing & Test Data Management
-- Run this FIRST before seed.sql
-- ============================================================

-- Customers
CREATE TABLE IF NOT EXISTS customers (
    id VARCHAR(10) PRIMARY KEY,           -- Format: C1XXXXXX
    email VARCHAR(255) NOT NULL UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL,
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    postcode VARCHAR(10),
    status VARCHAR(20) DEFAULT 'active',  -- active, suspended, closed
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Loan Applications
CREATE TABLE IF NOT EXISTS loan_applications (
    id VARCHAR(20) PRIMARY KEY,           -- Format: LA-YYYY-XXXXX
    customer_id VARCHAR(10) NOT NULL REFERENCES customers(id),
    loan_amount DECIMAL(10,2) NOT NULL,
    loan_term_months INTEGER NOT NULL,
    purpose VARCHAR(100),
    status VARCHAR(30) DEFAULT 'draft',   -- draft, submitted, approved, declined, funded, cancelled
    interest_rate DECIMAL(5,2),
    monthly_payment DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT NOW(),
    submitted_at TIMESTAMP,
    decided_at TIMESTAMP,
    funded_at TIMESTAMP
);

-- Payments
CREATE TABLE IF NOT EXISTS payments (
    id VARCHAR(20) PRIMARY KEY,           -- Format: PAY-XXXXX
    loan_application_id VARCHAR(20) NOT NULL REFERENCES loan_applications(id),
    amount DECIMAL(10,2) NOT NULL,
    due_date DATE NOT NULL,
    paid_date DATE,
    status VARCHAR(20) DEFAULT 'pending', -- pending, paid, overdue, cancelled
    created_at TIMESTAMP DEFAULT NOW()
);

-- Audit Log (FCA requirement — 4 events per loan application)
CREATE TABLE IF NOT EXISTS audit_log (
    id SERIAL PRIMARY KEY,
    loan_application_id VARCHAR(20) NOT NULL REFERENCES loan_applications(id),
    event_type VARCHAR(50) NOT NULL,      -- application_created, submitted, decision_made, funded
    event_data JSONB,
    created_by VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Fraud Checks (populated by async job — may lag by up to 5 minutes)
CREATE TABLE IF NOT EXISTS fraud_checks (
    id SERIAL PRIMARY KEY,
    loan_application_id VARCHAR(20) NOT NULL REFERENCES loan_applications(id),
    check_status VARCHAR(20) DEFAULT 'clear', -- clear, flagged, review
    risk_score INTEGER,                   -- 0-100
    checked_at TIMESTAMP DEFAULT NOW(),
    notes TEXT
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_loan_customer ON loan_applications(customer_id);
CREATE INDEX IF NOT EXISTS idx_audit_loan ON audit_log(loan_application_id);
CREATE INDEX IF NOT EXISTS idx_audit_event ON audit_log(event_type);
CREATE INDEX IF NOT EXISTS idx_payments_loan ON payments(loan_application_id);
CREATE INDEX IF NOT EXISTS idx_fraud_loan ON fraud_checks(loan_application_id);

-- ============================================================
-- VERIFICATION QUERY — run after schema creation
-- Should return 5 tables
-- ============================================================
-- SELECT table_name FROM information_schema.tables
-- WHERE table_schema = 'public'
-- ORDER BY table_name;
