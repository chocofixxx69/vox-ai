import requests
import json

# Test the demo request endpoint
url = "http://localhost:5000/api/demo-request"
data = {
    "full_name": "Test User",
    "professional_email": "test@clinic.com",
    "clinic_name": "Test Clinic",
    "phone_number": "1234567890",
    "message": "Test message"
}

try:
    response = requests.post(url, json=data)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Error: {str(e)}")
