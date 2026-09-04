"""
VoxAI - Complete SaaS Product Documentation PDF Generator
Generates a professional PDF document using ReportLab
"""

from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch, mm
from reportlab.lib.colors import HexColor, black, white, Color
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    PageBreak, HRFlowable, KeepTogether
)
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY
from datetime import datetime
import os

# ═══════════════════════════════════════════════════════════
# COLOR PALETTE
# ═══════════════════════════════════════════════════════════
PRIMARY = HexColor("#6C3CE1")       # Purple
PRIMARY_DARK = HexColor("#4A1FB8")
ACCENT = HexColor("#00D4AA")        # Teal
BG_LIGHT = HexColor("#F8F6FF")
BG_TABLE_HEADER = HexColor("#6C3CE1")
BG_TABLE_EVEN = HexColor("#F3F0FF")
TEXT_DARK = HexColor("#1A1A2E")
TEXT_MED = HexColor("#444466")
BORDER = HexColor("#E0DCF0")
RED = HexColor("#E53E3E")
ORANGE = HexColor("#DD6B20")
GREEN = HexColor("#38A169")

OUTPUT_PATH = os.path.join(os.path.dirname(__file__), "VoxAI_Documentation.pdf")

# ═══════════════════════════════════════════════════════════
# STYLES
# ═══════════════════════════════════════════════════════════
styles = getSampleStyleSheet()

style_title = ParagraphStyle(
    'DocTitle', parent=styles['Title'],
    fontSize=32, leading=40, textColor=PRIMARY,
    spaceAfter=6, fontName='Helvetica-Bold',
)
style_subtitle = ParagraphStyle(
    'DocSubtitle', parent=styles['Normal'],
    fontSize=13, leading=18, textColor=TEXT_MED,
    spaceAfter=30, fontName='Helvetica',
)
style_h1 = ParagraphStyle(
    'H1', parent=styles['Heading1'],
    fontSize=22, leading=28, textColor=PRIMARY_DARK,
    spaceBefore=28, spaceAfter=12, fontName='Helvetica-Bold',
)
style_h2 = ParagraphStyle(
    'H2', parent=styles['Heading2'],
    fontSize=16, leading=22, textColor=TEXT_DARK,
    spaceBefore=18, spaceAfter=8, fontName='Helvetica-Bold',
)
style_h3 = ParagraphStyle(
    'H3', parent=styles['Heading3'],
    fontSize=13, leading=18, textColor=PRIMARY,
    spaceBefore=12, spaceAfter=6, fontName='Helvetica-Bold',
)
style_body = ParagraphStyle(
    'Body', parent=styles['Normal'],
    fontSize=10, leading=15, textColor=TEXT_DARK,
    spaceAfter=6, fontName='Helvetica', alignment=TA_JUSTIFY,
)
style_bullet = ParagraphStyle(
    'Bullet', parent=style_body,
    leftIndent=20, bulletIndent=8,
    spaceBefore=2, spaceAfter=2,
)
style_code = ParagraphStyle(
    'Code', parent=styles['Code'],
    fontSize=9, leading=13, textColor=HexColor("#2D2D2D"),
    backColor=HexColor("#F5F5F5"), borderPadding=6,
    fontName='Courier', spaceAfter=8,
)
style_note = ParagraphStyle(
    'Note', parent=style_body,
    fontSize=10, leading=14, textColor=HexColor("#744210"),
    backColor=HexColor("#FFFBEB"), borderPadding=10,
    borderColor=HexColor("#F6E05E"), borderWidth=1,
    spaceBefore=8, spaceAfter=8,
)
style_important = ParagraphStyle(
    'Important', parent=style_body,
    fontSize=10, leading=14, textColor=HexColor("#822727"),
    backColor=HexColor("#FFF5F5"), borderPadding=10,
    borderColor=HexColor("#FC8181"), borderWidth=1,
    spaceBefore=8, spaceAfter=8,
)

style_table_header = ParagraphStyle(
    'TH', parent=styles['Normal'],
    fontSize=9, leading=12, textColor=white,
    fontName='Helvetica-Bold',
)
style_table_cell = ParagraphStyle(
    'TD', parent=styles['Normal'],
    fontSize=9, leading=12, textColor=TEXT_DARK,
    fontName='Helvetica',
)
style_table_cell_bold = ParagraphStyle(
    'TDBold', parent=style_table_cell,
    fontName='Helvetica-Bold',
)

# ═══════════════════════════════════════════════════════════
# HELPERS
# ═══════════════════════════════════════════════════════════

def make_table(headers, rows, col_widths=None):
    """Create a styled table."""
    header_cells = [Paragraph(h, style_table_header) for h in headers]
    data = [header_cells]
    for row in rows:
        data.append([Paragraph(str(c), style_table_cell) for c in row])

    if col_widths is None:
        col_widths = [None] * len(headers)

    t = Table(data, colWidths=col_widths, repeatRows=1)
    style_cmds = [
        ('BACKGROUND', (0, 0), (-1, 0), BG_TABLE_HEADER),
        ('TEXTCOLOR', (0, 0), (-1, 0), white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 9),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 8),
        ('TOPPADDING', (0, 0), (-1, 0), 8),
        ('GRID', (0, 0), (-1, -1), 0.5, BORDER),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 1), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 1), (-1, -1), 5),
    ]
    # Alternate row colors
    for i in range(1, len(data)):
        if i % 2 == 0:
            style_cmds.append(('BACKGROUND', (0, i), (-1, i), BG_TABLE_EVEN))
    t.setStyle(TableStyle(style_cmds))
    return t

def hr():
    return HRFlowable(width="100%", thickness=1, color=BORDER, spaceBefore=10, spaceAfter=10)

def spacer(h=12):
    return Spacer(1, h)


# ═══════════════════════════════════════════════════════════
# PAGE TEMPLATE (Header/Footer)
# ═══════════════════════════════════════════════════════════

def on_page(canvas, doc):
    canvas.saveState()
    # Header line
    canvas.setStrokeColor(PRIMARY)
    canvas.setLineWidth(2)
    canvas.line(30, A4[1] - 40, A4[0] - 30, A4[1] - 40)
    canvas.setFont('Helvetica-Bold', 8)
    canvas.setFillColor(PRIMARY)
    canvas.drawString(30, A4[1] - 35, "VoxAI — Complete SaaS Documentation")
    canvas.setFont('Helvetica', 8)
    canvas.setFillColor(TEXT_MED)
    canvas.drawRightString(A4[0] - 30, A4[1] - 35, f"Confidential • {datetime.now().strftime('%B %Y')}")
    # Footer
    canvas.setStrokeColor(BORDER)
    canvas.setLineWidth(0.5)
    canvas.line(30, 35, A4[0] - 30, 35)
    canvas.setFont('Helvetica', 8)
    canvas.setFillColor(TEXT_MED)
    canvas.drawString(30, 22, "© 2026 AutomaticXAI • automaticxai.online")
    canvas.drawRightString(A4[0] - 30, 22, f"Page {doc.page}")
    canvas.restoreState()

def on_first_page(canvas, doc):
    canvas.saveState()
    # Purple header bar
    canvas.setFillColor(PRIMARY)
    canvas.rect(0, A4[1] - 8, A4[0], 8, fill=True, stroke=False)
    # Footer
    canvas.setFont('Helvetica', 8)
    canvas.setFillColor(TEXT_MED)
    canvas.drawCentredString(A4[0] / 2, 22, f"Generated on {datetime.now().strftime('%B %d, %Y at %I:%M %p')}")
    canvas.restoreState()


# ═══════════════════════════════════════════════════════════
# BUILD THE PDF
# ═══════════════════════════════════════════════════════════

def build():
    doc = SimpleDocTemplate(
        OUTPUT_PATH, pagesize=A4,
        topMargin=55, bottomMargin=50,
        leftMargin=40, rightMargin=40,
    )
    story = []
    W = A4[0] - 80  # usable width

    # ─────────────── TITLE PAGE ───────────────
    story.append(Spacer(1, 120))
    story.append(Paragraph("VoxAI", style_title))
    story.append(Paragraph("Complete SaaS Product Documentation", style_subtitle))
    story.append(hr())
    story.append(Paragraph(
        "AI-powered medical voice consultation platform. Doctors speak during patient consultations "
        "and VoxAI automatically transcribes the audio, extracts structured medical data (diagnoses, "
        "symptoms, medications), generates professional PDF reports, and delivers them via email &amp; "
        "WhatsApp — all in real-time.",
        style_body
    ))
    story.append(Spacer(1, 30))
    story.append(make_table(
        ["Property", "Value"],
        [
            ["Product Name", "VoxAI"],
            ["Version", "2.0.0"],
            ["Company", "AutomaticXAI (automaticxai.online)"],
            ["Document Date", datetime.now().strftime("%B %d, %Y")],
            ["Classification", "Confidential"],
        ],
        col_widths=[W * 0.35, W * 0.65]
    ))
    story.append(PageBreak())

    # ─────────────── TABLE OF CONTENTS ───────────────
    story.append(Paragraph("Table of Contents", style_h1))
    story.append(hr())
    toc_items = [
        "1. Prerequisites &amp; Installation",
        "2. Technology Stack",
        "3. Architecture Overview",
        "4. Database Schema",
        "5. Backend API Endpoints",
        "6. Frontend Pages &amp; Components",
        "7. Project Directory Structure",
        "8. Environment Variables",
        "9. User Roles &amp; Access Control",
        "10. Core Consultation Workflow",
        "11. Pending Work &amp; Issues",
        "12. External Dependencies Summary",
    ]
    for item in toc_items:
        story.append(Paragraph(item, ParagraphStyle(
            'TOC', parent=style_body, fontSize=12, leading=22,
            leftIndent=20, textColor=PRIMARY_DARK,
        )))
    story.append(PageBreak())

    # ─────────────── 1. PREREQUISITES ───────────────
    story.append(Paragraph("1. Prerequisites &amp; Installation", style_h1))
    story.append(hr())
    story.append(Paragraph("What You Need to Install", style_h2))
    story.append(make_table(
        ["Requirement", "Purpose", "Notes"],
        [
            ["Python 3.10+", "Backend runtime", "Required for Flask server"],
            ["Node.js 18+", "Frontend build tool", "Required for Vite dev server"],
            ["FFmpeg", "Audio conversion", "Required by pydub for Whisper preprocessing"],
            ["Gemini API Key", "AI medical extraction", "Free tier from Google AI Studio"],
            ["Supabase Account", "Cloud database &amp; auth", "Free tier available"],
        ],
        col_widths=[W * 0.22, W * 0.33, W * 0.45]
    ))
    story.append(spacer())
    story.append(Paragraph(
        "<b>⚠️ IMPORTANT:</b> Ollama is NOT used in this project. VoxAI uses <b>faster-whisper</b> "
        "(runs locally, no API needed) for transcription and <b>Google Gemini 2.0 Flash Lite</b> "
        "(cloud API) for medical data extraction.",
        style_important
    ))
    story.append(spacer())
    story.append(Paragraph("Quick Start — Backend", style_h3))
    story.append(Paragraph("cd backend<br/>pip install -r requirements.txt<br/>python app.py&nbsp;&nbsp;&nbsp;&nbsp;# Starts on http://localhost:5001", style_code))
    story.append(Paragraph("Quick Start — Frontend", style_h3))
    story.append(Paragraph("cd frontend<br/>npm install<br/>npm run dev&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# Starts on http://localhost:5173", style_code))
    story.append(PageBreak())

    # ─────────────── 2. TECHNOLOGY STACK ───────────────
    story.append(Paragraph("2. Technology Stack", style_h1))
    story.append(hr())

    story.append(Paragraph("Frontend", style_h2))
    story.append(make_table(
        ["Technology", "Version", "Purpose"],
        [
            ["React", "18.2", "UI library (JSX components)"],
            ["Vite", "5.0", "Build tool &amp; dev server"],
            ["TailwindCSS", "3.3", "Utility-first CSS framework"],
            ["Framer Motion", "12.34", "Animations &amp; transitions"],
            ["React Router DOM", "7.13", "Client-side routing (13 routes)"],
            ["Axios", "1.6", "HTTP client for API calls"],
            ["Socket.IO Client", "4.8", "Real-time WebSocket communication"],
            ["Lucide React", "0.294", "Icon library"],
            ["Three.js", "0.183", "3D graphics (Landing Page)"],
            ["Radix UI", "Latest", "Accessible UI primitives"],
            ["TypeScript", "5.9", "Type checking (dev dependency)"],
        ],
        col_widths=[W * 0.28, W * 0.15, W * 0.57]
    ))
    story.append(spacer())

    story.append(Paragraph("Backend", style_h2))
    story.append(make_table(
        ["Technology", "Version", "Purpose"],
        [
            ["Flask", "Latest", "Python web framework"],
            ["Flask-SocketIO", "Latest", "WebSocket support for live audio"],
            ["Flask-CORS", "Latest", "Cross-origin request handling"],
            ["faster-whisper", "Latest", "Local speech-to-text (OpenAI Whisper)"],
            ["Google Generative AI", "Latest", "Gemini 2.0 Flash Lite — medical extraction"],
            ["ReportLab", "Latest", "PDF report generation"],
            ["Supabase Python", "Latest", "Database &amp; storage client"],
            ["pydub", "Latest", "Audio format conversion"],
            ["python-dotenv", "Latest", "Environment variable management"],
            ["requests", "Latest", "HTTP client (n8n webhooks)"],
        ],
        col_widths=[W * 0.28, W * 0.15, W * 0.57]
    ))
    story.append(spacer())

    story.append(Paragraph("Database &amp; Infrastructure", style_h2))
    story.append(make_table(
        ["Service", "Purpose"],
        [
            ["Supabase (PostgreSQL)", "Primary database, authentication, file storage"],
            ["Supabase Auth", "User authentication with Row Level Security"],
            ["Supabase Storage", "Audio file &amp; PDF storage"],
            ["n8n (self-hosted on Hostinger)", "Workflow automation — email &amp; WhatsApp notifications"],
        ],
        col_widths=[W * 0.38, W * 0.62]
    ))
    story.append(spacer())

    story.append(Paragraph("AI / ML Models", style_h2))
    story.append(make_table(
        ["Model", "Provider", "Purpose"],
        [
            ["Whisper (small)", "OpenAI (via faster-whisper)", "Speech-to-text — runs 100% locally on CPU"],
            ["Gemini 2.0 Flash Lite", "Google AI", "Medical data extraction from transcriptions (cloud API)"],
        ],
        col_widths=[W * 0.25, W * 0.30, W * 0.45]
    ))
    story.append(PageBreak())

    # ─────────────── 3. ARCHITECTURE ───────────────
    story.append(Paragraph("3. Architecture Overview", style_h1))
    story.append(hr())
    story.append(Paragraph(
        "VoxAI follows a <b>decoupled client-server architecture</b> with a React SPA frontend communicating "
        "with a Flask REST/WebSocket backend. The backend orchestrates two AI pipelines (Whisper for STT, "
        "Gemini for medical extraction) and persists all data to Supabase (PostgreSQL). Notifications are "
        "dispatched via n8n webhooks hosted on Hostinger.",
        style_body
    ))
    story.append(spacer())
    story.append(Paragraph("Data Flow", style_h2))
    flow_data = [
        ["Step", "Component", "Description"],
        ["1", "Frontend (React)", "Doctor enters patient info, records or uploads audio"],
        ["2", "Backend (Flask)", "Receives audio via REST API or WebSocket"],
        ["3", "Whisper AI (Local)", "Transcribes audio to text (runs on CPU, no API key)"],
        ["4", "Gemini 2.0 (Cloud)", "Extracts structured medical data from transcription"],
        ["5", "Supabase (Cloud)", "Stores consultation record (transcription + medical JSON)"],
        ["6", "Doctor Review", "Doctor reviews, edits, and approves the AI output"],
        ["7", "PDF Generator", "ReportLab generates professional medical report PDF"],
        ["8", "n8n Webhook", "Sends PDF via email &amp; WhatsApp to patient"],
    ]
    flow_table_data = [[Paragraph(c, style_table_header if i == 0 else style_table_cell) for c in row] for i, row in enumerate(flow_data)]
    t = Table(flow_table_data, colWidths=[W * 0.08, W * 0.25, W * 0.67], repeatRows=1)
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), BG_TABLE_HEADER),
        ('GRID', (0, 0), (-1, -1), 0.5, BORDER),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
    ] + [('BACKGROUND', (0, i), (-1, i), BG_TABLE_EVEN) for i in range(2, len(flow_data), 2)]))
    story.append(t)
    story.append(PageBreak())

    # ─────────────── 4. DATABASE SCHEMA ───────────────
    story.append(Paragraph("4. Database Schema (Supabase / PostgreSQL)", style_h1))
    story.append(hr())

    story.append(Paragraph("Tables", style_h2))
    story.append(make_table(
        ["Table", "Purpose", "Key Fields"],
        [
            ["clinics", "Multi-tenant clinic orgs", "id, name, location, plan, logo_url, header/footer_template"],
            ["profiles", "Users (doctors &amp; admins)", "id (FK→auth.users), clinic_id, full_name, email, role, photo_url"],
            ["patients", "Patient records per clinic", "id, clinic_id, name, phone_number, email, age"],
            ["consultations", "Consultation records", "id, clinic_id, doctor_id, patient_id, transcription, medical_data (JSONB)"],
            ["demo_requests", "Lead capture (landing page)", "id, full_name, professional_email, clinic_name, status"],
            ["interest_submissions", "Onboarding interest forms", "id, clinic_name, professional_email, description, status"],
        ],
        col_widths=[W * 0.20, W * 0.28, W * 0.52]
    ))
    story.append(spacer())

    story.append(Paragraph("Row Level Security (RLS)", style_h2))
    story.append(Paragraph("• <b>Profiles</b>: Users see only their own data", style_bullet))
    story.append(Paragraph("• <b>Patients</b>: Scoped to user's clinic_id", style_bullet))
    story.append(Paragraph("• <b>Consultations</b>: Scoped to user's clinic_id", style_bullet))
    story.append(Paragraph("• <b>Demo Requests</b>: Public insert, admin-only read", style_bullet))
    story.append(Paragraph("• <b>Interest Submissions</b>: Public insert, admin-only read", style_bullet))
    story.append(PageBreak())

    # ─────────────── 5. API ENDPOINTS ───────────────
    story.append(Paragraph("5. Backend API Endpoints", style_h1))
    story.append(hr())

    story.append(Paragraph("Core Consultation Flow", style_h2))
    story.append(make_table(
        ["Method", "Endpoint", "Description"],
        [
            ["POST", "/api/transcribe", "Upload audio → Whisper → Gemini → save to Supabase"],
            ["POST", "/api/upload-audio", "Upload existing audio file for processing"],
            ["POST", "/api/upload-transcript", "Submit raw text transcript (skip Whisper)"],
            ["POST", "/api/approve", "Approve → generate PDF → send via n8n"],
            ["GET", "/api/patient-history/&lt;phone&gt;", "Retrieve all past consultations by phone"],
        ],
        col_widths=[W * 0.12, W * 0.38, W * 0.50]
    ))
    story.append(spacer())

    story.append(Paragraph("Authentication &amp; Profiles", style_h2))
    story.append(make_table(
        ["Method", "Endpoint", "Description"],
        [
            ["POST", "/api/login", "Integrated login for doctors &amp; clinic admins"],
            ["POST", "/api/complete-registration", "Doctor sets name &amp; password after invite"],
            ["POST", "/api/upload-profile-photo", "Upload/update profile photo"],
            ["PUT", "/api/update-profile", "Update profile details"],
        ],
        col_widths=[W * 0.12, W * 0.38, W * 0.50]
    ))
    story.append(spacer())

    story.append(Paragraph("Clinic &amp; Staff Management", style_h2))
    story.append(make_table(
        ["Method", "Endpoint", "Description"],
        [
            ["GET", "/api/clinics", "Master admin: list all clinics"],
            ["POST", "/api/clinics", "Master admin: create new clinic"],
            ["PUT", "/api/clinics/&lt;id&gt;", "Master admin: update clinic"],
            ["DELETE", "/api/clinics/&lt;id&gt;", "Master admin: delete clinic"],
            ["GET", "/api/clinic-staff", "Clinic admin: list doctors"],
            ["POST", "/api/invite-doctor", "Clinic admin: invite a doctor"],
            ["DELETE", "/api/clinic-staff/&lt;id&gt;", "Clinic admin: remove a doctor"],
            ["POST", "/api/generate-invite-link", "Generate invite link for doctor"],
        ],
        col_widths=[W * 0.12, W * 0.38, W * 0.50]
    ))
    story.append(spacer())

    story.append(Paragraph("Analytics, History &amp; Branding", style_h2))
    story.append(make_table(
        ["Method", "Endpoint", "Description"],
        [
            ["GET", "/api/doctor-history/&lt;id&gt;", "Consultations for a specific doctor"],
            ["GET", "/api/clinic-history", "All consultations for a clinic"],
            ["GET", "/api/daily-stats", "Daily activity statistics"],
            ["GET", "/api/clinic-branding/&lt;id&gt;", "Get clinic branding settings"],
            ["PUT", "/api/clinic-branding", "Update clinic branding"],
        ],
        col_widths=[W * 0.12, W * 0.38, W * 0.50]
    ))
    story.append(spacer())

    story.append(Paragraph("Lead Capture &amp; WebSocket Events", style_h2))
    story.append(make_table(
        ["Method/Event", "Endpoint", "Description"],
        [
            ["POST", "/api/demo-request", "Submit demo request from landing page"],
            ["POST", "/api/submit-interest", "Submit interest form"],
            ["WS: connect", "—", "Client connected via WebSocket"],
            ["WS: disconnect", "—", "Client disconnected"],
            ["WS: audio_chunk", "—", "Live audio chunk for real-time transcription"],
        ],
        col_widths=[W * 0.18, W * 0.32, W * 0.50]
    ))
    story.append(PageBreak())

    # ─────────────── 6. FRONTEND ───────────────
    story.append(Paragraph("6. Frontend Pages &amp; Components", style_h1))
    story.append(hr())

    story.append(Paragraph("Pages (13 Routes)", style_h2))
    story.append(make_table(
        ["Route", "Page", "Description"],
        [
            ["/", "LandingPage", "Marketing page with demo request, interest forms, 3D effects"],
            ["/login", "LoginPage", "Unified login for doctors &amp; admins"],
            ["/register", "RegisterPage", "Doctor registration via invite link"],
            ["/dashboard", "Dashboard", "Doctor workspace — consultation wizard, history, profile"],
            ["/admin", "AdminPanel", "Master admin — clinic management, staff, analytics"],
            ["/about", "AboutPage", "About the company"],
            ["/blog", "BlogPage", "Blog articles"],
            ["/partners", "PartnersPage", "Partner information (automaticxai.online)"],
            ["/privacy", "PrivacyPage", "Privacy policy"],
            ["/terms", "TermsPage", "Terms of service"],
            ["/hipaa", "HIPAAPage", "HIPAA compliance details"],
            ["/security", "SecurityPage", "Security practices"],
            ["/faq", "FAQPage", "Frequently asked questions"],
        ],
        col_widths=[W * 0.15, W * 0.22, W * 0.63]
    ))
    story.append(spacer())

    story.append(Paragraph("Key Components", style_h2))
    story.append(make_table(
        ["Component", "Size", "Purpose"],
        [
            ["ConsultationWizard", "54 KB", "Multi-step consultation flow (patient → record → review → approve)"],
            ["UploadWizard", "48 KB", "File upload-based consultation flow"],
            ["Dashboard", "38 KB", "Main doctor dashboard (tabs, history, stats)"],
            ["AdminPanel", "36 KB", "Master admin panel (clinic CRUD, staff, analytics)"],
            ["TeamManagement", "18 KB", "Clinic admin doctor management"],
            ["ProfileSettings", "16 KB", "User profile editing"],
            ["BrandingSettings", "14 KB", "Clinic branding customization"],
            ["DoctorApprovalScreen", "13 KB", "Review &amp; approve AI-generated medical report"],
            ["LiveRecorder", "10 KB", "Real-time audio recording via WebSocket"],
            ["DemoRequestModal", "9 KB", "Landing page demo request form"],
            ["FileUpload", "8 KB", "Audio file upload component"],
            ["PatientInfoForm", "5 KB", "Patient data input form"],
            ["MedicationCard", "2.5 KB", "Individual medication display card"],
            ["ReportViewer", "1.7 KB", "Medical report display"],
            ["TranscriptionDisplay", "1.9 KB", "Transcription text viewer"],
            ["ThemeProvider / ThemeToggle", "3 KB", "Dark/light theme support"],
        ],
        col_widths=[W * 0.30, W * 0.12, W * 0.58]
    ))
    story.append(PageBreak())

    # ─────────────── 7. DIRECTORY STRUCTURE ───────────────
    story.append(Paragraph("7. Project Directory Structure", style_h1))
    story.append(hr())
    dir_text = """VoxAI/
├── backend/
│   ├── app.py                      # Main Flask app (1137 lines, 30+ endpoints)
│   ├── config.py                   # Configuration from .env
│   ├── .env                        # Environment variables
│   ├── requirements.txt            # Python dependencies
│   ├── models/
│   │   ├── transcription.py        # Whisper AI speech-to-text
│   │   └── extraction.py           # Gemini medical data extraction
│   ├── services/
│   │   ├── pdf_generator.py        # ReportLab PDF generation
│   │   ├── report_generator.py     # Structured report builder
│   │   └── notification_service.py # n8n webhook integration
│   ├── uploads/                    # Temporary audio uploads
│   └── pdfs/                       # Generated PDF reports
│
├── frontend/
│   ├── package.json                # Node.js dependencies
│   ├── vite.config.js              # Vite configuration
│   ├── tailwind.config.js          # TailwindCSS config
│   ├── index.html                  # SPA entry point
│   └── src/
│       ├── App.jsx                 # Route definitions
│       ├── main.jsx                # React entry point
│       ├── pages/                  # 13 page components
│       ├── components/             # 16 feature components
│       │   └── ui/                 # 5 reusable UI primitives
│       ├── constants/              # App constants
│       ├── lib/                    # Utility functions
│       └── assets/                 # Static assets
│
└── supabase_schema.sql             # Database schema definition"""
    for line in dir_text.split("\n"):
        story.append(Paragraph(line.replace(" ", "&nbsp;"), style_code))
    story.append(PageBreak())

    # ─────────────── 8. ENV VARIABLES ───────────────
    story.append(Paragraph("8. Environment Variables", style_h1))
    story.append(hr())
    story.append(make_table(
        ["Variable", "Description", "Example"],
        [
            ["FLASK_ENV", "Flask environment", "development"],
            ["SECRET_KEY", "Flask secret key", "your-secret-key"],
            ["WHISPER_MODEL", "Whisper model size", "small (tiny/base/small/medium/large)"],
            ["SUPABASE_URL", "Supabase project URL", "https://xxx.supabase.co"],
            ["SUPABASE_KEY", "Supabase anon key", "eyJhbG..."],
            ["GEMINI_API_KEY", "Google AI API key", "AIzaSy..."],
            ["N8N_WEBHOOK_URL", "n8n webhook endpoint", "https://your-n8n.hostinger.com/webhook/..."],
            ["MAX_FILE_SIZE", "Max upload size (bytes)", "104857600 (100 MB)"],
        ],
        col_widths=[W * 0.25, W * 0.35, W * 0.40]
    ))
    story.append(PageBreak())

    # ─────────────── 9. USER ROLES ───────────────
    story.append(Paragraph("9. User Roles &amp; Access Control", style_h1))
    story.append(hr())
    story.append(make_table(
        ["Role", "Access", "Created By"],
        [
            ["Master Admin", "Full system — create/delete clinics, manage all staff, view analytics", "System owner"],
            ["Clinic Admin", "Manage their clinic's doctors, view clinic stats, invite doctors", "Master Admin"],
            ["Doctor", "Run consultations, view own history, manage profile", "Clinic Admin (via invite)"],
        ],
        col_widths=[W * 0.18, W * 0.58, W * 0.24]
    ))
    story.append(spacer(20))

    story.append(Paragraph("Onboarding Flow", style_h2))
    story.append(Paragraph("1. <b>Master Admin</b> creates a new clinic via the Admin Panel", style_bullet))
    story.append(Paragraph("2. <b>Master Admin</b> or <b>Clinic Admin</b> generates an invite link", style_bullet))
    story.append(Paragraph("3. <b>Doctor</b> receives link → registers with name &amp; password", style_bullet))
    story.append(Paragraph("4. <b>Doctor</b> logs in → accesses Dashboard → runs consultations", style_bullet))
    story.append(PageBreak())

    # ─────────────── 10. WORKFLOW ───────────────
    story.append(Paragraph("10. Core Consultation Workflow", style_h1))
    story.append(hr())
    story.append(Paragraph(
        "The following describes the end-to-end flow of a single patient consultation through VoxAI:",
        style_body
    ))
    story.append(spacer())
    workflow_steps = [
        ["1", "Doctor → Frontend", "Doctor enters patient info (name, phone, age)"],
        ["2", "Doctor → Frontend", "Doctor records audio live or uploads an audio file"],
        ["3", "Frontend → Backend", "POST /api/transcribe with audio file"],
        ["4", "Backend → Whisper", "Audio converted to 16kHz mono WAV, transcribed locally"],
        ["5", "Backend → Gemini", "Transcription sent to Gemini 2.0 Flash Lite for medical extraction"],
        ["6", "Gemini → Backend", "Returns structured JSON: diagnoses, symptoms, medications, recommendations"],
        ["7", "Backend → Supabase", "Consultation record saved (transcription + medical_data JSONB)"],
        ["8", "Backend → Frontend", "Returns full result to doctor"],
        ["9", "Doctor → Frontend", "Reviews, edits medications/diagnoses, approves report"],
        ["10", "Frontend → Backend", "POST /api/approve with final data"],
        ["11", "Backend → ReportLab", "Generates professional PDF medical report"],
        ["12", "Backend → n8n", "Sends PDF + patient info to n8n webhook"],
        ["13", "n8n → Patient", "Delivers report via email and/or WhatsApp"],
    ]
    story.append(make_table(
        ["Step", "Direction", "Description"],
        workflow_steps,
        col_widths=[W * 0.08, W * 0.25, W * 0.67]
    ))
    story.append(PageBreak())

    # ─────────────── 11. PENDING WORK ───────────────
    story.append(Paragraph("11. Pending Work &amp; Issues", style_h1))
    story.append(hr())

    story.append(Paragraph("🔴 Critical (Must Fix)", style_h2))
    story.append(make_table(
        ["#", "Item", "Details"],
        [
            ["1", "n8n Webhook Not Configured", "The .env still has a placeholder URL. Email &amp; WhatsApp delivery is non-functional."],
            ["2", "No Authentication Middleware", "API endpoints have no JWT/token validation. Any client can call any endpoint."],
            ["3", "Passwords Stored in Plaintext", "The profiles table stores passwords as plain text. Must use bcrypt/argon2."],
            ["4", "API Keys Exposed in .env", "Supabase key and Gemini API key are committed to the repo. Must rotate &amp; gitignore."],
            ["5", "No Route Guards (Frontend)", "Dashboard and Admin routes are not protected — accessible without login."],
        ],
        col_widths=[W * 0.05, W * 0.30, W * 0.65]
    ))
    story.append(spacer())

    story.append(Paragraph("🟡 Important (Should Build)", style_h2))
    story.append(make_table(
        ["#", "Item", "Details"],
        [
            ["6", "WebSocket Live Transcription", "audio_chunk handler is a stub — no real-time transcription during recording."],
            ["7", "Supabase Storage Integration", "Files saved locally to uploads/ and pdfs/ — not uploaded to Supabase Storage."],
            ["8", "Production Deployment", "No Dockerfile, docker-compose, CI/CD pipeline, or deployment config."],
            ["9", "Error Handling &amp; Logging", "Uses print() instead of proper Python logging. No Sentry/error tracking."],
            ["10", "Rate Limiting", "No rate limiting on any endpoints — vulnerable to abuse."],
            ["11", "Gemini Quota Management", "No retry logic, fallback model, or queue for high-volume usage."],
            ["12", "Multi-Language UI", "Whisper supports 99 languages but UI is English-only. No i18n framework."],
        ],
        col_widths=[W * 0.05, W * 0.30, W * 0.65]
    ))
    story.append(spacer())

    story.append(Paragraph("🟢 Nice to Have (Future Enhancements)", style_h2))
    story.append(make_table(
        ["#", "Item", "Details"],
        [
            ["13", "Unit &amp; Integration Tests", "No test suite. One-off scripts exist but no pytest/jest framework."],
            ["14", "PDF Template Customization", "Clinic header/footer templates not fully integrated into PDF generator."],
            ["15", "Patient Portal", "No patient-facing interface. Reports only via email/WhatsApp."],
            ["16", "Advanced Analytics", "Limited analytics. Need trends, charts, doctor performance dashboards."],
            ["17", "Offline Mode (PWA)", "No service worker for offline use in low-connectivity areas."],
            ["18", "API Documentation", "No Swagger/OpenAPI spec for the 30+ endpoints."],
            ["19", "Billing &amp; Payments", "plan field exists but no Stripe/Razorpay integration."],
            ["20", "Audit Logging", "No audit trail for patient data access (important for HIPAA)."],
        ],
        col_widths=[W * 0.05, W * 0.30, W * 0.65]
    ))
    story.append(PageBreak())

    # ─────────────── 12. EXTERNAL DEPS ───────────────
    story.append(Paragraph("12. External Dependencies Summary", style_h1))
    story.append(hr())
    story.append(make_table(
        ["Dependency", "Type", "Required?"],
        [
            ["FFmpeg", "System binary", "✅ Yes — required by pydub for audio conversion"],
            ["Google Gemini API", "Cloud API", "✅ Yes — medical extraction fails without it"],
            ["Supabase", "Cloud service", "✅ Yes — all data storage and auth"],
            ["n8n on Hostinger", "Self-hosted", "⚠️ Optional — only for email/WhatsApp delivery"],
            ["Ollama", "—", "❌ NOT USED — project uses faster-whisper + Gemini"],
        ],
        col_widths=[W * 0.25, W * 0.22, W * 0.53]
    ))
    story.append(spacer(40))
    story.append(hr())
    story.append(Paragraph(
        "<i>End of Documentation — VoxAI v2.0.0</i>",
        ParagraphStyle('Footer', parent=style_body, alignment=TA_CENTER, textColor=TEXT_MED, fontSize=10)
    ))

    # ─────────────── BUILD ───────────────
    doc.build(story, onFirstPage=on_first_page, onLaterPages=on_page)
    print(f"\n✅ PDF generated successfully: {OUTPUT_PATH}")
    print(f"📄 File size: {os.path.getsize(OUTPUT_PATH) / 1024:.1f} KB")


if __name__ == "__main__":
    build()
