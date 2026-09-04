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
                        return line.split('=')[1].strip().strip('"').strip("'")
    return os.environ.get(key)

def debug_profile_storage():
    url = get_env_var("SUPABASE_URL")
    key = get_env_var("SUPABASE_KEY")
    
    if not url or not key:
        print("❌ Error: Missing Supabase credentials in .env")
        return

    supabase: Client = create_client(url, key)
    
    print(f"🔍 Checking Supabase Storage at {url}...")
    
    try:
        # 1. Check if bucket exists
        buckets = supabase.storage.list_buckets()
        bucket_names = [b.name for b in buckets]
        
        if 'profile-photos' in bucket_names:
            print("✅ Bucket 'profile-photos' exists.")
            # Check if public
            bucket = next(b for b in buckets if b.name == 'profile-photos')
            if bucket.public:
                print("✅ Bucket is PUBLIC.")
            else:
                print("⚠️ Warning: Bucket is PRIVATE. Public URLs might fail.")
        else:
            print("❌ Bucket 'profile-photos' DOES NOT EXIST.")
            print("🔄 Attempting to create bucket...")
            try:
                supabase.storage.create_bucket('profile-photos', options={'public': True})
                print("✅ Successfully created 'profile-photos' bucket (public).")
            except Exception as e:
                print(f"❌ Failed to create bucket: {e}")
                print("💡 Hint: You must create the 'profile-photos' bucket in the Supabase UI and set it to PUBLIC.")

        # 2. Check Profiles table RLS
        print("\n🔍 Checking 'profiles' table permissions...")
        try:
            # Test update on a dummy ID or just check if we can select
            res = supabase.table('profiles').select("*").limit(1).execute()
            print(f"✅ Can read 'profiles' table. Found {len(res.data)} records.")
        except Exception as e:
            print(f"❌ Failed to read 'profiles' table: {e}")

        print("\n💡 ACTION REQUIRED FOR USER:")
        print("If updates continue to fail, go to Supabase -> SQL Editor and run:")
        print("CREATE POLICY \"Allow updates for owners\" ON profiles FOR UPDATE USING (auth.uid() = id);")
        print("CREATE POLICY \"Allow public read of profiles\" ON profiles FOR SELECT USING (true);")
        print("CREATE POLICY \"Public Access\" ON storage.objects FOR SELECT USING (bucket_id = 'profile-photos');")
        print("CREATE POLICY \"Upload Access\" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'profile-photos');")

    except Exception as e:
        print(f"❌ General Debug Error: {e}")

if __name__ == "__main__":
    debug_profile_storage()
