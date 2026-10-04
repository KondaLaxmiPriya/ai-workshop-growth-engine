-- ============================================================================
-- AI Workshop Growth Engine: Production Database Schema (PostgreSQL / Supabase)
-- Target: 500 Final-Year Engineering Students in 7 Days (₹2,000 Budget)
-- ============================================================================

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. CAMPAIGNS TABLE
CREATE TABLE IF NOT EXISTS campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL DEFAULT 'Build Your First AI Project in 60 Minutes',
    target_registrations INT NOT NULL DEFAULT 500,
    budget NUMERIC(10, 2) NOT NULL DEFAULT 2000.00,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    workshop_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. STUDENTS TABLE (Registrations)
CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(50) NOT NULL,
    college VARCHAR(255) NOT NULL,
    branch VARCHAR(100) NOT NULL,
    graduation_year VARCHAR(10) NOT NULL,
    skill_level VARCHAR(50) DEFAULT 'Beginner', -- Beginner, Intermediate, Advanced
    preferred_technology VARCHAR(50) DEFAULT 'Python', -- Python, Java, JavaScript, C/C++, Other
    referral_code VARCHAR(50) NOT NULL UNIQUE,
    referred_by VARCHAR(50), -- Referral code of the referrer, if any
    source VARCHAR(100) DEFAULT 'Direct', -- WhatsApp, College Club, Referral, LinkedIn, Instagram, Email, Other
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(100),
    utm_content VARCHAR(100),
    referrals_count INT DEFAULT 0,
    leaderboard_visible BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. REFERRALS TABLE (Audit trail of confirmed referrals)
CREATE TABLE IF NOT EXISTS referrals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    referrer_student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    referred_student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    referral_code VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'confirmed', -- confirmed, pending, duplicate_rejected
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_referred_student UNIQUE (referred_student_id)
);

-- 4. EXPENSES TABLE (Budget allocation)
CREATE TABLE IF NOT EXISTS expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID REFERENCES campaigns(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    channel VARCHAR(100) NOT NULL, -- Instagram, Student Creator, WhatsApp Booster, Referral Incentive, Other
    amount NUMERIC(10, 2) NOT NULL,
    date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. ADMIN USERS TABLE
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'growth_admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE & SEARCH
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_students_email ON students(email);
CREATE INDEX IF NOT EXISTS idx_students_referral_code ON students(referral_code);
CREATE INDEX IF NOT EXISTS idx_students_college ON students(college);
CREATE INDEX IF NOT EXISTS idx_students_source ON students(source);
CREATE INDEX IF NOT EXISTS idx_students_created_at ON students(created_at);
CREATE INDEX IF NOT EXISTS idx_referrals_referrer_id ON referrals(referrer_student_id);
CREATE INDEX IF NOT EXISTS idx_referrals_code ON referrals(referral_code);
CREATE INDEX IF NOT EXISTS idx_expenses_campaign_id ON expenses(campaign_id);

-- ============================================================================
-- ROW-LEVEL SECURITY (RLS) POLICIES FOR SUPABASE
-- ============================================================================
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- Public can read campaign metadata
CREATE POLICY "Public campaign view" ON campaigns FOR SELECT USING (true);

-- Public can register as a student
CREATE POLICY "Public student registration" ON students FOR INSERT WITH CHECK (true);

-- Public can view leaderboard with masked identity (leaderboard_visible = true)
CREATE POLICY "Public leaderboard view" ON students FOR SELECT USING (leaderboard_visible = true);

-- Referrals insert triggered during verified registration
CREATE POLICY "Verified referral creation" ON referrals FOR INSERT WITH CHECK (true);
