from supabase import create_client, Client
import os
import json

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

def inspect_profiles():
    try:
        result = supabase.table('profiles').select("*").execute()
        print(f"Found {len(result.data)} profiles:")
        for p in result.data:
            print(f"ID: {p['id']} | Email: {p.get('email')} | Password: {p.get('password')} | Name: {p.get('full_name')}")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    inspect_profiles()
