import os
import uuid
import requests
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables
dotenv_path = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(dotenv_path=dotenv_path)
SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_KEY')

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
API_BASE_URL = "http://localhost:5001/api"

def test_clinic_update():
    print("🚀 Starting Clinic Update Test")
    
    # 1. Create a dummy clinic
    old_name = f"Original Clinic {uuid.uuid4().hex[:4]}"
    print(f"🏥 Creating dummy clinic: {old_name}")
    clinic_res = supabase.table('clinics').insert({'name': old_name}).execute()
    clinic_id = clinic_res.data[0]['id']
    print(f"✅ Created clinic ID: {clinic_id}")
    
    # 2. Update the clinic via API
    new_name = f"Updated Clinic {uuid.uuid4().hex[:4]}"
    print(f"🔄 Requesting update to: {new_name}")
    update_url = f"{API_BASE_URL}/admin/clinics/{clinic_id}"
    response = requests.patch(update_url, json={
        'name': new_name,
        'location': 'USA'
    })
    
    if response.status_code == 200:
        print("✅ Update endpoint returned 200 OK")
        
        # 3. Verify changes in DB
        print("🔎 Verifying changes in database...")
        clinic = supabase.table('clinics').select("*").eq('id', clinic_id).execute()
        data = clinic.data[0]
        
        assert data['name'] == new_name
        assert data['location'] == 'USA'
        
        print(f"🎉 SUCCESS: Clinic updated to '{new_name}' in Region 'USA'")
    else:
        print(f"❌ FAILED: Status code {response.status_code}")
        print(response.json())
        
    # Cleanup
    supabase.table('clinics').delete().eq('id', clinic_id).execute()

if __name__ == "__main__":
    try:
        test_clinic_update()
    except Exception as e:
        print(f"❌ ERROR: {e}")
