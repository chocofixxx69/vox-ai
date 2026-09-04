# ═══════════════════════════════════════════════════════════
# CONFIGURATION FILE
# Reads settings from .env and provides defaults
# ═══════════════════════════════════════════════════════════

import os
import sys
import io

# Ensure UTF-8 output on Windows
if sys.platform == "win32":
    try:
        if hasattr(sys.stdout, 'reconfigure'):
            sys.stdout.reconfigure(encoding='utf-8', errors='replace')
        if hasattr(sys.stderr, 'reconfigure'):
            sys.stderr.reconfigure(encoding='utf-8', errors='replace')
    except Exception:
        try:
            sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
            sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')
        except Exception:
            pass


from dotenv import load_dotenv

# ⭐⭐⭐ LOAD ENVIRONMENT VARIABLES
load_dotenv()

# ═══════════════════════════════════════════════════════════
# FLASK SETTINGS
# ═══════════════════════════════════════════════════════════

FLASK_ENV = os.getenv('FLASK_ENV', 'development')
SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')
FLASK_HOST = '0.0.0.0'
FLASK_PORT = 5001
DEBUG = (FLASK_ENV == 'development')

# ═══════════════════════════════════════════════════════════
# SUPABASE SETTINGS
# ═══════════════════════════════════════════════════════════

SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_KEY')

# ═══════════════════════════════════════════════════════════
# PATHS
# ═══════════════════════════════════════════════════════════

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_FOLDER = os.path.join(BASE_DIR, 'uploads')
PDF_FOLDER = os.path.join(BASE_DIR, 'pdfs')

# Create folders if they don't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(PDF_FOLDER, exist_ok=True)

# ═══════════════════════════════════════════════════════════
# WHISPER AI SETTINGS (100% FREE - Runs locally!)
# ═══════════════════════════════════════════════════════════

WHISPER_MODEL = os.getenv('WHISPER_MODEL', 'small')
# Options: tiny, base, small, medium, large

# ═══════════════════════════════════════════════════════════
# GEMINI AI SETTINGS (Free Tier)
# ═══════════════════════════════════════════════════════════

GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
GEMINI_MODEL = os.getenv('GEMINI_MODEL', 'gemini-2.5-flash')

# ═══════════════════════════════════════════════════════════
# N8N WEBHOOK URL (Hostinger)
# ═══════════════════════════════════════════════════════════

N8N_WEBHOOK_URL = os.getenv('N8N_WEBHOOK_URL', 'https://your-n8n.hostinger.com/webhook/voxai')

# ═══════════════════════════════════════════════════════════
# FILE SETTINGS
# ═══════════════════════════════════════════════════════════

MAX_FILE_SIZE = int(os.getenv('MAX_FILE_SIZE', 104857600))  # 100 MB default
ALLOWED_AUDIO_EXTENSIONS = {'.wav', '.mp3', '.webm', '.m4a', '.ogg', '.flac'}

# ═══════════════════════════════════════════════════════════
# CORS SETTINGS (Allow frontend to connect)
# ═══════════════════════════════════════════════════════════

CORS_ORIGINS = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174',
    'http://127.0.0.1:3000'
]

# ═══════════════════════════════════════════════════════════
# SOCKETIO SETTINGS (For live recording)
# ═══════════════════════════════════════════════════════════

SOCKETIO_CORS_ALLOWED_ORIGINS = '*'

# ═══════════════════════════════════════════════════════════
# STARTUP MESSAGE
# ═══════════════════════════════════════════════════════════

print("=" * 60)
print("✅ Configuration loaded successfully!")
print("=" * 60)
print(f"🔧 Environment: {FLASK_ENV}")
print(f"📁 Base Dir: {BASE_DIR}")
print(f"☁️ Supabase: {'Connected (URL Provided)' if SUPABASE_URL else '❌ Missing'}")
print(f"🤖 Whisper model: {WHISPER_MODEL}")
print(f"✨ Gemini model: {GEMINI_MODEL}")
print(f"🔗 n8n webhook: {N8N_WEBHOOK_URL}")
print("=" * 60)