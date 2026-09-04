import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv('backend/.env')
SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_KEY')

s = create_client(SUPABASE_URL, SUPABASE_KEY)

try:
    res = s.table('clinics').select('*').limit(1).execute()
    if res.data:
        print("Columns in clinics table:")
        print(list(res.data[0].keys()))
    else:
        print("No clinics found in the table.")
except Exception as e:
    print(f"Error: {e}")
