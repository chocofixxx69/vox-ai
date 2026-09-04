import os
import requests
from dotenv import load_dotenv

load_dotenv('backend/.env')
SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_KEY')

# Use Supabase REST API to run SQL isn't standard, usually you'd use a migrations tool or the dashboard.
# However, if we have the service role key, we can try to use a function or just hope the columns exist 
# and the error was something else. 

# WAIT - I might have misread the error. "Could not find the 'location' column" 
# is a PostgREST error (PGRST204). This EXPLICITLY means the column does not exist.

print(f"URL: {SUPABASE_URL}")
print(f"Key exists: {bool(SUPABASE_KEY)}")

# If I can't run SQL directly, I should at least try to find where 'location' came from.
