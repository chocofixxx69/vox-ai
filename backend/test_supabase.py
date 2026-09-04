import os
from dotenv import load_dotenv
from supabase import create_client, Client

# Load environment variables
load_dotenv()

SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_KEY')

print(f"Supabase URL: {SUPABASE_URL}")
print(f"Supabase Key: {SUPABASE_KEY[:20]}...")

try:
    # Create Supabase client
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    print("✅ Supabase client created successfully!")
    
    # Try to insert a test record
    result = supabase.table('demo_requests').insert({
        'full_name': 'Test User',
        'professional_email': 'test@clinic.com',
        'clinic_name': 'Test Clinic',
        'phone_number': '1234567890',
        'message': 'Test message',
        'status': 'pending'
    }).execute()
    
    print("✅ Insert successful!")
    print(f"Result: {result.data}")
    
except Exception as e:
    print(f"❌ Error: {str(e)}")
    import traceback
    traceback.print_exc()
