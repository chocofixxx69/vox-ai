-- 1. CLINICS TABLE
CREATE TABLE clinics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    location TEXT, -- Region/Location
    plan TEXT DEFAULT 'Enterprise', -- Billing Plan
    address TEXT,
    phone TEXT,
    website TEXT,
    logo_url TEXT,
    header_template TEXT, -- Markdown or HTML for custom headers
    footer_template TEXT, -- Markdown or HTML for custom footers
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. PROFILES TABLE (Linked to Auth/Clinics)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
    clinic_id UUID REFERENCES clinics(id),
    full_name TEXT,
    email TEXT,
    password TEXT,
    photo_url TEXT,
    role TEXT DEFAULT 'doctor', -- 'doctor' or 'admin'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. PATIENTS TABLE
CREATE TABLE patients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clinic_id UUID REFERENCES clinics(id) NOT NULL,
    name TEXT NOT NULL,
    phone_number TEXT NOT NULL, -- Key for history recognition
    email TEXT,
    age INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_phone_per_clinic UNIQUE (clinic_id, phone_number)
);

-- 4. CONSULTATIONS TABLE
CREATE TABLE consultations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clinic_id UUID REFERENCES clinics(id) NOT NULL,
    doctor_id UUID REFERENCES profiles(id) NOT NULL,
    patient_id UUID REFERENCES patients(id) NOT NULL,
    transcription TEXT,
    medical_data JSONB, -- The structured output from Gemini
    audio_url TEXT, -- Supabase Storage link
    pdf_url TEXT, -- Supabase Storage link
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;

-- 6. POLICIES (Example: Users can only see data from their own clinic)
CREATE POLICY "Users can only view their clinic's patients" ON patients
FOR SELECT USING (clinic_id = (SELECT clinic_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Users can only view their clinic's consultations" ON consultations
FOR SELECT USING (clinic_id = (SELECT clinic_id FROM profiles WHERE id = auth.uid()));

-- 7. DEMO REQUESTS TABLE (Lead Capture)
CREATE TABLE demo_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    professional_email TEXT NOT NULL,
    clinic_name TEXT NOT NULL,
    phone_number TEXT,
    message TEXT,
    status TEXT DEFAULT 'pending', -- 'pending', 'contacted', 'converted', 'rejected'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. INTEREST SUBMISSIONS TABLE (Onboarding Form)
CREATE TABLE interest_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clinic_name TEXT NOT NULL,
    professional_email TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for lead tables (allow public insert, admin-only read)
ALTER TABLE demo_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE interest_submissions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (for public form submissions)
CREATE POLICY "Anyone can submit demo requests" ON demo_requests
FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can submit interest" ON interest_submissions
FOR INSERT WITH CHECK (true);

-- Only admins can view (you'll need to add admin check later)
CREATE POLICY "Only admins can view demo requests" ON demo_requests
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() AND role = 'admin'
    )
);

CREATE POLICY "Only admins can view interest submissions" ON interest_submissions
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() AND role = 'admin'
    )
);
