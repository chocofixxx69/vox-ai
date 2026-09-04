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

def test_clinic_deletion():
    print("🚀 Starting Clinic Deletion Test")
    
    # 1. Create a dummy clinic
    clinic_name = f"Test Clinic {uuid.uuid4().hex[:4]}"
    print(f"🏥 Creating dummy clinic: {clinic_name}")
    clinic_res = supabase.table('clinics').insert({'name': clinic_name}).execute()
    clinic_id = clinic_res.data[0]['id']
    print(f"✅ Created clinic ID: {clinic_id}")
    
    # 2. Create a dummy profile
    profile_id = str(uuid.uuid4()) # Placeholder
    print(f"👤 Creating dummy profile: {profile_id}")
    supabase.table('profiles').insert({
        'id': profile_id,
        'clinic_id': clinic_id,
        'full_name': 'Test Doctor',
        'email': f'test_{uuid.uuid4().hex[:4]}@example.com',
        'role': 'doctor'
    }).execute()
    
    # 3. Create a dummy patient
    print("📅 Creating dummy patient")
    patient_res = supabase.table('patients').insert({
        'clinic_id': clinic_id,
        'name': 'Test Patient',
        'phone_number': f'555-{uuid.uuid4().hex[:4]}'
    }).execute()
    patient_id = patient_res.data[0]['id']
    
    # 4. Create a dummy consultation
    print("📋 Creating dummy consultation")
    supabase.table('consultations').insert({
        'clinic_id': clinic_id,
        'doctor_id': profile_id,
        'patient_id': patient_id,
        'status': 'pending'
    }).execute()
    
    print("🔍 Verifying data existence...")
    assert len(supabase.table('profiles').select("*").eq('clinic_id', clinic_id).execute().data) > 0
    assert len(supabase.table('patients').select("*").eq('clinic_id', clinic_id).execute().data) > 0
    assert len(supabase.table('consultations').select("*").eq('clinic_id', clinic_id).execute().data) > 0
    
    # 5. Call the delete endpoint
    print(f"🗑️ Calling DELETE endpoint for clinic: {clinic_id}")
    delete_url = f"{API_BASE_URL}/admin/clinics/{clinic_id}"
    response = requests.delete(delete_url)
    
    if response.status_code == 200:
        print("✅ Delete endpoint returned 200 OK")
        
        # 6. Verify everything is gone
        print("🔎 Verifying all data is deleted...")
        
        profiles = supabase.table('profiles').select("*").eq('clinic_id', clinic_id).execute()
        patients = supabase.table('patients').select("*").eq('clinic_id', clinic_id).execute()
        consultations = supabase.table('consultations').select("*").eq('clinic_id', clinic_id).execute()
        clinic = supabase.table('clinics').select("*").eq('id', clinic_id).execute()
        
        assert len(profiles.data) == 0
        assert len(patients.data) == 0
        assert len(consultations.data) == 0
        assert len(clinic.data) == 0
        
        print("🎉 SUCCESS: Clinic and all associated data deleted!")
    else:
        print(f"❌ FAILED: Status code {response.status_code}")
        print(response.json())

if __name__ == "__main__":
    try:
        test_clinic_deletion()
    except Exception as e:
        print(f"❌ ERROR: {e}")
