from supabase import create_client, Client
import os

def get_env_var(key):
    paths = ['./backend/.env', './.env']
    for p in paths:
        if os.path.exists(p):
            with open(p, 'r') as f:
                for line in f:
                    if line.startswith(f"{key}="):
                        return line.split('=', 1)[1].strip()
    return os.getenv(key)

SUPABASE_URL = get_env_var('SUPABASE_URL')
SUPABASE_KEY = get_env_var('SUPABASE_KEY')
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def test_login_query():
    try:
        # Let's see if we can see ANY profiles
        print("Checking if any profiles are visible...")
        result = supabase.table('profiles').select("*").limit(5).execute()
        print(f"Profiles visible: {len(result.data)}")
        if result.data:
            for p in result.data:
                print(f"User: {p.get('email')}")
        else:
            print("No profiles visible. RLS likely blocking SELECT.")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_login_query()
